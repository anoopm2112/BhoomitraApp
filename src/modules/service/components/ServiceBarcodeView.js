import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { createAnimatableComponent } from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import { useNetInfo } from '@react-native-community/netinfo';
import _ from 'lodash';
import { RESOURCE_MAPPING, ACTION_MAPPING } from '../../../common/constants';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';

const {
    dimensionUtils: { convertHeight, convertWidth },
    locationUtils: { hasLocationAccess },
    permissionUtils: { hasAccessPermission },
    userUtils: { hasGtRole } } = utils;
const { Text, Icon, Card, Header, Modal, Content } = components;

const ServiceBarcodeView = (props) => {
    const { animationData, tourData: { appTour } = {} } = props;
    const [appTourTargets, addAppTourTargets] = useState([]);
    let subscriptionRef = useRef();
    let serviceRef = useRef();
    const [internetReachable, setInternetReachable] = useState(false);
    const animationRefs = useRef({});
    const {
        loadCustomerProfile, resetCustomerProfile,
        navigateToServiceItemList, navigateToServiceItemComplaintList,
        startEnrollmentSurvey, startQrCodeEnrollment,
        startMobileServiceEnrollment, navigateToServicePayment,
        navigateToComplaintItemList
    } = props;
    const { data: { qrCode } } = props.route.params;
    const animation = 'bounceIn';
    const {
        queued, progress, processed, failed,
        serviceBarcode: { showResumeModal, configs },
        unsetProcessed, userRoles, userInfo
    } = props;

    const { initDone, customerProfile, customerPhoto, items,
        items: { customerEnrollmentId, qrCodeEnrollmentId, serviceEnrollmentId } } = configs;

    const locationMap = (location) => {
        hasLocationAccess(location.latitude, location.longitude);
    };

    const phoneToCall = (phone) => {
        const phoneNumber = phone;
        if (phoneNumber) {
            Linking.canOpenURL(`tel:${phoneNumber}`).then(supported => {
                if (!supported) {
                } else {
                    return Linking.openURL(`tel:${phoneNumber}`);
                }
            });
        }
    };

    let outstanding = 0;
    let advance = 0;

    if (initDone) {
        const { payments } = customerProfile;
        if (!_.isEmpty(payments)) {
            payments.forEach(payment => {
                outstanding += payment.outstanding;
                advance += payment.advance;
            });
        }
    }

    const EnrollmentIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="account-details-outline" pack="material-community" style={{ height: convertHeight(20), color: theme['color-basic-600'] }} />
    ));

    const QrCodeIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="qrcode-scan" pack="material-community" style={{ height: convertHeight(20), color: theme['color-basic-600'] }} />
    ));

    const ServiceIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="clipboard-text-outline" pack="material-community" style={{ height: convertHeight(20), color: theme['color-basic-600'] }} />
    ));

    const AlertIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="alert-circle-outline" pack="material-community" style={{ height: convertHeight(28), color: theme['color-danger-500'] }} />
    ));

    const CheckBoxMarkedIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="checkbox-marked-circle" pack="material-community" style={{ height: convertHeight(28), color: theme['color-success-500'] }} />
    ));

    const AnimatedEnrollmentIcon = createAnimatableComponent(EnrollmentIcon);
    const AnimatedQrCodeIcon = createAnimatableComponent(QrCodeIcon);
    const AnimatedServiceIcon = createAnimatableComponent(ServiceIcon);
    const AnimatedAlertIcon = createAnimatableComponent(AlertIcon);
    const AnimatedCheckBoxMarkedIcon = createAnimatableComponent(CheckBoxMarkedIcon);

    const netInfo = useNetInfo();

    useEffect(() => {
        setInternetReachable(netInfo.isInternetReachable);
    }, [netInfo]);

    useEffect(() => {
        Object.values(items).forEach(item => {
            if (progress.hasOwnProperty(item)) {
                animationRefs.current[item] = animation;
            }
        });
    }, [progress, items]);

    useEffect(() => {
        Object.values(items).forEach(item => {
            if (processed.includes(item)) {
                setTimeout(() => {
                    unsetProcessed(item);
                }, 1000);
            }
        });
    }, [processed, items]);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadCustomerProfile({ qrCode });
        } else {
            resetCustomerProfile();
        }
    }, [isFocused]);

    useEffect(() => {
        if (isFocused && customerProfile && appTourTargets.length === 1) {
            setTimeout(() => {
                let appTourSequence = new AppTourSequence();
                appTourTargets.forEach(appTourTarget => {
                    appTourSequence.add(appTourTarget);
                });
                AppTour.ShowSequence(appTourSequence);
            }, 10);
        }
    }, [isFocused, customerProfile, appTourTargets]);

    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            alignSelf: 'stretch',
            margin: convertWidth(10)
        },
        viewContainer: {
            paddingBottom: convertHeight(10),
            borderBottomWidth: convertWidth(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: theme['border-basic-lite-color']
        },
        userIcon: {
            width: convertWidth(85),
            height: convertWidth(85),
            borderRadius: convertWidth(85 / 2)
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left'
        },
        keyTextStyle: {
            width: convertWidth(152),
            paddingLeft: convertWidth(12)
        },
        iconStyle: {
            marginVertical: convertHeight(5)
        },
        textBackground: {
            flexDirection: 'row',
            backgroundColor: '#F7F9FC',
            height: convertWidth(36),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: convertWidth(4),
            marginVertical: convertWidth(6),
            paddingHorizontal: convertWidth(6)
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        payments: {
            borderRadius: convertWidth(5),
            borderWidth: 1,
            elevation: 5,
            borderColor: theme['color-basic-600'],
            backgroundColor: theme['color-basic-200'],
            paddingHorizontal: convertWidth(10)
        },
        floatingBtnStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: convertWidth(8),
            marginBottom: convertWidth(10),
            width: convertWidth(140),
            height: convertHeight(37),
            borderRadius: convertWidth(20),
            borderWidth: 1,
            elevation: 5,
            borderColor: theme['color-basic-600'],
            backgroundColor: theme['color-basic-200']
        },
        floatingTextStyle: {
            color: theme['color-basic-600'],
            paddingLeft: convertWidth(7),
            flexShrink: 1
        },
        iconViewStyle: {
            flex: 22,
            alignItems: 'center'
        },
        textViewStyle: {
            flex: 78
        }
    });

    return (
        <>
            <Header title={I18n.t('customer_profile')} />
            {
                initDone ?
                    <Content>
                        <Card shadow style={styles.card}>
                            <View style={styles.viewContainer}>
                                <View style={{ justifyContent: 'center' }}>
                                    {customerPhoto ? <Image source={{ uri: `data:image/*;base64,${customerPhoto}` }} style={styles.userIcon} /> :
                                        <Icon name={'account-circle'} pack="material-community" style={[styles.userIcon, { color: theme['color-basic-1000'] }]} />}
                                </View>
                                <View style={{ justifyContent: 'center', width: convertWidth(215) }}>
                                    <Text category="h3" style={{ flexShrink: 1, fontWeight: 'bold' }} numberOfLines={2}>{customerProfile.name || 'NA'}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>{customerProfile.wardNumber || '-'}-</Text>
                                        <Text>{customerProfile.ward || ''}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ paddingTop: convertWidth(6), flexDirection: 'row', borderColor: theme['border-basic-lite-color'], borderBottomWidth: 1, paddingBottom: convertHeight(5) }}>
                                <TouchableOpacity onPress={() => phoneToCall(customerProfile.phone)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: theme['border-basic-lite-color'] }}>
                                    <Icon name="phone" pack="material-community" style={[styles.iconStyle, { height: convertHeight(28), color: theme['color-basic-600'] }]} />
                                    <Text style={{ fontSize: convertWidth(13), textAlign: 'center' }}>{customerProfile.phone || 'NA'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => locationMap(customerProfile.location)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="crosshairs-gps" pack="material-community" style={[styles.iconStyle, { height: convertHeight(28), color: theme['color-basic-600'] }]} />
                                    <Text numberOfLines={1} style={{ fontSize: convertWidth(13), textAlign: 'center', paddingHorizontal: convertWidth(5) }}>{customerProfile.location?.formattedAddress || '--'}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: convertHeight(10) }}>
                                <View style={styles.textBackground}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category="h5">{I18n.t('customer_number')}</Text>
                                    </View>
                                    <Text category="h5" style={styles.fullColonSpace}>:</Text>
                                    <Text category="h5" style={styles.textStyle}>
                                        {customerProfile.customerNumber || '--'}
                                    </Text>
                                </View>

                                <View style={styles.textBackground}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category="h5">{I18n.t('organization')}</Text>
                                    </View>
                                    <Text category="h5" style={styles.fullColonSpace}>:</Text>
                                    <Text category="h5" style={styles.textStyle}>
                                        {customerProfile.lsgi || '--'}
                                    </Text>
                                </View>
                                <View style={[styles.textBackground, { marginBottom: convertHeight(10) }]}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category="h5">{I18n.t('property_name')}</Text>
                                    </View>
                                    <Text category="h5" style={styles.fullColonSpace}>:</Text>
                                    <Text category="h5" style={styles.textStyle}>
                                        {customerProfile.propertyName}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                        <View style={[styles.card, { flexDirection: 'row' }]}>
                            {
                                hasGtRole(userInfo) &&
                                <View style={{ flex: 1 }}>
                                    <View style={styles.payments}>
                                        <View style={{ flexDirection: 'row', paddingVertical: convertHeight(15), borderBottomWidth: 1, borderBottomColor: theme['border-basic-lite-color'] }}>
                                            <View style={{ flex: 0.6, flexDirection: 'row' }}>
                                                <View style={{ flex: 0.95 }}>
                                                    <Text style={{ flexShrink: 1 }} numberOfLines={1} category="h5">{I18n.t('outstanding')}</Text>
                                                </View>
                                                <View style={{ flex: 0.05, alignItems: 'flex-end' }}>
                                                    <Text category="h5">:</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                                <Text style={{ flexShrink: 1 }} status='danger' numberOfLines={1} category="h4">{'₹ ' + outstanding}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingVertical: convertHeight(15) }}>
                                            <View style={{ flex: 0.6, flexDirection: 'row' }}>
                                                <View style={{ flex: 0.95 }}>
                                                    <Text style={{ flexShrink: 1 }} numberOfLines={1} category="h5">{I18n.t('advance')}</Text>
                                                </View>
                                                <View style={{ flex: 0.05, alignItems: 'flex-end' }}>
                                                    <Text category="h5">:</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                                <Text style={{ flexShrink: 1 }} status='success' numberOfLines={1} category="h4">{'₹ ' + advance}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            }
                            <View style={{ flex: 1 }}>
                                <View style={{ alignItems: 'flex-end' }}>
                                    {
                                        customerEnrollmentId &&
                                        hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.START_SURVEY_CARD) &&
                                        <TouchableOpacity
                                            disabled={
                                                internetReachable ?
                                                    customerEnrollmentId ?
                                                        (queued.includes(customerEnrollmentId) || progress.hasOwnProperty(customerEnrollmentId)) :
                                                        false :
                                                    false
                                            }
                                            onPress={() => {
                                                startEnrollmentSurvey({ surveyId: customerEnrollmentId, secureEdit: true });
                                            }}
                                            activeOpacity={0.8} style={styles.floatingBtnStyle}>
                                            <View style={styles.iconViewStyle}>
                                                {
                                                    internetReachable ?
                                                        queued.includes(customerEnrollmentId) ?
                                                            <MaterialIndicator size={convertHeight(25)} color={theme['color-basic-600']} /> :
                                                            progress.hasOwnProperty(customerEnrollmentId) ?
                                                                <Progress.Pie color={theme['color-basic-600']} progress={progress[customerEnrollmentId]} size={convertHeight(25)} /> :
                                                                processed.includes(customerEnrollmentId) ?
                                                                    <AnimatedCheckBoxMarkedIcon useNativeDriver animation={animationData ? animation : undefined} /> :
                                                                    failed.includes(customerEnrollmentId) ?
                                                                        <AnimatedAlertIcon useNativeDriver animation={animationData ? animation : undefined} /> :
                                                                        <AnimatedEnrollmentIcon useNativeDriver onAnimationEnd={() => { animationRefs.current[customerEnrollmentId] = undefined }} animation={animationData ? animationRefs.current[customerEnrollmentId] : undefined} /> :
                                                        <EnrollmentIcon />
                                                }
                                            </View>
                                            <View style={styles.textViewStyle}>
                                                <Text category="h5" numberOfLines={1} style={styles.floatingTextStyle}>{I18n.t('enrollment')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        (customerEnrollmentId && qrCodeEnrollmentId) &&
                                        hasAccessPermission(userRoles, RESOURCE_MAPPING.QRCODE, ACTION_MAPPING.QRCODE.ACCESS_QRCODE_IN_NAV) &&
                                        <TouchableOpacity
                                            disabled={
                                                internetReachable ?
                                                    qrCodeEnrollmentId ?
                                                        (queued.includes(qrCodeEnrollmentId) || progress.hasOwnProperty(qrCodeEnrollmentId)) :
                                                        false :
                                                    false
                                            }
                                            onPress={() => {
                                                startQrCodeEnrollment({ customerEnrollmentId, qrCodeEnrollmentId, secureEdit: true });
                                            }}
                                            activeOpacity={0.8} style={styles.floatingBtnStyle}>
                                            <View style={styles.iconViewStyle}>
                                                {
                                                    internetReachable ?
                                                        queued.includes(qrCodeEnrollmentId) ?
                                                            <MaterialIndicator size={convertHeight(25)} color={theme['color-basic-600']} /> :
                                                            progress.hasOwnProperty(qrCodeEnrollmentId) ?
                                                                <Progress.Pie color={theme['color-basic-600']} progress={progress[qrCodeEnrollmentId]} size={convertHeight(25)} /> :
                                                                processed.includes(qrCodeEnrollmentId) ?
                                                                    <AnimatedCheckBoxMarkedIcon useNativeDriver animation={animation} /> :
                                                                    failed.includes(qrCodeEnrollmentId) ?
                                                                        <AnimatedAlertIcon useNativeDriver animation={animation} /> :
                                                                        <AnimatedQrCodeIcon useNativeDriver onAnimationEnd={() => { animationRefs.current[qrCodeEnrollmentId] = undefined }} animation={animationRefs.current[qrCodeEnrollmentId]} /> :
                                                        <QrCodeIcon />
                                                }
                                            </View>
                                            <View style={styles.textViewStyle}>
                                                <Text category="h5" numberOfLines={1} style={styles.floatingTextStyle}>{I18n.t('qr_code')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        hasAccessPermission(userRoles, RESOURCE_MAPPING.SERVICE_ENROLLMENT, ACTION_MAPPING.SERVICE_ENROLLMENT.DO_SERVICE_ENROLLEMENT) &&
                                        <TouchableOpacity
                                            ref={ref => {
                                                if (!ref) return;
                                                subscriptionRef = ref;
                                                let props = {
                                                    order: 1,
                                                    title: I18n.t('tap_here_to_start_service_enrollment'),
                                                    outerCircleColor: theme['color-basic-1001'],
                                                    cancelable: true
                                                };
                                                if (appTour.enrollCustomerService !== undefined && appTour.enrollCustomerService) {
                                                    appTourTargets.push(AppTourView.for(subscriptionRef, { ...props }));
                                                }
                                            }}
                                            disabled={
                                                internetReachable ?
                                                    serviceEnrollmentId ?
                                                        (queued.includes(serviceEnrollmentId) || progress.hasOwnProperty(serviceEnrollmentId)) :
                                                        false :
                                                    false
                                            }
                                            onPress={() => {
                                                startMobileServiceEnrollment({ qrCode, customerProfile });
                                            }}
                                            activeOpacity={0.8} style={styles.floatingBtnStyle}>
                                            <View style={styles.iconViewStyle}>
                                                {
                                                    serviceEnrollmentId === undefined ?
                                                        <ServiceIcon /> :
                                                        internetReachable ?
                                                            queued.includes(serviceEnrollmentId) ?
                                                                <MaterialIndicator size={convertHeight(25)} color={theme['color-basic-600']} /> :
                                                                progress.hasOwnProperty(serviceEnrollmentId) ?
                                                                    <Progress.Pie color={theme['color-basic-600']} progress={progress[serviceEnrollmentId]} size={convertHeight(25)} /> :
                                                                    processed.includes(serviceEnrollmentId) ?
                                                                        <AnimatedCheckBoxMarkedIcon useNativeDriver animation={animation} /> :
                                                                        failed.includes(serviceEnrollmentId) ?
                                                                            <AnimatedAlertIcon useNativeDriver animation={animation} /> :
                                                                            <AnimatedServiceIcon useNativeDriver onAnimationEnd={() => { animationRefs.current[serviceEnrollmentId] = undefined }} animation={animationRefs.current[serviceEnrollmentId]} /> :
                                                            <ServiceIcon />
                                                }
                                            </View>
                                            <View style={styles.textViewStyle}>
                                                <Text category="h5" numberOfLines={1} style={styles.floatingTextStyle}>{I18n.t('subscriptions')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        hasAccessPermission(userRoles, RESOURCE_MAPPING.SERVICE, ACTION_MAPPING.SERVICE.DO_SERVICE_EXECUTION) &&
                                        <TouchableOpacity
                                            ref={ref => {
                                                if (!ref) return;
                                                serviceRef = ref;
                                                let props = {
                                                    order: 2,
                                                    title: I18n.t('tap_here_to_open_scanner_and_load_customer'),
                                                    outerCircleColor: theme['color-basic-1001'],
                                                };
                                                // if (appTour.startCustomerService && appTour.startCustomerService !== undefined && appTour.startCustomerService && !appTour.enrollCustomerService) {
                                                //     appTourTargets.push(AppTourView.for(serviceRef, { ...props }));
                                                // }
                                            }}
                                            onPress={() => { navigateToServiceItemList({ customerProfile }); }} activeOpacity={0.8} style={styles.floatingBtnStyle}>
                                            <View style={styles.iconViewStyle}>
                                                <Icon name="tools" pack="material-community" style={{ height: convertHeight(20), color: theme['color-basic-600'] }} />
                                            </View>
                                            <View style={styles.textViewStyle}>
                                                <Text category="h5" numberOfLines={1} style={styles.floatingTextStyle}>{I18n.t('services')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.COMPLAINTS_CARD) &&
                                        <TouchableOpacity onPress={() => { navigateToComplaintItemList({ customerProfile }); }} activeOpacity={0.8} style={styles.floatingBtnStyle}>
                                            <View style={styles.iconViewStyle}>
                                                <Icon name="inbox-multiple" pack="material-community" style={{ height: convertHeight(20), color: theme['color-basic-600'] }} />
                                            </View>
                                            <View style={styles.textViewStyle}>
                                                <Text category="h5" numberOfLines={1} style={styles.floatingTextStyle}>{I18n.t('complaints_small')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.PAYMENTS_CARD) &&
                                        <TouchableOpacity onPress={() => {
                                            const { customerNumber } = customerProfile;
                                            navigateToServicePayment({ customerNumber });
                                        }} activeOpacity={0.8} style={styles.floatingBtnStyle}>
                                            <View style={styles.iconViewStyle}>
                                                <Icon name="cash-multiple" pack="material-community" style={{ height: convertHeight(20), color: theme['color-basic-600'] }} />
                                            </View>
                                            <View style={styles.textViewStyle}>
                                                <Text category="h5" numberOfLines={1} style={styles.floatingTextStyle}>{I18n.t('payments_small')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
                    </Content> :
                    <Content style={{ justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: convertWidth(20) }}>
                            <View style={{ marginRight: convertWidth(8) }}>
                                <MaterialIndicator size={convertHeight(22)} color={theme['text-basic-color']} />
                            </View>
                            <Text style={{ flexShrink: 1 }} numberOfLines={2}>{I18n.t('loading_customer_profile')}</Text>
                        </View>
                    </Content>
            }
            {
                <Modal visible={showResumeModal}
                    type='confirm'
                    message={I18n.t('confirm_survey_resume')}
                    okText={I18n.t('do_resume')}
                    onOk={() => {
                        props.doResume();
                    }}
                    cancelText={I18n.t('dont_resume')}
                    onCancel={() => {
                        props.dontResume();
                    }}
                />
            }
        </>
    );
};

export default ServiceBarcodeView;
