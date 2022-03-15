import React, { createRef } from 'react';
import { StyleSheet, PermissionsAndroid, Linking, Platform, AppState, TouchableOpacity, View, Text } from 'react-native';
import RNQRCodeScanner from 'react-native-qrcode-scanner';
import Modal from './Modal';
import I18n from '../i18n';
import { dimensionUtils } from '../utils';
import { check, RESULTS, PERMISSIONS, request } from 'react-native-permissions';

const { convertWidth, convertHeight } = dimensionUtils;

const scannerRef = createRef();

export const reactivateScanner = () => {
    scannerRef.current.reactivate();
}

class QRCodeScanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            qrcode: undefined,
            showModal: false,
            permissionStatus: '',
            appState: AppState.currentState
        };
    }

    permissionCheck = async () => {
        let checkStatus;
        if (Platform.OS === 'android') {
            checkStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        } else if (Platform.OS === 'ios') {
            checkStatus = await check(PERMISSIONS.IOS.CAMERA);
        }
        if (checkStatus) {
            this.setState({ permissionStatus: 'granted' });
        }
        return checkStatus;
    }

    permissionRequest = async () => {
        const checkStatus = await this.permissionCheck();
        if (checkStatus) {
            this.setState({ permissionStatus: 'granted' });
            return;
        }
        let requestStatus;
        if (Platform.OS === 'android') {
            requestStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (requestStatus === PermissionsAndroid.RESULTS.GRANTED) {
                this.setState({ permissionStatus: 'granted' });
            } else if (requestStatus === PermissionsAndroid.RESULTS.DENIED) {
                this.setState({ permissionStatus: 'denied' });
            } else if (requestStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                this.setState({ permissionStatus: 'blocked' });
            }
        }
        else if (Platform.OS === 'ios') {
            requestStatus = await request(PERMISSIONS.IOS.CAMERA);
            if (requestStatus === RESULTS.GRANTED) {
                this.setState({ permissionStatus: 'granted' });
            } else if (requestStatus === RESULTS.DENIED) {
                this.setState({ permissionStatus: 'denied' });
            } else if (requestStatus === RESULTS.BLOCKED) {
                this.setState({ permissionStatus: 'blocked' });
            }
        }
    }

    componentDidMount() {
        this.permissionRequest();
        AppState.addEventListener("change", this._handleAppStateChange);
        const { navigation } = this.props;
        if (navigation) {
            this.permissionRequest();
            if (this.state.permissionStatus === 'granted') {
                this._focusUnsubscribe = navigation.addListener('focus', () => {
                    scannerRef.current.reactivate();
                });
            }
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
        if (this._focusUnsubscribe) {
            this._focusUnsubscribe();
        }
    }

    _handleAppStateChange = async (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            await this.permissionCheck();
        }
        this.setState({ appState: nextAppState });
    };

    onSuccess = (e) => {
        this.setState({ qrcode: e.data, showModal: true });
    }

    render() {
        return (
            <>
                {this.state.permissionStatus === 'denied' ?
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1,  margin: convertHeight(7) }}>
                        <TouchableOpacity onPress={() => this.permissionRequest()}>
                            <Text style={{ textDecorationLine: 'underline', color: 'blue', marginHorizontal: convertWidth(10) }}>{I18n.t('must_grant_or_exit')}</Text>
                        </TouchableOpacity>
                    </View> :
                    this.state.permissionStatus === 'blocked' ?
                        < View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, margin: convertHeight(7) }}>
                            <TouchableOpacity onPress={() => Linking.openSettings()}>
                                <Text style={{ textDecorationLine: 'underline', color: 'blue', marginHorizontal: convertWidth(10) }}>{I18n.t('allow_blocked_permissions')}</Text>
                            </TouchableOpacity>
                        </View> :
                        this.state.permissionStatus === 'granted' ?
                            <RNQRCodeScanner
                                bottomViewStyle={{ height: 0 }}
                                cameraStyle={styles.cameraStyle}
                                fadeIn={false}
                                reactivate={false}
                                showMarker={true}
                                markerStyle={styles.markerStyle}
                                ref={(ref) => {
                                    if (ref !== null) {
                                        scannerRef.current = ref;
                                    }
                                }}
                                onRead={this.onSuccess}
                                topContent={this.props.topContent || null}
                            /> : this.state.permissionStatus === '' ?  <View /> : <View />}
                {<Modal
                    visible={this.state.showModal}
                    type='confirm'
                    message={this.state.qrcode}
                    okText={I18n.t('done')}
                    onOk={() => {
                        this.props.onScanFinish && this.props.onScanFinish(this.state.qrcode);
                        this.props.onModalOk && this.props.onModalOk();
                        this.setState({ showModal: false });
                    }}
                    cancelText={I18n.t('rescan')}
                    onCancel={() => {
                        this.setState({ showModal: false });
                        reactivateScanner();
                    }}
                    close={() => {
                        this.setState({ showModal: false });
                        reactivateScanner();
                    }}
                />}
            </>
        );
    }
}

const styles = StyleSheet.create({
    markerStyle: {
        borderRadius: convertWidth(10)
    },
    cameraStyle: {
        alignSelf: 'center',
        width: convertWidth(320),
        height: convertHeight(400)
    }
});

export default QRCodeScanner;