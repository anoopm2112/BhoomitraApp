
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Geolocation from 'react-native-geolocation-service';
import { convertHeight, convertWidth } from '../utils/dimensionUtil';
import { useTheme } from '@ui-kitten/components';
import I18n from '../i18n';
import { useNetInfo } from "@react-native-community/netinfo";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getAppTourData } from '../../modules/dashboard/selectors';

const LocationMapView = (props) => {
    const [latitude, setLatitude] = useState(props.myLocation.coords.latitude);
    const [longitude, setLongitude] = useState(props.myLocation.coords.longitude);
    const [marginBottom, setMarginBottom] = useState(1);
    const [locality, setLocality] = useState('');
    const [formattedAddress, setFormattedAddress] = useState('');
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [getCoordButtonDisable, setGetCoordButtonDisable] = useState(false);
    const [previousLocation, setPreviousLocation] = useState(undefined);
    const [mapTypeView, setMapType] = useState(false);
    const mapViewRef = useRef();
    const [appTourTargets, addAppTourTargets] = useState([]);
    let locationRef = useRef();
    const isFocused = useIsFocused();
    const { appTour: { selectLocation } = {} } = useSelector(getAppTourData);
    const dispatch = useDispatch();
    const DashboardActions = require('../../modules/dashboard/actions');

    function setGeocoder() {
        setGetCoordButtonDisable(false);
        var NY = { lat: latitude, lng: longitude };

        Geocoder.geocodePosition(NY).then(res => {
            setLocality(res[0].locality);
            setFormattedAddress(res[0].formattedAddress);
        }).catch((err) => {
            setGeocoder();
        });
    }

    function getCoordinates() {
        setGetCoordButtonDisable(true);
        props.onGetLocation && props.onGetLocation({ latitude, longitude, formattedAddress });
    }

    function getCoordinatesOffline() {
        setGetCoordButtonDisable(true);
        const latitude = props.myLocation.coords.latitude;
        const longitude = props.myLocation.coords.longitude
        props.onGetLocation && props.onGetLocation({ latitude, longitude });
    }

    const netInfo = useNetInfo();

    const gotToMyLocation = () => {
        Geolocation.getCurrentPosition((coords) => {
            setLatitude(coords.coords.latitude);
            setLongitude(coords.coords.longitude);
            setGeocoder();
            setGetCoordButtonDisable(false);
            mapViewRef.current.animateCamera({ center: { latitude: coords.coords.latitude, longitude: coords.coords.longitude } });
        }, (error) => {
        }, { enableHighAccuracy: true, maximumAge: 0 });
    };

    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            alignSelf: 'center',
            height: convertHeight(400),
            width: convertWidth(320)
        },
        map: {
            width: '100%',
            height: convertHeight(310)
        },
        buttonContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: convertHeight(40)
        },
        textStyle: {
            color: theme['color-basic-100'],
        },
        myLocationIcon: {
            width: convertWidth(42),
            height: convertHeight(40),
            backgroundColor: theme['color-basic-100'],
            position: "absolute",
            justifyContent: 'center',
            alignItems: 'center',
            top: convertHeight(13),
            right: convertWidth(10),
            borderRadius: 5,
        },
        layerIcon: {
            right: convertWidth(10),
            bottom: convertWidth(15),
            justifyContent: 'center',
            alignItems: 'center',
            height: convertHeight(30),
            width: convertWidth(30),
            backgroundColor: theme['color-basic-100'],
            borderRadius: convertWidth(3)
        }
    });

    useEffect(() => {
        props.values && setPreviousLocation({ latitude: props.values.latitude, longitude: props.values.longitude });
    }, []);

    return (
        <View style={styles.container}>
            {netInfo && netInfo.isInternetReachable ?
                <View>
                    <View style={{ paddingTop: statusBarHeight }}>
                        <MapView
                            mapType={mapTypeView ? 'standard' : 'satellite'}
                            provider={PROVIDER_GOOGLE}
                            ref={ref => mapViewRef.current = ref}
                            style={[styles.map, { paddingBottom: marginBottom }]}
                            initialCamera={{
                                center: { latitude, longitude },
                                heading: 0,
                                pitch: 0,
                                zoom: 16,
                                altitude: 0
                            }}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            onPress={(e) => {
                                setLatitude(e.nativeEvent.coordinate.latitude);
                                setLongitude(e.nativeEvent.coordinate.longitude);
                                setGeocoder();
                                setGetCoordButtonDisable(false);
                            }}
                            onMapReady={() => {
                                setMarginBottom(0);
                                setGeocoder();
                                setGetCoordButtonDisable(false);
                                let appTourSequence = new AppTourSequence();
                                appTourTargets.forEach(appTourTarget => {
                                    appTourSequence.add(appTourTarget);
                                });
                                AppTour.ShowSequence(appTourSequence);
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: latitude,
                                    longitude: longitude,
                                }}
                                title={locality}
                                description={formattedAddress}
                            />
                        </MapView>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => gotToMyLocation()} style={styles.myLocationIcon}>
                            <MaterialIcons name="my-location" size={convertHeight(24)} color={theme['text-black-color']} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={{ bottom: convertHeight(25), alignItems: 'flex-end' }}
                            disabled={getCoordButtonDisable} activeOpacity={0.5} >
                            <TouchableOpacity onPress={() => { setMapType(!mapTypeView); }}
                                style={styles.layerIcon}>
                                <MaterialIcons name="layers" size={convertHeight(24)} color={theme['text-black-color']} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{ bottom: convertHeight(30) }}
                            ref={ref => {
                                if (!ref) return;
                                locationRef = ref;
                                let props = {
                                    order: 1,
                                    title: I18n.t('tap_here_to_get_location'),
                                    outerCircleColor: theme['color-basic-1001'],
                                    targetRadius: convertWidth(55),
                                    cancelable: false
                                };
                                if (selectLocation !== undefined && selectLocation) {
                                    appTourTargets.push(AppTourView.for(locationRef, { ...props }));
                                }
                            }}
                            disabled={getCoordButtonDisable} activeOpacity={0.5} onPress={() => { getCoordinates(); dispatch(DashboardActions.setAppTourDataLocation()) }}>
                            <View style={[styles.buttonContainer, getCoordButtonDisable ? { backgroundColor: theme['text-disabled-color'] } : { backgroundColor: theme['color-basic-600'] }]}>
                                <Text category="h5" style={styles.textStyle}>{getCoordButtonDisable ? I18n.t('location_received') : I18n.t('get_location')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View> :
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    {previousLocation && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text category="h3" style={{ fontWeight: 'bold', paddingVertical: convertHeight(20), textAlign: 'center' }}>{I18n.t('previous_location_show')}</Text>
                        <Text category="h5" >{I18n.t('latitude')}: {previousLocation.latitude}</Text>
                        <Text category="h5" style={{ paddingBottom: convertHeight(20) }}>{I18n.t('longitude')}: {previousLocation.longitude}</Text>
                        <Text category="h4" style={{ fontWeight: 'bold', paddingVertical: convertHeight(25), textAlign: 'center' }}>{I18n.t('previous_loc_info')}</Text>
                    </View>}
                    <Text category="h3" style={{ fontWeight: 'bold', paddingVertical: convertHeight(20) }}>{I18n.t('you_are_here')}</Text>
                    <Text category="h5" >{I18n.t('latitude')}: {props.myLocation.coords.latitude}</Text>
                    <Text category="h5" style={{ paddingBottom: convertHeight(20) }}>{I18n.t('longitude')}: {props.myLocation.coords.longitude}</Text>
                    <TouchableOpacity style={{ width: convertWidth(200) }} disabled={getCoordButtonDisable} activeOpacity={0.5} onPress={() => getCoordinatesOffline()}>
                        <View style={[styles.buttonContainer, getCoordButtonDisable ? { backgroundColor: theme['text-disabled-color'] } : { backgroundColor: theme['color-basic-600'] }]}>
                            <Text category="h5" style={styles.textStyle}>{getCoordButtonDisable ? I18n.t('location_received') : I18n.t('get_location')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
        </View>
    );
};

export default LocationMapView;
