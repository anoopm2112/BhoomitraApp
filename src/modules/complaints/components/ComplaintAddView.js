import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, PermissionsAndroid, Linking, Platform, AppState, TouchableOpacity } from 'react-native';
import { components, I18n, utils, } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { check, RESULTS, PERMISSIONS, requestMultiple } from 'react-native-permissions';

const { Modal, Header, SafeAreaView, Content, Input, Card, Text, Button, Picker, Dropdown, ImageView } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { permissionUtils: { locationPermissionCheck, locationPermissionRequest } } = utils;

const ComplaintAddView = (props) => {
    const { newComplaint: { image } = {} } = props;
    const { complaints: { data = [], refreshing, schedule = [], enableSchedule } = {} } = props;
    const [selectedComplaint, setSelectedComplaint] = useState('');
    const [selectedComplaintItem, setSelectedComplaintItem] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [selectedScheduleItem, setSelectedScheduleItem] = useState('');
    const [userLocation, setUserLocation] = useState(undefined);
    const [accessLocation, setAccessLocation] = useState(true);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [formattedAddress, setFormattedAddress] = useState('Fetching location...');
    const [permissionStatus, setPermissionStatus] = useState('');
    const [appState, setAppState] = useState(AppState.currentState);
    const watchId = useRef(undefined);
    const isMounted = useRef(false);
    const { Item } = Picker;
    const theme = useTheme();
    const isFocused = useIsFocused();
    useEffect(() => {
        permissionRequest();
        locationCheckPermission();
        AppState.addEventListener("change", _handleAppStateChange);
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.fetchComplaints();
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
            props.deleteComplaintImage();
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
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('new_complaint')} />
            <Formik
                initialValues={{ comment: '', selectedComplaintItem: selectedComplaintItem, userLocation: userLocation, selectedScheduleItem: selectedScheduleItem }}
                onSubmit={values => {
                    let data = {
                        comment: values.comment,
                        selectedComplaintItem: selectedComplaintItem,
                        userLocation: userLocation,
                        formattedAddress: formattedAddress,
                        selectedScheduleItem: selectedScheduleItem,
                        image: image
                    };
                    props.addComplaint(data);
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        <Content>
                            <View style={styles.content} >
                                {/* {refreshing &&
                                        <ActivityIndicator size='large' color='#AAA' />} */}
                                <Card shadow style={styles.card}>
                                    <Text category='h5' style={styles.labelHead}>{I18n.t('new_complaint_request')}</Text>
                                    <View style={{ justifyContent: 'space-between' }}>
                                        <Text category='h5' style={styles.label1}>{I18n.t('complaint_type')}</Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={selectedComplaint}
                                                        selectedValue={selectedComplaint}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setSelectedComplaint(itemValue);
                                                            setSelectedComplaintItem(data ? data[itemIndex - 1] : '');
                                                            props.schedule(data ? data[itemIndex - 1] : '');
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_complaint_type')} value="select" />,
                                                                ...data?.map(option => <Item key={option.id} label={option.label} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                    </View>
                                    {
                                        (permissionStatus === 'denied') &&
                                        <View style={{ marginVertical: convertHeight(12) }}>
                                            <TouchableOpacity onPress={() => permissionRequest()}>
                                                <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('must_grant_or_exit')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    {
                                        (permissionStatus === 'blocked') &&
                                        <View style={{ marginVertical: convertHeight(12) }}>
                                            <TouchableOpacity onPress={() => Linking.openSettings()}>
                                                <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('allow_blocked_permissions')}</Text>
                                            </TouchableOpacity>
                                        </View >
                                    }
                                    {
                                        (permissionStatus === 'granted' && accessLocation === false) &&
                                        <View style={{ marginVertical: convertHeight(12) }}>
                                            <TouchableOpacity onPress={() => {
                                                setAccessLocation(true)
                                                getCurrentLocation();
                                            }}>
                                                <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('location_request_again')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    {
                                        (permissionStatus === 'granted' && accessLocation === true) &&
                                        <View style={{ marginVertical: convertHeight(15) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('location')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('location')}
                                                value={formattedAddress}
                                                multiline={true}
                                                disabled={true}
                                            />
                                        </View>
                                    }
                                    <View style={{ marginVertical: convertHeight(10) }}>
                                        <Text category='h5' style={[styles.label1, { marginBottom: convertHeight(10) }]}>{I18n.t('photo')}</Text>
                                        <ImageView navigate={props.navigateToComplaintImage} deleteImg={props.deleteComplaintImage} source={image} />
                                    </View>

                                    <View style={{ justifyContent: 'space-between' }}>
                                        <Text category='h5' style={styles.label1}>{I18n.t('schedule')}</Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        enabled={enableSchedule}
                                                        key={selectedSchedule}
                                                        selectedValue={selectedSchedule}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setSelectedSchedule(itemValue);
                                                            setSelectedScheduleItem(schedule ? schedule[itemIndex - 1] : '');
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_schedule')} value="select" />,
                                                                ...schedule?.map(option => <Item key={option.serviceExecutionId} label={option.serviceExecutionDate ? moment(option.serviceExecutionDate).format("DD-MM-YYYY") : ''} value={option.serviceExecutionId} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginBottom: convertHeight(15), marginVertical: convertHeight(5) }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('comment')}</Text>}
                                            size='large'
                                            onChangeText={handleChange('comment')}
                                            value={values.comment}
                                            multiline={true}
                                        />
                                    </View>
                                    <View style={{ marginBottom: convertHeight(15), flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Button
                                            appearance='outline'
                                            size='small'
                                            style={{ width: convertWidth(130) }}
                                            onPress={props.customerComplaints}
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
                                </Card>

                            </View>

                        </Content>
                    </>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default ComplaintAddView;
