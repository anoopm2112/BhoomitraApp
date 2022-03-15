import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import IconBadge from 'react-native-icon-badge';
import { TopNavigation, TopNavigationAction, Icon, Text } from '@ui-kitten/components';
import { navigation } from '../actions';
import { dimensionUtils, permissionUtils } from "../../common/utils";
import { useTheme } from '@ui-kitten/components';
import { getUserRoles } from '../../modules/user/selectors';
import { RESOURCE_MAPPING, ACTION_MAPPING } from '../constants';
import { FontelloIcon } from '../../common/components';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';
import { I18n } from '../../common';
import { useDispatch, useSelector } from 'react-redux';
import { getAppTourData } from '../../modules/dashboard/selectors';
import { useIsFocused } from '@react-navigation/native';


const { navigateBack } = navigation;
const { convertWidth, convertHeight } = dimensionUtils;
const { hasAccessPermission } = permissionUtils;

const Header = ({
    style,
    navigateBack,
    alignment = 'center',
    title,
    loadNotificationView,
    loadNotificationsCount,
    startHeaderQRCodeScanning,
    notifications = {},
    userRoles,
    onBackPress,
    ...rest }) => {

    useEffect(() => {
        loadNotificationsCount();
    }, [loadNotificationsCount]);

    const { newNotifications = 0 } = notifications;
    let qrCodeRef = useRef();
    const [appTourTargets, addAppTourTargets] = useState([]);
    const { appTour: { customerQrCodeScanner, customerEnrollment, qrEnrollment, qrCodeTab, qrScannerModal } = {} } = useSelector(getAppTourData);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                let appTourSequence = new AppTourSequence();
                appTourTargets.forEach(appTourTarget => {
                    appTourSequence.add(appTourTarget);
                });
                AppTour.ShowSequence(appTourSequence);
            }, 200);
        }
    }, [isFocused]);

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

    const BackIcon = (props) => (
        <TouchableOpacity onPress={onBackPress ? onBackPress : navigateBack}
            style={styles.backButton}>
            <FontelloIcon {...props} name="back-button" size={convertWidth(14)} style={{ color: theme['color-basic-100'] }} />
        </TouchableOpacity>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} />
    );

    const ScannerAndNotificationsAction = () => (
        <View

            style={styles.scannerAndNotificationsWrapperView}>
            {
                hasAccessPermission(userRoles, RESOURCE_MAPPING.QRCODE, ACTION_MAPPING.QRCODE.ACCESS_QRCODE_IN_NAV) ?
                    <TouchableOpacity
                        ref={ref => {
                            if (!ref) return;
                            qrCodeRef = ref;
                            let props = {
                                order: 1,
                                title: I18n.t('tap_here_to_open_scanner_and_load_customer'),
                                outerCircleColor: theme['color-basic-1001'],
                                targetRadius: convertWidth(55),
                                cancelable: true
                            };
                            if (customerQrCodeScanner !== undefined && customerQrCodeScanner && !customerEnrollment && !qrEnrollment && !qrCodeTab && !qrScannerModal) {
                                appTourTargets.push(AppTourView.for(qrCodeRef, { ...props }));
                            }
                        }}
                        style={styles.scanTouchableStyle} onPress={() => startHeaderQRCodeScanning()}>
                        <FontelloIcon name="qrcode" size={convertWidth(20)} style={{ color: theme['color-basic-100'] }} />
                    </TouchableOpacity> : null
            }
            <TouchableOpacity style={styles.notificationTouchableStyle} onPress={loadNotificationView}>
                <IconBadge
                    MainElement={
                        <FontelloIcon name="notificationbell" size={convertWidth(22)} style={{ color: theme['color-basic-100'] }} />
                    }
                    BadgeElement={
                        <Text appearance='alternative' category='c2'>!</Text>
                    }
                    IconBadgeStyle={styles.iconBadgeStyle}
                    Hidden={(newNotifications || 0) === 0}
                />
            </TouchableOpacity>
        </View >
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        header: {
            height: convertHeight(16),
            backgroundColor: theme['color-basic-600']
        },
        scannerAndNotificationsWrapperView: {
            flexDirection: 'row'
        },
        scanIcon: {
            width: convertHeight(20),
            height: convertHeight(20),
            resizeMode: 'contain'
        },
        notificationIcon: {
            width: convertWidth(16.41),
            height: convertHeight(20),
            resizeMode: 'contain'
        },
        iconBadgeStyle: {
            minWidth: convertWidth(15),
            width: convertWidth(15),
            height: convertHeight(15),
            backgroundColor: '#F00',
            top: convertHeight(-8),
            left: convertWidth(8)
        },
        titleView: {
            width: convertWidth(180)
        },
        scanTouchableStyle: {
            marginRight: convertWidth(30)
        },
        notificationTouchableStyle: {
            marginRight: convertWidth(8)
        },
        backButton: {
            width: convertWidth(35),
            height: convertWidth(35),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: convertWidth(20)
        }
    });

    return (
        <TopNavigation
            alignment={alignment}
            accessoryLeft={BackAction}
            accessoryRight={ScannerAndNotificationsAction}
            style={{ ...styles.header, ...style }}
            title={title ? <View style={[styles.titleView, { alignItems: alignment === 'center' ? 'center' : 'flex-start', paddingRight: alignment === 'center' ? convertWidth(15) : 0, paddingLeft: alignment === 'start' ? convertWidth(15) : 0 }]}><Text numberOfLines={2} appearance='alternative' category='h5'>{title}</Text></View> : null}
            {...rest}
        />
    );
};

const mapStateToProps = createStructuredSelector({
    // notifications: UserSelector.getFcmDetails
    userRoles: getUserRoles
});

const mapDispatchToProps = dispatch => ({
    navigateBack: () => dispatch(navigateBack()),
    loadNotificationView: () => {
        const DashboardActions = require('../../modules/dashboard/actions')
        dispatch(DashboardActions.navigateToNotificationView());
    },
    // loadNotificationsCount: () => dispatch(UserActions.loadNotificationData()),
    // loadNotificationView: () => { },
    loadNotificationsCount: () => 1,
    startHeaderQRCodeScanning: () => {
        const DashboardActions = require('../../modules/dashboard/actions');
        dispatch(DashboardActions.startHeaderQRCodeScanning());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
