import { all, take, takeLatest, takeEvery, call, fork, delay, put, select, cancel, race, spawn } from 'redux-saga/effects';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { FOREGROUND } from 'redux-enhancer-react-native-appstate';
import CryptoES from '@genee/crypto-es';
import _ from 'lodash';
import Storage from '../../common/storages';
import moment from 'moment';
import OneSignal from 'react-native-onesignal';
import { deleteUserPinCode } from '@haskkor/react-native-pincode';
import { saga, I18n, utils, locks, actions as CommonActions } from '../../common';
import * as Actions from './actions';
import { OTP_WAITING_PERIOD, AUTO_UPDATE_INTERVALS } from './constants';
import * as DfgActions from '../dfg/actions';
import * as DashboardActions from '../dashboard/actions';
import * as SplashActions from '../splash/actions';
import * as ServiceActions from '../service/actions';
import { store } from '../dfg/common/store';
import * as UserAPI from './api';
import { getUser, getUserInfo, getEncryptionKey } from './selectors';
import {
    METADATA_STORE_KEY, SURVEY_TEMPLATE_STORE_KEY
} from '../dfg/constants';
import { DEVELOPER_OPTIONS_STORE_KEY } from '../settings/constants';
import { AUTH_DATA_STORE_KEY, USER_INFO_STORE_KEY } from './constants';
import * as SettingsActions from '../settings/actions';
import { CONNECTION_STATUS } from '../../netinfo/saga';
import { ROLE_TYPES, API_PROVIDER_TYPE } from '../../common/constants';
import {
    SurveyDataRepository, CustomerProfileRepository
} from '../../common/realm/repositories';
import container, { getInstance, removeInstance, resetInstance } from '../../common/realm';

const { toastUtils: { infoToast, successToast, errorToast, hideToast }, userUtils } = utils;

const { types: CommonActionTypes, navigation: { navigateBack } } = CommonActions;
const { types: ActionTypes } = Actions;

const { netInfoLock } = locks;

function* authenticate(action) {
    let params = {};
    const { username, password } = action.payload.data;
    if (username !== '' && username !== undefined && username.length === 12) {
        let firstSubStr = username.substring(0, 3);
        let secondsubStr = username.substring(3, 12);
        let thirdSubStr = username.substring(6, 12);
        let isNum = /^\d+$/.test(secondsubStr);
        let isChar = firstSubStr.match(/^[A-Za-z]+$/);
        let newUsername = '';
        if (isChar !== null && isNum) {
            newUsername = firstSubStr.toUpperCase() + '-' + username.substring(3, 6) + '-' + thirdSubStr;
        } else {
            newUsername = username;
        }
        params = {
            username: newUsername,
            password: password
        };
    } else {
        params = action.payload.data;
    }
    yield call(infoToast, I18n.t('logging_in'), 0);
    yield fork(saga.handleAPIRequest, UserAPI.authenticate, params);
    const authSuccessAction = yield take(ActionTypes.AUTH_SUCCESS);
    yield fork(saga.handleAPIRequest, UserAPI.getUserInfo);
    const userInfoSuccessAction = yield take(ActionTypes.FETCH_USER_INFO_SUCCESS);
    const userRoles = userInfoSuccessAction.payload.data.roles;
    // More than one organization check
    if ((userInfoSuccessAction.payload.data.organizations.length) > 1) {
        yield call(restrictLogin, { textType: 'morethan_one_organizations' });
        return;
    }
    // More than one service provider check
    const serviceProviders = _.chain(userInfoSuccessAction.payload.data.organizations).map('serviceProviders').flatten().value();
    if (serviceProviders.length > 1) {
        yield call(restrictLogin, { textType: 'morethan_one_service_providers' });
        return;
    }
    // User has both GT role and surveyor role check
    if (userRoles.some(role => role.key === ROLE_TYPES.ROLE_GT) && userRoles.some(role => role.key === ROLE_TYPES.ROLE_SURVEYOR)) {
        yield call(restrictLogin, { textType: 'both_gt_and_surveyor' });
        return;
    }
    // User has no valid roles check i.e., without surveyor, supervisor, gt or customer role
    const findRoles = userRoles.some(role => role.key === ROLE_TYPES.ROLE_GT || role.key === ROLE_TYPES.ROLE_CUSTOMER || role.key === ROLE_TYPES.ROLE_SURVEYOR || role.key === ROLE_TYPES.ROLE_MCF_USER || role.key === ROLE_TYPES.ROLE_RRF_USER || role.key === ROLE_TYPES.ROLE_CKC_USER)
    if (!findRoles) {
        yield call(restrictLogin, { textType: 'no_valid_roles' });
        return;
    }
    let metadata = yield call([Storage, 'getItem'], METADATA_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.sessionExpired) {
        if (userInfoSuccessAction.payload.data.username === metadata.lastLoggedInUser) {
            delete metadata.sessionExpired;
            yield call([Storage, 'setItem'], METADATA_STORE_KEY, JSON.stringify(metadata));
        } else {
            yield call(removeSecondaryStoreKeys);
            const encryptionKey = yield select(getEncryptionKey);
            yield call(removeInstance, encryptionKey);
            yield put(Actions.setEncryptionKey(undefined));
            yield call(deleteUserPinCode);
            yield put(SettingsActions.resetDeveloperOptions());
            metadata = {};
        }
    }
    if (_.isEmpty(metadata)) {
        metadata.lastLoggedInUser = userInfoSuccessAction.payload.data.username;
        yield call([Storage, 'setItem'], METADATA_STORE_KEY, JSON.stringify(metadata));
    }
    yield call([Storage, 'setItem'], AUTH_DATA_STORE_KEY, JSON.stringify(authSuccessAction.payload.data));
    yield call([Storage, 'setItem'], USER_INFO_STORE_KEY, JSON.stringify(userInfoSuccessAction.payload.data));
    const externalUserId = userInfoSuccessAction.payload.data.externalUserId;
    const { apiProviders } = userInfoSuccessAction.payload.data.defaultOrganization;
    let apiProviderNotification;
    let appId = '';
    if (Array.isArray(apiProviders) && apiProviders.length > 0) {
        apiProviderNotification = _.find(apiProviders, function (o) { return o.type === API_PROVIDER_TYPE.NOTIFICATION; });
    }
    if (apiProviderNotification) {
        appId = apiProviderNotification.appId;
        if (appId && externalUserId) {
            yield call(initializeOneSignal, { appId, externalUserId });
        }
    }
    yield call(hideToast);
    // Check if encryption key is available in state
    const encryptionKey = yield select(getEncryptionKey);
    if (encryptionKey) {
        // Check if realm is loaded
        const { realm } = container;
        if (realm === undefined) {
            yield call(getInstance, encryptionKey);
        }
        if (userUtils.hasGtRole(userInfoSuccessAction.payload.data) || userUtils.hasSurveyorRole(userInfoSuccessAction.payload.data)) {
            yield put(DashboardActions.navigateToDashboardSummary());
        } else if (userUtils.hasMcfUserRole(userInfoSuccessAction.payload.data)) {
            yield put(DashboardActions.navigateToMcfDashboardSummary());
        } else if (userUtils.hasRrfUserRole(userInfoSuccessAction.payload.data)) {
            yield put(DashboardActions.navigateToRrfDashboardSummary());
        } else if (userUtils.hasCkcUserRole(userInfoSuccessAction.payload.data)) {
            yield put(DashboardActions.navigateToCkcDashboardSummary());
        } else if (userUtils.hasSupervisorRole(userInfoSuccessAction.payload.data)) {
            yield put(DashboardActions.navigateToSupervisorDashboardSummary());
        } else {
            yield put(DashboardActions.navigateToCustomerDashboardSummary());
        }
    } else {
        yield put(Actions.navigateToPassCode({ status: 'choose' }));
    }
}

function* restrictLogin({ textType }) {
    yield call(errorToast, I18n.t(textType));
}

function* initializeOneSignal({ appId, externalUserId }) {
    OneSignal.setAppId(appId);
    OneSignal.setLogLevel(4, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    if (Platform.OS === 'ios') {
        OneSignal.promptForPushNotificationsWithUserResponse();
    }
    let externalUserInit = false;
    OneSignal.setExternalUserId(externalUserId, (result) => {
        if (result?.push?.success) {
            externalUserInit = true;
        }
    });
    // Sometimes OneSignal SDK fails to register external user first time.
    // If so, wait for around 8 seconds and register again.
    setTimeout(() => {
        if (!externalUserInit) {
            OneSignal.setExternalUserId(externalUserId, (result) => {
                if (result?.push?.success) {
                    externalUserInit = true;
                }
            });
        }
    }, 8000);
}

function* handleLogout(action) {
    const { sessionExpired } = action.payload.data || {};
    if (!sessionExpired) {
        try {
            const status = yield call(checkUserData);
            if (!status) {
                return;
            }
        } catch {
            // NOOP
        }
    }
    OneSignal.removeExternalUserId();
    Object.keys(AUTO_UPDATE_INTERVALS).forEach(key => {
        clearInterval(AUTO_UPDATE_INTERVALS[key]);
        delete AUTO_UPDATE_INTERVALS[key];
    });
    yield call(removePrimaryStoreKeys);
    if (!sessionExpired) {
        yield call(removeSecondaryStoreKeys);
        const encryptionKey = yield select(getEncryptionKey);
        yield call(removeInstance, encryptionKey);
        yield put(Actions.setEncryptionKey(undefined));
        yield call(deleteUserPinCode);
        yield put(SettingsActions.resetDeveloperOptions());
    } else {
        const userInfo = yield select(getUserInfo);
        let metadata = yield call([Storage, 'getItem'], METADATA_STORE_KEY);
        metadata = metadata ? JSON.parse(metadata) : {};
        metadata.sessionExpired = true;
        yield call([Storage, 'setItem'], METADATA_STORE_KEY, JSON.stringify(metadata));
    }
    yield put(Actions.navigateToLogin());
}

function* checkUserData() {
    const surveyDataExists = yield call([SurveyDataRepository, 'existsByWaitingForSync'], true);
    if (surveyDataExists) {
        yield put(DashboardActions.toggleLogoutModal({ enabled: true, message: 'confirm_logout_sync' }));
        const { doLogout, dontLogout } = yield race({
            doLogout: take(ActionTypes.DO_LOGOUT),
            dontLogout: take(ActionTypes.DONT_LOGOUT)
        });
        yield put(DashboardActions.toggleLogoutModal({ enabled: false, message: undefined }));
        if (dontLogout) {
            return false;
        }
    }
    const customerProfileExists = !(yield call([CustomerProfileRepository, 'isEmpty']));
    if (customerProfileExists) {
        yield put(DashboardActions.toggleLogoutModal({ enabled: true, message: 'confirm_logout_profile' }));
        const { doLogout, dontLogout } = yield race({
            doLogout: take(ActionTypes.DO_LOGOUT),
            dontLogout: take(ActionTypes.DONT_LOGOUT)
        });
        yield put(DashboardActions.toggleLogoutModal({ enabled: false, message: undefined }));
        if (dontLogout) {
            return false;
        }
    }
    return true;
}

function* removePrimaryStoreKeys() {
    yield fork([Storage, 'removeItem'], AUTH_DATA_STORE_KEY);
    yield fork([Storage, 'removeItem'], USER_INFO_STORE_KEY);
}

function* removeSecondaryStoreKeys() {
    yield fork([Storage, 'removeItem'], METADATA_STORE_KEY);
    yield fork([Storage, 'removeItem'], SURVEY_TEMPLATE_STORE_KEY);
    yield fork([Storage, 'removeItem'], DEVELOPER_OPTIONS_STORE_KEY);
}

function* updateResendOtpButtonState() {
    let waitingPeriodInSeconds = OTP_WAITING_PERIOD * 60; // Waiting period in seconds for showing progress circle
    while (true) {
        let user = yield select(getUser);
        if (user.otpVerify.progress < 1) {
            let interval = moment().diff(user.otpVerify.requestedAt, 'seconds');
            let progress = interval / waitingPeriodInSeconds;
            let shouldResend = false;
            if (progress >= 1) {
                progress = 1;
                shouldResend = true;
            }
            yield put(Actions.updateResendOtpButtonState({ progress, shouldResend }));
        }
        yield delay(2500);
    }
}

function* handleSendOtp(action) {
    yield call(infoToast, I18n.t('verifying_phone_number'), 0);
    yield fork(saga.handleAPIRequest, UserAPI.sendOrResendOtp, { mobile: action.payload.data, isResend: false });
    yield take(ActionTypes.OTP_API_SUCCESS);
    yield call(hideToast);
    yield put(Actions.navigateToOtpVerification(action.payload.data));
    yield delay(500);
    const updateResendOtpButtonStateTask = yield fork(updateResendOtpButtonState);
    yield take(CommonActionTypes.ROUTE_CHANGED);
    yield cancel(updateResendOtpButtonStateTask);
}

function* handleResendOtp(action) {
    yield call(infoToast, I18n.t('request_new_otp'), 0);
    yield fork(saga.handleAPIRequest, UserAPI.sendOrResendOtp, { mobile: action.payload.data, isResend: true });
    yield take(ActionTypes.OTP_RESEND_API_SUCCESS);
    yield call(successToast, I18n.t('request_new_otp_success'));
}

function* handleVerifyOtp(action) {
    yield call(infoToast, I18n.t('verifying_otp'), 0);
    const { firstNumber, secondNumber, thirdNumber, fourthNumber, phoneNumber: mobile } = action.payload.data;
    const otp = firstNumber + secondNumber + thirdNumber + fourthNumber;
    yield fork(saga.handleAPIRequest, UserAPI.verifyOtp, { mobile, otp });
    const otpVerifySuccessAction = yield take(ActionTypes.OTP_VERIFY_API_SUCCESS);
    yield call(hideToast);
    yield put(Actions.navigateToResetPassword(otpVerifySuccessAction.payload.data));
}

function* handleResetPassword(action) {
    yield call(infoToast, I18n.t('resetting_password'), 0);
    yield fork(saga.handleAPIRequest, UserAPI.resetPassword, action.payload.data);
    yield take(ActionTypes.RESET_PASSWORD_API_SUCCESS);
    yield put(Actions.navigateToLogin());
    yield call(successToast, I18n.t('reset_password_success'));
}

function* handleUpdateProfile(action) {
    yield call(infoToast, I18n.t('updating_profile'), 0);
    yield fork(saga.handleAPIRequest, UserAPI.updateProfile, action.payload.data);
    yield take(ActionTypes.UPDATE_PROFILE_API_SUCCESS);
    let userInfo = yield call([Storage, 'getItem'], USER_INFO_STORE_KEY);
    userInfo = userInfo ? JSON.parse(userInfo) : {};
    userInfo = { ...userInfo, ...action.payload.data };
    yield call([Storage, 'setItem'], USER_INFO_STORE_KEY, JSON.stringify(userInfo));
    yield put(Actions.setUpdatedProfile(userInfo));
    yield put(navigateBack());
    yield call(successToast, I18n.t('profile_updated'));
}

function* handleUpdatePassword(action) {
    yield call(infoToast, I18n.t('updating_password'), 0);
    yield fork(saga.handleAPIRequest, UserAPI.updatePassword, action.payload.data);
    yield take(ActionTypes.UPDATE_PASSWORD_API_SUCCESS);
    yield put(navigateBack());
    yield call(successToast, I18n.t('update_password_success'));
}

function* handleRefreshToken(action) {
    yield call([Storage, 'setItem'], AUTH_DATA_STORE_KEY, JSON.stringify(action.payload.data));
}

function* prepareEncryptionKey(action) {
    const { status, pinCode, oldPassCode } = action.payload.data; // pinCode is used for generating the key
    const deviceId = yield call([DeviceInfo, 'getDeviceId']); // deviceId will be the salt
    if (oldPassCode) {
        yield call(resetInstance, CryptoES.PBKDF2(oldPassCode, deviceId, { keySize: 512 / 32 }).toArrayBuffer())
    }
    const key512Bits = CryptoES.PBKDF2(pinCode, deviceId, { keySize: 512 / 32 }).toArrayBuffer();
    yield put(Actions.setEncryptionKey(key512Bits));
    // Re-initialize here
    if (status === 'choose') {
        yield put(SplashActions.initialize({ forceUpdate: true, autoUpdate: true }));
    } else if (status === 'enter') {
        yield put(SplashActions.initialize({ autoUpdate: true }));
    }
}

function* handleAutoUpdate() {
    const userInfo = yield select(getUserInfo);
    if (userUtils.hasAnyRole(userInfo, [ROLE_TYPES.ROLE_SW_SUPERVISOR, ROLE_TYPES.ROLE_GT])) {
        AUTO_UPDATE_INTERVALS.loadIncompleteServiceListIntervalId = setInterval(() => {
            store.dispatch(ServiceActions.loadIncompleteServices());
        }, 3600000);
    }
}

function* handleAppForegroundTransition() {
    let metadata = yield call([Storage, 'getItem'], METADATA_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (!metadata.hasOwnProperty('lastLoggedInUser')) {
        return;
    }
    const userInfo = yield select(getUserInfo);
    if (_.isEmpty(userInfo)) {
        const userInfoSuccessAction = yield take(ActionTypes.FETCH_USER_INFO_SUCCESS);
        if (userInfoSuccessAction.payload.data.username !== metadata.lastLoggedInUser) {
            return;
        }
    }
    const now = moment();
    let templatesLastUpdated = _.get(metadata, 'templatesLastUpdated', null);
    if (templatesLastUpdated) {
        templatesLastUpdated = moment(templatesLastUpdated);
        if (now.isAfter(templatesLastUpdated, 'day')) {
            yield put(DfgActions.fetchSurveyTemplates({ newTemplatesOnly: true }));
        }
    }
    let qrcodeUpdateInProfileLastUpdated = _.get(metadata, 'qrcodeUpdateInProfileLastUpdated', null);
    if (qrcodeUpdateInProfileLastUpdated) {
        qrcodeUpdateInProfileLastUpdated = moment(qrcodeUpdateInProfileLastUpdated);
        if (now.isAfter(qrcodeUpdateInProfileLastUpdated, 'day')) {
            yield put(DashboardActions.qrcodeUpdateInProfile());
        }
    }
}

function* handleConnectionStatusChange(action) {
    const { isInternetReachable } = action.payload.data;
    if (!isInternetReachable) {
        return;
    }
    const userInfo = yield select(getUserInfo);
    if (_.isEmpty(userInfo)) {
        return;
    }
    const lockAcquired = yield call([netInfoLock, 'tryAcquire']);
    if (!lockAcquired) {
        return;
    }
    yield put(DfgActions.syncInprogressData());
    yield put(ServiceActions.syncPaymentData());
    yield delay(5000);
    yield call([netInfoLock, 'release']);
}

export default function* userSaga() {
    yield all([
        takeLatest(ActionTypes.AUTHENTICATE, authenticate),
        takeLatest(CommonActionTypes.LOG_OUT, handleLogout),
        takeLatest(ActionTypes.SEND_OTP, handleSendOtp),
        takeLatest(ActionTypes.RESEND_OTP, handleResendOtp),
        takeLatest(ActionTypes.VERIFY_OTP, handleVerifyOtp),
        takeLatest(ActionTypes.RESET_PASSWORD, handleResetPassword),
        takeLatest(ActionTypes.UPDATE_PROFILE, handleUpdateProfile),
        takeLatest(ActionTypes.UPDATE_PASSWORD, handleUpdatePassword),
        takeLatest(ActionTypes.PREPARE_ENCRYPTION_KEY, prepareEncryptionKey),
        takeLatest(CommonActionTypes.REFRESH_TOKEN_API_SUCCESS, handleRefreshToken),
        takeLatest(ActionTypes.AUTO_UPDATE, handleAutoUpdate),
        takeLatest(FOREGROUND, handleAppForegroundTransition),
        takeEvery(CONNECTION_STATUS, handleConnectionStatusChange)
    ]);
}
