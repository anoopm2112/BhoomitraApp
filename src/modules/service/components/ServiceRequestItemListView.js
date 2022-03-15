import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Platform } from 'react-native';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from '@react-navigation/native';
import { View as AnimatedView } from 'react-native-animatable';
import moment from 'moment';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';

const { dimensionUtils: { convertHeight, convertWidth }, dateUtils: { convertToLocal } } = utils;
const { SafeAreaView, Text, Icon, Modal, Button, Header, TrackProgress } = components;

const ServiceRequestItemListView = (props) => {
    const { animationData, specialServiceRequests: { data, refreshing } } = props;
    const { tourData: { appTour } = {} } = props;
    const [sheduleItem, setSheduleItem] = useState();
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const showModal = (modal) => {
        toggleModalVisibility(modal);
    };

    const isFocused = useIsFocused();

    const [appTourTargets, addAppTourTargets] = useState([]);
    let addServiceRef = useRef();

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.fetchServices();
                }
            }
        });
    }, [isFocused]);

    useEffect(() => {
        if (isFocused && appTour.addSpecialService) {
            let appTourSequence = new AppTourSequence();
            appTourTargets.forEach(appTourTarget => {
                appTourSequence.add(appTourTarget);
            });
            AppTour.ShowSequence(appTourSequence);
        }
    }, [isFocused, appTour]);

    const getStatusColor = (id) => {
        if (id === 2) {
            // ServiceScheduled
            return theme['color-info-500'];
        }
        if (id === 7) {
            // SpecialServiceCancelled
            return theme['text-placeholder-color'];
        }
        if (id === 8) {
            // SpecialServiceApproved
            return theme['color-success-500'];
        }
        if (id === 9) {
            // SpecialServiceDeclined
            return theme['color-danger-500'];
        }
        // SpecialServiceRequested
        return theme['color-warning-500'];
    }

    const renderItem = ({ item }) => {
        return (

            <AnimatedView key={item.id} useNativeDriver animation={animationData ? 'fadeInLeft' : ''} duration={500}>
                <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card, { borderColor: getStatusColor(item.status !== undefined && item.status !== null ? item.status.id : '') }]}>
                    <View style={{ paddingHorizontal: convertWidth(13), borderBottomWidth: 0.5, borderColor: theme['border-basic-lite-color'] }}>
                        <View style={styles.secondViewContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {
                                    _.has(item, 'status') &&
                                    <View style={{ borderWidth: 2, borderColor: getStatusColor(item.status.id), borderRadius: 3, paddingHorizontal: convertWidth(10) }}>
                                        <Text category='h5' style={{ color: getStatusColor(item.status.id), fontStyle: 'italic', fontWeight: 'bold', padding: 3 }}>
                                            {_.has(item, 'status') ? item.status.name : ''}
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ borderBottomWidth: 1, borderColor: theme['border-basic-lite-color'], marginVertical: 10 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('service_id')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.id}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('special_service_provider')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceProvider') ? item.serviceProvider?.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('special_service_worker')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceWorker') ? item.serviceWorker?.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('special_service_config')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceConfig') ? item.serviceConfig?.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('special_service_requested_date')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.requestedDate ? convertToLocal(item.requestedDate) : ''} ({item.requestedDate ? moment(item.requestedDate).format('dddd') : ''})
                                    </Text>
                            </View>
                            {
                                item.processStatus && item.processStatus.length > 0 &&
                                <View style={{ marginTop: convertHeight(15) }}>
                                    <TrackProgress status={item.processStatus} />
                                </View>
                            }
                        </View>
                        <View style={styles.btnView}>
                            {
                                _.has(item, 'cancellable') && item.cancellable &&
                                <Button appearance='outline' size='small' status="danger" style={styles.btnCancel}
                                    onPress={() => { setSheduleItem(item); showModal(true) }}
                                >
                                    <Text category='h5' style={styles.textStyleBtn}>{I18n.t('cancel')}</Text>
                                </Button>
                            }
                            {
                                _.has(item, 'editable') && item.editable &&
                                <Button appearance='filled' size='small' status="primary" style={styles.btnEdit}
                                    onPress={() => props.getSpecialServiceById(item.id)}
                                >
                                    <Text category='h5' style={styles.textStyleBtnRe}>{I18n.t('special_service_edit')}</Text>
                                </Button>
                            }
                        </View>
                    </View>
                </View>
            </AnimatedView>
        );
    };

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> : <View />
    );

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
        floatingTextStyle: {
            color: theme['color-basic-600']
        },
        card: {
            alignSelf: 'stretch',
            flex: 1,
            margin: convertWidth(6),
        },
        mainContainer: {
            padding: 7,
            flex: 1
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: 10
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(14)
        },
        textStyleBtn: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(13),
            color: theme['color-basic-600'],
            fontWeight: 'bold'
        },
        textStyleBtnRe: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(13),
            color: '#fff',
            fontWeight: 'bold'
        },
        iconStyle: {
            width: convertHeight(25),
            height: convertHeight(25),
            marginRight: convertWidth(5),
            color: theme['color-basic-600']
        },
        btnCancel: {
            width: convertWidth(130),
            borderColor: theme['color-basic-600']
        },
        btnEdit: {
            width: convertWidth(130),
            backgroundColor: theme['color-basic-600'],
            borderWidth: 0
        },
        btnView: {
            paddingTop: convertWidth(10),
            paddingBottom: convertWidth(10),
            justifyContent: 'space-between', flexDirection: 'row'
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingTop: convertHeight(13),
            borderLeftWidth: convertWidth(7),
        },
        iOSShadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
        },
        androidShadow: {
            elevation: 3,
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        keyTextStyle: {
            width: convertWidth(125)
        }
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('special_services_small')} />
            <View style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item) => item.id.toString()}
                    onRefresh={() => props.fetchServices()}
                    refreshing={refreshing}
                    ListEmptyComponent={emptyList}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => <View style={{ height: convertHeight(70) }} />} />
            </View>
            <TouchableOpacity
                ref={ref => {
                    if (!ref) return;
                    addServiceRef = ref;
                    let props = {
                        order: 2,
                        title: I18n.t('tap_here_to_request_special_service'),
                        outerCircleColor: theme['color-basic-1001'],
                        cancelable: true
                    };
                    if (appTour.addSpecialService !== undefined && appTour.addSpecialService) {
                        appTourTargets.push(AppTourView.for(addServiceRef, { ...props }));
                    }
                }}
                onPress={() => { props.newSurviceRequest() }} activeOpacity={0.8}
                style={[styles.floatingBtnStyle, { bottom: convertHeight(25), width: convertWidth(42), height: convertWidth(42), borderColor: theme['color-basic-600'] }]}>
                <Icon name='plus' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(0) }]} />
            </TouchableOpacity>

            <Modal visible={showModalVisibility}
                message={I18n.t('do_you_want_to_cancel_the_service_request')}
                type='confirm'
                onCancel={() => showModal(false)}
                onOk={() => {
                    props.deleteSpecialServiceRequest(sheduleItem.id);
                    showModal(false)
                }}
            />
        </SafeAreaView>
    );
};

export default ServiceRequestItemListView;
