import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Linking, Platform, AppState } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LocationMapView from './LocationMapView';
import I18n from '../i18n';
import * as utils from '../utils';
import { useTheme } from '@ui-kitten/components';
import { check, RESULTS, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';

const { permissionUtils: { locationPermissionCheck, locationPermissionRequest } } = utils;

const Location = (props) => {
    const { values } = props;
    const [userLocation, setUserLocation] = useState(undefined);
    const [accessLocation, setAccessLocation] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('');
    const watchId = useRef(undefined);
    const isMounted = useRef(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        isMounted.current = true;
        getCurrentLocation();
        permissionRequest();
        locationCheckPermission();
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
            isMounted.current = false;
            if (watchId.current !== undefined) {
                Geolocation.clearWatch(watchId);
            }
        };
    }, []);

    useEffect(() => {
        if (isFocused) {
            permissionRequest();
            AppState.addEventListener("change", _handleAppStateChange);
        }
    }, [isFocused]);

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

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition((coords) => {
            if (isMounted.current) {
                setUserLocation(coords);
                subscribeLocationChange();
            }
        }, (error) => {
            setAccessLocation(false);
        }, { enableHighAccuracy: true, maximumAge: 0 });
    }

    const theme = useTheme();

    const subscribeLocationChange = () => {
        watchId.current = Geolocation.watchPosition((coords) => {
            setUserLocation(coords);
        }, (error) => {
        }, { showLocationDialog: false });
    };

    const styles = StyleSheet.create({
        loaderStyle: {
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
        },
        locationRequestText: {
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            color: theme['color-info-500']
        }
    });

    if (permissionStatus === 'denied') {
        return (
            <View>
                <TouchableOpacity onPress={() => permissionRequest()}>
                    <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('must_grant_or_exit')}</Text>
                </TouchableOpacity>
            </View>
        )
    } else if (permissionStatus === 'blocked') {
        return (
            <View>
                <TouchableOpacity onPress={() => Linking.openSettings()}>
                    <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('allow_blocked_permissions')}</Text>
                </TouchableOpacity>
            </View>
        )
    } else {
        if (!accessLocation) return <View style={styles.loaderStyle}>
            <Text>{I18n.t('location_denied')}</Text>
            <TouchableOpacity onPress={() => {
                setAccessLocation(true);
                getCurrentLocation();
            }}>
                <Text style={styles.locationRequestText}>{I18n.t('location_request_again')}</Text>
            </TouchableOpacity>
        </View>
        if (!userLocation) return <View style={styles.loaderStyle}>
            <Text>{I18n.t('location_alert')}</Text>
        </View>
        return (
            <LocationMapView values={values} onGetLocation={props.onGetLocation} myLocation={userLocation} />
        );
    }
};

export default Location;
