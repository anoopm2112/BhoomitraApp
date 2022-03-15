import React, { useEffect, useState, useRef, createRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Platform, Image, DeviceEventEmitter } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { useIsFocused } from '@react-navigation/native';
import { View as AnimatedView } from 'react-native-animatable';
import { useNetInfo } from '@react-native-community/netinfo';
import _ from 'lodash';
import { CUSTOMER_ENROLLMENT_LIST_VIEW_KEYS } from '../constants';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import * as Progress from 'react-native-progress';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';

const { dimensionUtils: { convertHeight, convertWidth }, userUtils: { hasGtRole } } = utils;
const { SafeAreaView, Text, Icon } = components;

const EntrollmentQrCodeView = (props) => {
    const { animationData, drawerStatusData, tourData: { appTour } = {} } = props;
    const [visited, setVisited] = useState([]);
    const [internetReachable, setInternetReachable] = useState(false);

    const animatedViewRefsMap = useRef({});
    const flatListRef = useRef();

    const [appTourTargets, addAppTourTargets] = useState([]);

    const {
        queued, progress, processed, failed,
        pendingQrCodeSurveys: { refreshing, data },
        startQrCodeEnrollment, navigation, clearPendingQrCodeSurveys, unsetProcessed
    } = props;
    const cardRefs = useRef([]);
    cardRefs.current = data !== undefined ? data.map((element, i) => cardRefs.current[i] ?? createRef()) : '';

    const QrCodeIcon = (props) => (
        <Icon name="qrcode-scan" pack="material-community" style={styles.qrIcon} />
    );

    const CheckBoxMarkedIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="checkbox-marked-circle" pack="material-community" style={{ height: convertHeight(28), color: theme['color-success-500'] }} />
    ));

    useEffect(() => {
        if (drawerStatusData === true && data !== undefined && data.length > 0 && isFocused && appTour !== undefined && appTour.qrEnrollment && appTourTargets.length === 1) {
            setTimeout(() => {
                let appTourSequence = new AppTourSequence();
                appTourTargets.forEach(appTourTarget => {
                    appTourSequence.add(appTourTarget);
                });
                AppTour.ShowSequence(appTourSequence);
            }, 10);
        }
    }, [isFocused, data, appTourTargets]);

    useEffect(() => {
        registerSequenceStepEvent();
        registerFinishSequenceEvent();
    }, []);

    const registerSequenceStepEvent = () => {
        let sequenceStepListener = '';
        if (sequenceStepListener) {
            sequenceStepListener.remove();
        }
        sequenceStepListener = DeviceEventEmitter.addListener(
            'onShowSequenceStepEvent',
            (e) => {
                console.log(e);
            },
        );
    };

    const registerFinishSequenceEvent = () => {
        let finishSequenceListener = '';
        if (finishSequenceListener) {
            finishSequenceListener.remove();
        }
        finishSequenceListener = DeviceEventEmitter.addListener(
            'onFinishSequenceEvent',
            (e) => {
                console.log(e);
            },
        );
    };

    const renderItem = ({ item, index }) => {
        const { details = [] } = item;
        const renderObjs = [];
        let customerPropertyName = {}, ward = {}, image = {};
        Object.keys(CUSTOMER_ENROLLMENT_LIST_VIEW_KEYS).forEach(key => {
            if (key === 'ENROLLMENT_CUSTOMER_PROPERTY_NAME') {
                customerPropertyName = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_NAME']) || {};
            } else if (key === 'ENROLLMENT_CUSTOMER_WARD') {
                ward = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_WARD']) || {};
            } else if (key === 'ENROLLMENT_CUSTOMER_IMAGE') {
                image = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_IMAGE']) || {};
            }
        });
        if (progress.hasOwnProperty(item.qrCodeEnrollmentId) && !visited.includes(item.qrCodeEnrollmentId)) {
            setVisited([...visited, item.qrCodeEnrollmentId]);
            flatListRef.current.scrollToIndex({ animated: true, viewOffset: convertHeight(100), index, viewPosition: 0.5 });
        }
        return (
            <AnimatedView
                pointerEvents={
                    internetReachable ?
                        (queued.includes(item.qrCodeEnrollmentId) || progress.hasOwnProperty(item.qrCodeEnrollmentId)) ?
                            'none' :
                            'auto' :
                        'auto'
                }
                useNativeDriver
                animation={animationData ? 'fadeInLeft' : undefined}
                duration={500}
                ref={ref => animatedViewRefsMap.current[item.qrCodeEnrollmentId] = ref}
                style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card, { borderColor: !item.completed ? theme['color-warning-500'] : failed.includes(item.qrCodeEnrollmentId) ? theme['color-danger-500'] : theme['color-success-500'] }]}
            >
                <TouchableOpacity
                    ref={ref => {
                        if (!ref) return;
                        cardRefs.current[index] = ref;
                        let props = {
                            order: index,
                            title: I18n.t('tap_here_to_open_qr_scanner'),
                            cancelable: true,
                            outerCircleColor: theme['color-basic-1001'],
                            targetRadius: convertHeight(55),
                        };
                        if (appTour !== undefined && appTour.qrEnrollment && index === 0) {
                            appTourTargets.push(AppTourView.for(cardRefs.current[index], { ...props }));
                        }
                    }}
                    onPress={() => {
                        startQrCodeEnrollment(item);
                        props.resetQrEnrollmentTourData(false);
                    }}>
                    <View style={renderObjs.length ? styles.viewContainer : [styles.viewContainer, { borderBottomWidth: 0 }]}>
                        <View style={{ justifyContent: 'center' }}>
                            {image.value ?
                                <Image style={styles.userIcon} source={{ uri: `data:image/*;base64,${image.value}` }} /> :
                                <Icon name={'account-circle'} pack="material-community" style={[styles.userIcon, { color: theme['color-basic-1000'] }]} />}
                        </View>
                        <View style={{ justifyContent: 'center', width: convertWidth(200) }}>
                            <Text category='h5' style={{ flexShrink: 1 }} numberOfLines={2}>
                                {customerPropertyName.value ? customerPropertyName.value : I18n.t('name_not_available')}
                            </Text>
                            <Text>{(ward.value && ward.value.name) ? ward.value.name : I18n.t('ward_not_available')}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            {
                                internetReachable ?
                                    queued.includes(item.qrCodeEnrollmentId) ?
                                        <MaterialIndicator size={convertHeight(25)} color={theme['color-basic-600']} /> :
                                        progress.hasOwnProperty(item.qrCodeEnrollmentId) ?
                                            <Progress.Pie color={theme['color-basic-600']} progress={progress[item.qrCodeEnrollmentId]} size={convertHeight(25)} /> :
                                            processed.includes(item.qrCodeEnrollmentId) ?
                                                <CheckBoxMarkedIcon /> :
                                                <QrCodeIcon /> :
                                    <QrCodeIcon />
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </AnimatedView>
        )
    }

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> :
            <View />
    );

    const netInfo = useNetInfo();
    const isFocused = useIsFocused();

    useEffect(() => {
        setInternetReachable(netInfo.isInternetReachable);
    }, [netInfo]);

    useEffect(() => {
        const processedData = {};
        if (!_.isEmpty(data)) {
            data.forEach(item => {
                if (processed.includes(item.qrCodeEnrollmentId)) {
                    processedData[item.qrCodeEnrollmentId] = item.customerEnrollmentId;
                }
            });
        }
        const qrCodeEnrollmentIds = Object.keys(processedData) || [];
        const customerEnrollmentIds = Object.values(processedData) || [];
        if (qrCodeEnrollmentIds.length) {
            if (isFocused) {
                const promises = [];
                qrCodeEnrollmentIds.forEach(surveyId => {
                    if (animatedViewRefsMap.current[surveyId]) {
                        if (animationData) {
                            promises.push(animatedViewRefsMap.current[surveyId].fadeOutRight(500));
                        } else {
                            promises.push(animatedViewRefsMap.current[surveyId]);

                        }
                    }
                });
                if (promises.length) {
                    Promise.all(promises).then(() => {
                        qrCodeEnrollmentIds.forEach(surveyId => {
                            delete animatedViewRefsMap.current[surveyId];
                            setVisited(visited.filter(item => item !== surveyId));
                            if (processed.includes(surveyId)) {
                                unsetProcessed(surveyId);
                            }
                        });
                        clearPendingQrCodeSurveys(customerEnrollmentIds);
                    });
                }

            } else {
                qrCodeEnrollmentIds.forEach(surveyId => {
                    if (processed.includes(surveyId)) {
                        unsetProcessed(surveyId);
                    }
                });
                clearPendingQrCodeSurveys(customerEnrollmentIds);
            }
        }
    }, [processed, data, isFocused]);

    useEffect(() => {
        setVisited(visited.filter(item => progress.hasOwnProperty(item)));
    }, [progress]);

    useEffect(() => {
        const focusUnsubscribe = navigation.addListener('focus', () => {
            props.loadPendingQrCodeSurveys();
        });

        return focusUnsubscribe;
    }, [navigation]);


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
            borderWidth: convertWidth(1),
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
            borderLeftWidth: convertWidth(7),
        },
        mainContainer: {
            padding: convertWidth(6),
            flex: 1
        },
        viewContainer: {
            height: convertHeight(65),
            borderBottomWidth: convertWidth(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: theme['border-basic-lite-color']
        },
        deleteIcon: {
            color: theme['color-danger-500'],
            width: convertHeight(25),
            height: convertHeight(25)
        },
        serviceIcon: {
            color: theme['color-primary-400'],
            width: convertHeight(25),
            height: convertHeight(25)
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: convertHeight(10)
        },
        secondViewContainer: {
            paddingVertical: convertWidth(8)
        },
        verticleLine: {
            height: '100%',
            width: convertWidth(2),
            backgroundColor: theme['border-basic-lite-color'],
            marginHorizontal: convertWidth(10)
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left'
        },
        iconStyle: {
            width: convertHeight(18),
            height: convertHeight(18),
            marginRight: convertWidth(5)
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingHorizontal: convertWidth(13)
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
        userIcon: {
            width: convertWidth(45),
            height: convertWidth(45),
            borderRadius: convertWidth(45 / 2)
        },
        qrIcon: {
            color: theme['color-primary-400'],
            width: convertHeight(22),
            height: convertHeight(22)
        },
    });

    return (
        <SafeAreaView>
            <View pointerEvents={refreshing ? 'none' : 'auto'} style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => renderItem({ item, index })}
                    keyExtractor={(item) => item.customerEnrollmentId}
                    onRefresh={() => { }}
                    ref={flatListRef}
                    refreshing={refreshing}
                    onEndReached={() => { }}
                    ListEmptyComponent={emptyList}
                    ListFooterComponent={() => <View style={{ height: hasGtRole(props.userInfo) ? convertHeight(160) : convertHeight(110) }} />}
                />
            </View>
        </SafeAreaView>
    );
}

export default EntrollmentQrCodeView;