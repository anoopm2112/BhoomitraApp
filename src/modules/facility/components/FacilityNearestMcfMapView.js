
import React, { useEffect, useState, } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { Text } from '@ui-kitten/components';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import { convertHeight, convertWidth } from '../../../common/utils/dimensionUtil';
import { useTheme } from '@ui-kitten/components';
import I18n from '../../../common/i18n';
import { components, utils } from '../../../common';
const { Icon, Header, Card, Button, OverlayModal } = components;
import { useNetInfo } from "@react-native-community/netinfo";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const { locationUtils: { hasLocationAccess } } = utils;

const FacilityNearestMcfMapView = (props) => {
    const [latitude, setLatitude] = useState(props.values ? props.values.latitude : props.myLocation.coords.latitude);
    const [longitude, setLongitude] = useState(props.values ? props.values.longitude : props.myLocation.coords.longitude);
    const [marginBottom, setMarginBottom] = useState(1);
    const [locality, setLocality] = useState('');
    const [selectedLoc, setSelectedLoc] = useState('');
    const [formattedAddress, setFormattedAddress] = useState('');
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [getCoordButtonDisable, setGetCoordButtonDisable] = useState(false);
    const [showModalVisibility, showModal] = useState();
    const { nearestMcf } = props;

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
        const longitude = props.myLocation.coords.longitude;
        props.onGetLocation && props.onGetLocation({ latitude, longitude });
    }

    const netInfo = useNetInfo();

    useEffect(() => {
        setTimeout(() => setStatusBarHeight(1), 500);
    }, []);

    const theme = useTheme();

    const styles = StyleSheet.create({
        floatingBtnStyle: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: convertWidth(8),
            right: convertWidth(14),
            height: convertHeight(37),
            borderRadius: convertWidth(20),
            borderWidth: 1,
            elevation: 5,
            borderColor: theme['color-basic-600'],
            backgroundColor: theme['color-basic-200']
        },
        iconStyle: {
            width: convertHeight(25),
            height: convertHeight(25),
            marginRight: convertWidth(5),
            color: theme['color-basic-600']
        },
        container: {
            alignSelf: 'center',
            height: convertHeight(360),
            width: convertWidth(350)
        },
        map: {
            width: '100%',
            height: convertHeight(550)
        },
        buttonContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: convertHeight(40)
        },
        textStyle: {
            color: theme['color-basic-100'],
        },
        customView: {
            margin: convertHeight(15),
        },
        arrow: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderTopColor: 'transparent',
            borderWidth: convertWidth(15),
            alignSelf: 'center',
            marginTop: -convertWidth(30)
        },
        arrowBorder: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderTopColor: '#fff',
            borderWidth: convertWidth(15),
            alignSelf: 'center',
            marginTop: -convertWidth(0.5)
        },
        buble: {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            backgroundColor: '#fff',
            borderRadius: convertWidth(6),
            borderColor: '#ccc',
            borderWidth: convertWidth(0.5),
            padding: convertWidth(15)
        }
    });

    return (
        <>
            <Header title={I18n.t('nearest_mcf')} />
            <View style={styles.container}>
                {netInfo && netInfo.isInternetReachable ?
                    <View>
                        <View style={{ paddingTop: statusBarHeight }}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={[styles.map, { paddingBottom: marginBottom }]}
                                initialRegion={{
                                    latitude,
                                    longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421 * ASPECT_RATIO,
                                }}
                                showsUserLocation={true}
                                showsMyLocationButton={true}
                                onPress={(e) => {
                                    setLatitude(e.nativeEvent.coordinate.latitude);
                                    setLongitude(e.nativeEvent.coordinate.longitude);
                                    setGeocoder();
                                    setGetCoordButtonDisable(false);
                                    setSelectedLoc('');
                                }}
                                onRegionChangeComplete={(region) => {
                                    setLatitude(region.latitude);
                                    setLongitude(region.longitude);
                                    setGeocoder();
                                    setGetCoordButtonDisable(false);
                                }}
                                onMapReady={() => {
                                    setMarginBottom(0);
                                    setGeocoder();
                                    setGetCoordButtonDisable(false);
                                }}
                            >
                                {nearestMcf.map(marker => (
                                    <Marker
                                        key={marker.id}
                                        coordinate={marker.coordinates}
                                        title={marker.title}
                                        description={marker.description}
                                        pinColor={marker.color}
                                        onPress={() => { setSelectedLoc(marker) }}
                                        onCalloutPress={() => setSelectedLoc(marker)}
                                    >
                                        <MapView.Callout tooltip style={styles.customView}
                                        >
                                            <View style={styles.buble}>
                                                {marker.title &&
                                                    <Text style={{ color: '#000', fontSize: convertWidth(12) }}> {marker.title}</Text>}
                                                <Text style={{ color: '#000', fontSize: convertWidth(12) }}>{marker.description}</Text>
                                            </View>
                                            <View style={styles.arrowBorder} />
                                            <View style={styles.arrow} />
                                        </MapView.Callout>
                                    </Marker>
                                ))}
                            </MapView>
                        </View>
                    </View> :
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        {props.values && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text category="h3" style={{ fontWeight: 'bold', paddingVertical: convertHeight(20), textAlign: 'center' }}>{I18n.t('previous_location_show')}</Text>
                            <Text category="h5" >{I18n.t('latitude')}: {props.values.latitude}</Text>
                            <Text category="h5" style={{ paddingBottom: convertHeight(20) }}>{I18n.t('longitude')}: {props.values.longitude}</Text>
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
                    </View>
                }
                {
                    selectedLoc !== '' &&
                    <>
                        <TouchableOpacity
                            onPress={() => showModal(true)}
                            activeOpacity={0.8}
                            style={[styles.floatingBtnStyle, { bottom: -convertHeight(75), width: convertWidth(42), height: convertWidth(42), borderColor: theme['color-basic-600'] }]}>
                            <Icon name='card-text' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(0) }]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => hasLocationAccess(selectedLoc.coordinates.latitude, selectedLoc.coordinates.longitude)}
                            activeOpacity={0.8}
                            style={[styles.floatingBtnStyle, { bottom: -convertHeight(125), width: convertWidth(42), height: convertWidth(42), borderColor: theme['color-basic-600'] }]}>
                            <Icon name='directions' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(0) }]} />
                        </TouchableOpacity>
                    </>
                }

                <TouchableOpacity onPress={() => props.fetchNearestMcf(props.myLocation.coords)}
                    activeOpacity={0.8}
                    style={[styles.floatingBtnStyle, { bottom: -convertHeight(175), width: convertWidth(42), height: convertWidth(42), borderColor: theme['color-basic-600'] }]}>
                    <Icon name='refresh' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(0) }]} />
                </TouchableOpacity>

                <OverlayModal
                    visible={showModalVisibility}
                    onCancel={() => {
                        showModal(false);
                    }}
                >
                    <View style={{ padding: convertHeight(10) }}>
                        <View style={{ left: -convertHeight(50) }}>
                            <Text style={{ fontSize: convertHeight(14), fontWeight: 'bold', marginBottom: convertHeight(5) }} numberOfLines={1}>{I18n.t('description')}</Text>
                            <Text style={{ flexShrink: 1, marginBottom: convertHeight(5) }} numberOfLines={1}>{selectedLoc.description}</Text>
                            {
                                selectedLoc !== '' &&
                                <View>
                                    <Text style={{ fontSize: convertHeight(14), fontWeight: 'bold', marginBottom: convertHeight(5) }} numberOfLines={1}>{I18n.t('latitude')} : </Text>
                                    <Text style={{ flexShrink: 1, marginBottom: convertHeight(5) }} numberOfLines={1}> {selectedLoc.coordinates.latitude}</Text>
                                    <Text style={{ fontSize: convertHeight(14), fontWeight: 'bold', marginBottom: convertHeight(5) }} numberOfLines={1}>{I18n.t('longitude')} : </Text>
                                    <Text style={{ flexShrink: 1, marginBottom: convertHeight(5) }} numberOfLines={1}>{selectedLoc.coordinates.longitude}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button style={{ marginTop: convertHeight(20), width: convertHeight(100) }} onPress={() => showModal(false)} size='small'
                            >
                                {I18n.t('ok')}
                            </Button>
                        </View>
                    </View>
                </OverlayModal>
            </View>
        </>
    );
};

export default FacilityNearestMcfMapView;
