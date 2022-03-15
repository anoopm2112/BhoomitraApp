import React, { useState, useRef, createRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import DashboardHeader from '../../dashboard/components/DashboardHeader';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getAppTourData } from '../../dashboard/selectors';
import { getEnrollmentInProgressAnimationStatus } from '../../enrollment/selectors';

const { dimensionUtils: { convertHeight } } = utils;
const { Divider, TabBar, Tab, Text } = components

const EntrollmentTopBarView = ({ user, ...props }) => {
    const { appTour: { qrCodeTab, finishSurveyBtn } = {} } = useSelector(getAppTourData);
    const enrollmentInProgressAnimationStatus = useSelector(getEnrollmentInProgressAnimationStatus);
    const { navigation } = props;
    const onTabSelect = (index) => {
        const selectedTabRoute = props.state.routeNames[index];
        props.navigation.navigate(selectedTabRoute);
        props.resetQrEnrollmentTabTourData();
    };
    const [appTourTargets, addAppTourTargets] = useState([]);
    let cardRefs = useRef([]);
    let viewRef = useRef();
    const isFocused = useIsFocused();
    cardRefs.current = props.state.routes.map((element, i) => cardRefs.current[i] ?? createRef());
    useEffect(() => {
        if (isFocused && qrCodeTab && !finishSurveyBtn && appTourTargets && !enrollmentInProgressAnimationStatus) {
            setTimeout(() => {
                let appTourSequence = new AppTourSequence();
                appTourTargets.forEach(appTourTarget => {
                    appTourSequence.add(appTourTarget);
                });
                AppTour.ShowSequence(appTourSequence);
            }, 10);
        }
    }, [isFocused, qrCodeTab, finishSurveyBtn, appTourTargets, enrollmentInProgressAnimationStatus]);

    const createNavigationTabForRoute = (route, i) => {
        const { options } = props.descriptors[route.key];
        return (
            <Tab
                key={route.key}
                title={props => (
                    <View
                        ref={ref => {
                            if (!ref) return;
                            // viewRef = ref;
                            cardRefs.current[i] = ref;
                            let props = {
                                order: 1,
                                title: I18n.t('tap_here_to_start_qr_enrollment'),
                                outerCircleColor: theme['color-basic-1001'],
                                cancelable: true
                            };
                            if (qrCodeTab && !finishSurveyBtn) {
                                appTourTargets.push(AppTourView.for(cardRefs.current[i], { ...props }));
                            }
                        }}
                        style={{ height: 20, width: '100%', backgroundColor: theme['color-basic-600'], justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                            numberOfLines={1} category="h1" {...props}
                            style={[props.style, { color: theme['color-basic-100'] }]}>
                            {I18n.t(options.title)}
                        </Text>
                    </View>)}
            />
        );
    };

    const theme = useTheme();

    const Styles = StyleSheet.create({
        tabBarStyle: {
            backgroundColor: theme['color-basic-600'],
            paddingTop: convertHeight(15)
        }
    });

    return (
        <>
            <DashboardHeader title={I18n.t('enrollment')} navigation={navigation} />
            <TabBar
                style={Styles.tabBarStyle}
                selectedIndex={props.state.index}
                onSelect={onTabSelect}>

                {props.state.routes.map(createNavigationTabForRoute)}
            </TabBar>
            <Divider />
        </>
    );
};

export default EntrollmentTopBarView;
