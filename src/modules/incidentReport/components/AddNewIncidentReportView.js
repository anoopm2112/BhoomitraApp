import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, PermissionsAndroid, Linking, Platform, AppState, TouchableOpacity } from 'react-native';
import { components, I18n, utils, } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import { check, RESULTS, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import * as yup from 'yup';

const { Modal, Header, SafeAreaView, Content, Input, Card, Text, Button, Picker, Dropdown, ImageView } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { permissionUtils: { locationPermissionCheck, locationPermissionRequest } } = utils;

const AddNewIncidentReportView = (props) => {
    const { newComplaint: { image } = {} } = props;
    const { incidentReportData: { data = [], refreshing } } = props;
    const [selectedIncident, setSelectedIncident] = useState('');
    const [selectedIncidentItem, setSelectedIncidentItem] = useState('');
    const [userLocation, setUserLocation] = useState(undefined);
    const [accessLocation, setAccessLocation] = useState(true);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [formattedAddress, setFormattedAddress] = useState('Fetching location...');
    const [permissionStatus, setPermissionStatus] = useState('');
    const [locationError, setLocationError] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);
    const watchId = useRef(undefined);
    const isMounted = useRef(false);
    const { Item } = Picker;
    const theme = useTheme();
    const isFocused = useIsFocused();

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    permissionRequest();
                    locationCheckPermission();
                    AppState.addEventListener("change", _handleAppStateChange);
                    props.fetchIncidentReport();
                }
            }
        });
        isMounted.current = true;
        getCurrentLocation();
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
            isMounted.current = false;
            if (watchId.current !== undefined) {
                Geolocation.clearWatch(watchId);
            }
        };
    }, []);

    const _handleAppStateChange = async () => {
        await locationCheckPermission();
    };

    const locationCheckPermission = async () => {
        const checkStatus = await locationPermissionCheck();
        if (checkStatus) {
            setPermissionStatus('granted');
            setAccessLocation(true);
            getCurrentLocation();
        }
    }

    const permissionRequest = async () => {
        const checkStatus = await locationPermissionCheck();
        if (checkStatus) {
            setPermissionStatus('granted');
            setAccessLocation(true);
            getCurrentLocation();
            return;
        }

        const requestStatus = await locationPermissionRequest();
        if (Platform.OS === 'android') {
            if (requestStatus === PermissionsAndroid.RESULTS.GRANTED) {
                setPermissionStatus('granted');
                setAccessLocation(true);
                getCurrentLocation();
            } else if (requestStatus === PermissionsAndroid.RESULTS.DENIED) {
                setPermissionStatus('denied');
            } else if (requestStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                setPermissionStatus('blocked');
            }
        } else if (Platform.OS === 'ios') {
            if (requestStatus === RESULTS.GRANTED) {
                setPermissionStatus('granted');
                setAccessLocation(true);
                getCurrentLocation();
            } else if (requestStatus === RESULTS.DENIED) {
                setPermissionStatus('denied');
            } else if (requestStatus === RESULTS.BLOCKED) {
                setPermissionStatus('blocked');
            }
        }
    }

    function setGeocoder(lati, long) {
        var NY = { lat: lati, lng: long };
        Geocoder.geocodePosition(NY).then(res => {
            setFormattedAddress(res[0].formattedAddress);
            setLocationError(false);
        }).catch((err) => {
            setGeocoder();
        });
    }

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition((coords) => {
            if (isMounted.current) {
                setLatitude(coords.coords.latitude);
                setLongitude(coords.coords.longitude);
                setGeocoder(coords.coords.latitude, coords.coords.longitude);
                subscribeLocationChange();
                setLocationError(false);
            }
        }, (error) => {
            setAccessLocation(false);
        }, { enableHighAccuracy: true, maximumAge: 0 });
    };

    const subscribeLocationChange = () => {
        watchId.current = Geolocation.watchPosition((coords) => {
            setUserLocation(coords);
        }, (error) => {
        }, { showLocationDialog: false });
    };

    const styles = StyleSheet.create({
        content: {
            paddingHorizontal: convertWidth(13),
            paddingVertical: convertHeight(16),
            justifyContent: 'space-around',
            backgroundColor: theme['color-basic-200']
        },
        card: {
            alignSelf: 'stretch',
            justifyContent: 'space-evenly'
        },
        label: {
            color: theme['text-black-color'],
            fontSize: convertWidth(14)
        },
        labelHead: {
            color: theme['text-black-color'],
            fontSize: convertWidth(16),
            fontWeight: 'bold',
            marginBottom: convertWidth(13)
        },
        label1: {
            color: theme['text-black-color'],
            marginTop: convertWidth(12),
            fontSize: convertWidth(14)
        },
        buttonView: {
            alignSelf: 'stretch',
            justifyContent: 'flex-end',
            paddingHorizontal: convertWidth(13)
        },
        btnReshedule: {
            width: convertWidth(130),
            backgroundColor: theme['color-basic-600'],
            marginRight: convertWidth(100),
            borderWidth: 0
        },
        textStyleBtn: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(13),
            color: '#fff',
            fontWeight: 'bold'
        },
        iconStyle: {
            width: convertHeight(50),
            height: convertHeight(50),
            marginRight: convertWidth(5),
            color: theme['color-basic-600']
        },
        errorText: {
            color: theme['color-danger-500']
        }
    });

    const incidentReportValidationSchema = yup.object().shape({
        comment: yup
            .string()
            .required(I18n.t('please_enter_comment'))
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('add_incident_report')} />
            <Formik
                validationSchema={incidentReportValidationSchema}
                initialValues={{
                    comment: '',
                    selectedIncidentItem: selectedIncidentItem,
                    userLocation: userLocation,
                }}
                onSubmit={(values, { resetForm }) => {
                    if (permissionStatus === 'granted') {
                        if (latitude != '' && formattedAddress != '' && longitude != '') {
                            setLocationError(false);
                            let data = {
                                comment: values.comment,
                                selectedIncidentItem: selectedIncidentItem,
                                userLocation: { latitude: latitude, longitude: longitude },
                                formattedAddress: formattedAddress,
                                image: image
                            };
                            props.addIncidentReport(data);
                            resetForm({});
                        } else {
                            setLocationError(true);
                        }
                    }
                }}
            >
                {({ resetForm, handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        <Content>
                            <View style={styles.content} >
                                <Card shadow style={styles.card}>
                                    <Text category='h5' style={styles.labelHead}>{I18n.t('new_incident_request')}</Text>
                                    <View style={{ justifyContent: 'space-between' }}>
                                        <Text category='h5' style={styles.label1}>{I18n.t('incident_type')}</Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={selectedIncident}
                                                        selectedValue={selectedIncident}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setSelectedIncident(itemValue);
                                                            setSelectedIncidentItem(data ? data[itemIndex - 1] : '');
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_incident_type')} value="select" />,
                                                                ...data?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                        {(() => {
                                            if (permissionStatus === 'denied') {
                                                return (
                                                    <View style={{ marginTop: convertHeight(15) }}>
                                                        <TouchableOpacity onPress={() => permissionRequest()}>
                                                            <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('must_grant_or_exit')}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            } else if (permissionStatus === 'blocked') {
                                                return (
                                                    <View style={{ marginTop: convertHeight(15) }}>
                                                        <TouchableOpacity onPress={() => Linking.openSettings()}>
                                                            <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('allow_blocked_permissions')}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            } else if (permissionStatus === 'granted' && accessLocation === false) {
                                                return (
                                                    <View style={{ marginVertical: convertHeight(12) }}>
                                                        <TouchableOpacity onPress={() => {
                                                            setAccessLocation(true);
                                                            getCurrentLocation();
                                                        }}>
                                                            <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('location_request_again')}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            } else if (permissionStatus === 'granted' && accessLocation === true) {
                                                return (
                                                    <>
                                                        <View style={{ marginTop: convertHeight(15) }}>
                                                            <Input
                                                                label={<Text category='h5' style={styles.label} >{I18n.t('location')}</Text>}
                                                                size='large'
                                                                // onChangeText={handleChange('location')}
                                                                value={formattedAddress}
                                                                multiline={true}
                                                                disabled={true}
                                                            />
                                                        </View>
                                                        {locationError && <Text category='h5' style={styles.errorText}>{I18n.t('location_alert')}</Text>}
                                                    </>
                                                )
                                            }
                                        })()}
                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Text category='h5' style={[styles.label1, { marginBottom: convertHeight(10) }]}>{I18n.t('photo')}</Text>
                                            <ImageView
                                                navigate={props.navigateToComplaintImage}
                                                deleteImg={props.deleteComplaintImage}
                                                source={image}
                                            />
                                        </View>
                                        <View style={{ marginBottom: convertHeight(15), marginVertical: convertHeight(5) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('comment')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('comment')}
                                                value={values.comment}
                                                multiline={true}
                                            />
                                            {errors.comment && <Text category='h5' style={styles.errorText}>{errors.comment}</Text>}
                                        </View>

                                        <View style={{ marginBottom: convertHeight(15), flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Button
                                                appearance='outline'
                                                size='small'
                                                style={{ width: convertWidth(130) }}
                                                onPress={() => {
                                                    props.deleteComplaintImage();
                                                    resetForm({});
                                                }}
                                            >
                                                <Text category='h5'>{I18n.t('cancel')}</Text>
                                            </Button>
                                            <Button
                                                appearance='filled'
                                                size='small'
                                                status="primary"
                                                style={{
                                                    width: convertWidth(130),
                                                    backgroundColor: theme['color-basic-600'],
                                                    borderWidth: 0
                                                }}
                                                onPress={handleSubmit}
                                            >
                                                <Text appearance='alternative' category='h5'>{I18n.t('save')}</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </Card>
                            </View>
                        </Content>
                    </>
                )}
            </Formik>
        </SafeAreaView >
    );
};

export default AddNewIncidentReportView;
