import React, { useEffect, useState, useRef, createRef } from 'react';
import { StyleSheet, TouchableOpacity, View, BackHandler, DeviceEventEmitter } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import AnimatedNumbers from 'react-native-animated-numbers';
import DashboardHeader from './DashboardHeader';
import { useTheme } from '@ui-kitten/components';
import { components, I18n, utils } from '../../../common';
import { RESOURCE_MAPPING, ACTION_MAPPING } from '../../../common/constants';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';
const { dimensionUtils: { convertHeight, convertWidth }, permissionUtils: { hasAccessPermission } } = utils;
const { SafeAreaView, Text, Content, Card, Modal } = components;

const SummaryView = (props) => {
    const { tourData: { appTour } = {} } = props;
    const [appTourTargets, addAppTourTargets] = useState([]);
    const cardRefs = useRef([]);
    const netInfo = useNetInfo();
    const isFocused = useIsFocused();
    const { navigation, surveyTemplateFetchStatus, userRoles, count } = props;
    const dashBoardOptions = [];

    if (hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.START_SURVEY_CARD)) {
        dashBoardOptions.push(
            {
                "id": 4036,
                "question": "dashboard_enrollment",
                "number": count.surveyTotal,
                "navigation": props.startEnrollmentSurvey
            }
        );
    }
    if (hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.SERVICES_CARD)) {
        dashBoardOptions.push(
            {
                "id": 4035,
                "question": "dashboard_service",
                "number": count.servicePending,
                "navigation": props.navigateToServiceTopBar
            }
        );
    }
    if (hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.COMPLAINTS_CARD)) {
        dashBoardOptions.push(
            {
                "id": 4034,
                "question": 'dashboard_complaints',
                "navigation": props.navigateToComplaintsTopBar,
                "number": count.complaintPending
            }
        );
    }

    cardRefs.current = dashBoardOptions.map((element, i) => cardRefs.current[i] ?? createRef());

    useEffect(() => {
        if (netInfo && netInfo.isInternetReachable && isFocused) {
            if (props.user.info.langId !== props.language.langId) {
                props.updateUserLanguage({ userId: props.user.info.id, langId: props.language.langId });
            }
            props.populateDashboardCount();

        }
    }, [netInfo, isFocused]);

    useEffect(() => {
        if (isFocused && appTour !== undefined && appTour.customerEnrollment && appTourTargets.length === 1) {
            let appTourSequence = new AppTourSequence();
            appTourTargets.forEach(appTourTarget => {
                appTourSequence.add(appTourTarget);
            });
            AppTour.ShowSequence(appTourSequence);
        }
    }, [isFocused, appTour, appTourTargets]);


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

    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            alignSelf: 'stretch',
            justifyContent: 'space-evenly',
            height: convertHeight(150),
            margin: convertHeight(4),
        },
        mainContainer: {
            padding: 7
        },
        viewContainer: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        dashboardSvg: {
            position: 'relative'
        },
        dashboardSvgText: {
            color: theme['text-primary-color']
        },
        textStyle: {
            paddingVertical: 10
        },
        roundIcon: {
            height: convertHeight(75),
            width: convertHeight(75),
            borderWidth: convertWidth(3),
            borderColor: theme['text-primary-color'],
            borderRadius: convertHeight(75),
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    return (
        <>
            <SafeAreaView>
                <DashboardHeader title={I18n.t('home')} navigation={navigation} />
                <Content style={styles.mainContainer}>
                    {dashBoardOptions.map((item, index) => {
                        const numLenght = JSON.stringify(item.number).length;
                        return (
                            <Card
                                ref={ref => {
                                    if (!ref) return;
                                    cardRefs.current[index] = ref;
                                    let props = {
                                        order: index,
                                        title: item.id === 4036 ? I18n.t('tap_here_to_start_enrollment') : I18n.t('tap_here_to_scan_qr_code_and_start_servicing'),
                                        cancelable: true,
                                        outerCircleColor: theme['color-basic-1001'],
                                        targetRadius: convertWidth(55),
                                    };
                                    if (appTour !== undefined && appTour.customerEnrollment && item.id === 4036) {
                                        appTourTargets.push(AppTourView.for(cardRefs.current[index], { ...props }));
                                    }
                                    else if (appTour !== undefined && appTour.scanQrCodeService && item.id === 4035 && !appTour.customerEnrollment && !appTour.customerQrCodeScanner) {
                                        appTourTargets.push(AppTourView.for(cardRefs.current[index], { ...props }));
                                    }
                                }}
                                key={index} shadow style={styles.card}>
                                <TouchableOpacity
                                    style={styles.viewContainer}
                                    onPress={() => { item.navigation(); props.drawerStatus(true); }}>
                                    <View style={styles.roundIcon}>
                                        <AnimatedNumbers
                                            includeComma
                                            animationDuration={1500}
                                            animateToNumber={item.number}
                                            fontStyle={{
                                                fontSize: numLenght < 5 ? convertHeight(23) : convertHeight(15),
                                                fontWeight: 'bold'
                                            }}                                          
                                        />
                                    </View>
                                    <Text style={styles.textStyle} category='h5'>{I18n.t(item.question.toString())}</Text>
                                </TouchableOpacity>
                            </Card>
                        );
                    })}
                </Content>
                {
                    <Modal visible={surveyTemplateFetchStatus.message}
                        message={surveyTemplateFetchStatus.message}
                        onOk={() => { props.setSurveyTemplateMessage(undefined); }}
                    />
                }
            </SafeAreaView>
        </>
    );
};

export default SummaryView;
