import React from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Alert, Image, PermissionsAndroid, Linking, Platform, AppState } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import I18n from '../i18n';
import Modal from './Modal';
import { dimensionUtils } from "../utils";
import { useTheme, Text } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';
import { getAppTourData } from '../../modules/dashboard/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { check, RESULTS, PERMISSIONS, request } from 'react-native-permissions';

var RNFS = require('react-native-fs');
const { convertHeight, convertWidth } = dimensionUtils;
const IMG_SIZE = 200000;

class Camera extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flash: 0,
            imageUrl: '',
            quality: 100,
            orgUriSize: '',
            imageGetSuccess: true,
            selectPhoto: props.selectPhoto,
            action: props.action,
            permissionStatus: '',
            appState: AppState.currentState
        };
        this.appTourTargets = [];
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
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
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

    takePicture = async () => {
        if (this.camera) {
            const data = await this.camera.takePictureAsync();

            RNFS.stat(data.uri).then((stats) => {
                this.setState({ orgUriSize: stats.size, imageUrl: data.uri })
            }).catch((err) => {
                return Alert.alert(
                    'Unable to set base64',
                    'Check the console for full the error message',
                );
            });
            setTimeout(() => {
                let appTourSequence = new AppTourSequence();
                this.appTourTargets.forEach(appTourTarget => {
                    appTourSequence.add(appTourTarget);
                });
                AppTour.ShowSequence(appTourSequence);
            }, 200);
        }
    };

    getResizedImage = (uri, quality, orgUriSize, lock, onImageTaken) => {
        this.setState({ imageGetSuccess: false });
        if (orgUriSize <= IMG_SIZE) { //check image original size < 200 kb then do not compress
            this.imageConvertion(uri, null, lock, onImageTaken);
        } else {
            ImageResizer.createResizedImage(uri, 1280, 720, "JPEG", quality, 0) //HxW
                .then(response => {
                    if (quality < 75) { //throw error
                        this.removeCacheImage(this.state.imageUrl);
                        return Alert.alert(
                            'oops',
                            'High Image Quality',
                        );
                    }
                    if (response.size >= IMG_SIZE) { //if size is greater than 200kb, then reduce quality
                        this.setState(prevState => ({
                            quality: quality--
                        }));
                        this.getResizedImage(uri, quality, orgUriSize, lock, onImageTaken);
                    } else {
                        this.imageConvertion(response.uri, uri, lock, onImageTaken);
                    }
                })
                .catch(err => {
                    if (lock && lock.acquired) {
                        lock.release();
                    }
                    return Alert.alert(
                        'Unable to resize the photo',
                        'Check the console for full the error message',
                    );
                });
        }
    }

    imageConvertion = (compressUri, uri, lock, onImageTaken) => {
        RNFS.readFile(compressUri, 'base64').then(res => {
            RNFS.exists(compressUri).then((result) => {
                if (result) {
                    return RNFS.unlink(compressUri).then(() => {
                        uri && RNFS.unlink(uri).then(() => {
                        });
                        onImageTaken && onImageTaken(res);
                        if (lock && lock.acquired) {
                            lock.release();
                        }
                    }).catch((err) => { });
                }
            }).catch((err) => { });
        });
    }

    removeCacheImage = (uri) => {
        this.setState({ imageGetSuccess: true, imageUrl: '' })
        RNFS.exists(uri).then((result) => {
            if (result) {
                return RNFS.unlink(uri).then(() => {
                    this.setState({ imageUrl: '' });
                }).catch((err) => {
                });
            }
        }).catch((err) => { });
    }

    cameraFlash = (flash) => {
        if (flash) {
            this.setState({ flash: RNCamera.Constants.FlashMode.on });
        } else {
            this.setState({ flash: RNCamera.Constants.FlashMode.off });
        }
    }

    render() {
        const { imageUrl, quality, orgUriSize } = this.state;
        const { lock, onImageTaken, value } = this.props;
        const { theme } = this.props;
        const styles = StyleSheet.create({
            preview: {
                alignSelf: 'center',
                height: convertHeight(400),
                width: convertWidth(320),
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            snapButtonStyle: {
                borderWidth: 5,
                borderColor: '#FFF',
                alignItems: 'center',
                justifyContent: 'center',
                width: convertWidth(60),
                height: convertHeight(55),
                borderRadius: convertHeight(27),
                shadowOpacity: 1,
                shadowRadius: 1,
                shadowColor: "#414685",
                shadowOffset: {
                    width: 1,
                    height: 5.5,
                },
                elevation: 6,
            },
            captureView: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: convertWidth(25)
            },
            imgClickBtn: {
                height: convertWidth(45), width: convertWidth(45),
                borderRadius: convertWidth(25), borderWidth: 3, borderColor: '#FFF'
            },
            sidePreviewImage: {
                height: convertHeight(80),
                width: convertWidth(80),
                borderWidth: 1,
                borderColor: '#FFF',
            },
            flashIconBtn: {
                justifyContent: 'flex-end', alignItems: 'center', paddingBottom: convertHeight(4),
                height: convertWidth(45), width: convertWidth(45), position: 'absolute', left: 0
            },
            flashClickBtn: {
                position: 'absolute', right: 0
            }
        });
        if (this.props.readOnly) return (
            value ? <ImageBackground style={styles.preview} source={{ uri: `data:image/*;base64,${value}` }}></ImageBackground> :
                <Text category='label'>{I18n.t('no_data_available')}</Text>
        );

        if (this.state.permissionStatus === 'denied') {
            return (
                <View>
                    <TouchableOpacity onPress={() => this.permissionRequest()}>
                        <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('must_grant_or_exit')}</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.permissionStatus === 'blocked') {
            return (
                <View>
                    <TouchableOpacity onPress={() => Linking.openSettings()}>
                        <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>{I18n.t('allow_blocked_permissions')}</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.permissionStatus === '') {
            return (
                <View />
            )
        } else {
            return (
                <>
                    {imageUrl != '' && <ImageBackground style={styles.preview} source={{ uri: imageUrl }}>
                        <View style={styles.captureView}>
                            <View style={{ paddingHorizontal: convertWidth(25), marginTop: convertHeight(1) }}>
                                <TouchableOpacity onPress={() => this.removeCacheImage(imageUrl)}>
                                    <MaterialCommunityIcons name='close-circle-outline' color={theme['color-basic-100']} size={convertHeight(60)} />
                                </TouchableOpacity>
                            </View>
                            {this.state.imageGetSuccess && <View style={{ paddingHorizontal: convertWidth(25) }}>
                                <TouchableOpacity
                                    ref={ref => {
                                        if (!ref) return;
                                        this.button2 = ref;
                                        let props = {
                                            order: 12,
                                            title: I18n.t('tap_here_to_confirm_photo'),
                                            outerCircleColor: theme['color-basic-1001'],
                                            targetRadius: convertWidth(55)
                                        };
                                        if (this.state.selectPhoto !== undefined && this.state.selectPhoto) {
                                            this.appTourTargets.push(AppTourView.for(ref, { ...props }));
                                        }
                                    }}
                                    onPress={() => {
                                        const DashboardActions = require('../../modules/dashboard/actions');
                                        this.props.dispatch(DashboardActions.setAppTourDataPhoto());
                                        if (lock) {
                                            lock.acquireAsync().then(() => {
                                                this.getResizedImage(imageUrl, quality, orgUriSize, lock, onImageTaken);
                                            });
                                        } else {
                                            this.getResizedImage(imageUrl, quality, orgUriSize, lock, onImageTaken);
                                        }
                                    }}>
                                    <MaterialCommunityIcons name='check-circle-outline' color={theme['color-basic-100']} size={convertHeight(60)} />
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </ImageBackground>}

                    {imageUrl == '' && <RNCamera
                        flashMode={this.state.flash}
                        ref={ref => {
                            this.camera = ref;
                        }}
                        captureAudio={false}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}>
                        <View style={{ flex: 1, width: convertWidth(300), top: convertWidth(10) }}>
                            {
                                !this.state.flash ?
                                    <TouchableOpacity onPress={() => this.cameraFlash(true)}
                                        style={styles.flashClickBtn}>
                                        <MaterialCommunityIcons name="flash-off" color={theme['color-basic-100']} size={convertHeight(20)} />
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={() => this.cameraFlash(false)}
                                        style={styles.flashClickBtn}>
                                        <MaterialCommunityIcons name="flash" color={theme['color-basic-100']} size={convertHeight(20)} />
                                    </TouchableOpacity>
                            }
                        </View>
                        <TouchableOpacity onPress={this.takePicture.bind(this)}
                            style={styles.imgClickBtn}>
                        </TouchableOpacity>
                        {value && <View style={{ position: 'absolute', left: 0, bottom: convertHeight(15) }}>
                            <Image source={{ uri: `data:image/*;base64,${value}` }} style={styles.sidePreviewImage} />
                        </View>}
                    </RNCamera>}
                    {
                        <Modal visible={this.state.showSettingModal}
                            type='confirm'
                            message={I18n.t('allow_blocked_permissions')}
                            okText={I18n.t('settings')}
                            onOk={() => { Linking.openSettings(); }}
                            onCancel={() => { this.setState({ showSettingModal: false }) }}
                        />
                    }
                </>
            );
        }
    }
}

export default function (props) {
    const theme = useTheme();
    const { appTour: { selectPhoto } = {} } = useSelector(getAppTourData);
    const dispatch = useDispatch();
    // const DashboardActions = require('../../modules/dashboard/actions');
    // let action = dispatch(DashboardActions.setAppTourDataPhoto());
    return <Camera {...props} theme={theme} selectPhoto={selectPhoto} dispatch={dispatch} />;
}
