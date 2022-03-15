import { all, takeLatest, delay, put, fork, take, select, call } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";
import { Platform, PermissionsAndroid } from 'react-native';
// import getDistance from 'geolib/es/getDistance';
import * as Actions from './actions';
import * as DfgActions from '../dfg/actions';
import * as UserActions from '../user/actions';
import * as ServiceActions from '../service/actions';
import * as SettingsActions from '../settings/actions';
import { I18n, saga, locks } from '../../common';
import * as DashboardAPI from './api';
import * as ServiceAPI from '../service/api';
import { fetchPaymentConfig } from '../service/saga';
import { getUserInfo } from './../user/selectors';
import { API_DATE_TIME_FORMAT } from '../../common/constants';
import { TEMPLATE_TYPES, TEMPLATE_TYPE_IDS, METADATA_STORE_KEY } from '../dfg/constants';
import { getPayloadData } from '../../common/utils/apiUtil';
import { getCurrentPosition } from '../../common/utils/locationUtil';
import { mergeCustomerProfile } from '../../common/utils/serviceUtil';
import { SurveyDataRepository, CustomerProfileRepository } from '../../common/realm/repositories';
import { infoToast, errorToast, hideToast } from '../../common/utils/toastUtil';
import { hasCustomerRole, hasGtRole, hasSurveyorRole } from '../../common/utils/userUtil';
import { getLanguage } from '../language/selectors';
import { reactivateScanner } from '../../common/components/QRCodeScanner';
import { getDefaultOrganization } from '../dfg/common/utils';
import Storage from '../../common/storages';
import { USER_INFO_STORE_KEY } from '../user/constants';
import { APP_TOUR_STORE_KEY } from '../dashboard/constants';
import { checkVersion } from "react-native-check-version";
import { locationPermissionCheck, locationPermissionRequest } from '../../common/utils/permissionUtil';
import { RESULTS } from 'react-native-permissions';
import { ANIMATION_DATA } from '../settings/constants';

const { types: ActionTypes } = Actions;
const { types: ServiceActionTypes } = ServiceActions;

const { qrcodeUpdateInProfileLock } = locks;

const {
    initializeQRCodeScanner,
    postHeaderQRCodeScanning,
    navigateToQRCodeScannerView
} = Actions;

const {
    setServiceLocation,
    resetServiceLocation,
    navigateToServiceBarcode
} = ServiceActions;

const {
    initializeSurveyDone,
    navigateToSurveyDoneView
} = DfgActions;

function* updateUserLanguage(action) {
    yield call(saga.handleAPIRequest, DashboardAPI.updateUserLanguage, action.payload.data);
}

function* loadNotification() {
    yield delay(10);
    let data = [];
    const userInfo = yield select(getUserInfo);
    const { langId } = yield select(getLanguage);
    if (hasCustomerRole(userInfo)) {
        const { additionalInfo: { customerNumber } } = userInfo;
        yield fork(saga.handleAPIRequest, DashboardAPI.customerNotificationList, { customerNumber, langId });
        const notificationListSuccessAction = yield take(ActionTypes.NOTIFICATION_API_SUCCESS);
        yield put(Actions.setNotification(notificationListSuccessAction.payload.data));
    } else if (hasSurveyorRole(userInfo) || hasGtRole(userInfo)) {
        const { id: userId } = userInfo;
        yield fork(saga.handleAPIRequest, DashboardAPI.notificationList, { userId, langId });
        const notificationListSuccessAction = yield take(ActionTypes.NOTIFICATION_API_SUCCESS);
        yield put(Actions.setNotification(notificationListSuccessAction.payload.data));
    } else {
        yield put(Actions.setNotification(data));
    }
}

function* loadQuestionUIKey(action) {
    yield fork(saga.handleAPIRequest, DashboardAPI.questionUIKeys, action.payload.data);
    const qusUIKeySuccessAction = yield take(ActionTypes.QUS_UI_KEY_API_SUCCESS);
    let data = [qusUIKeySuccessAction.payload.data];
    yield put(Actions.setQuestionUIKey(data));
}

function* populateDashboardCount() {
    yield delay(2000);
    const userInfo = yield select(getUserInfo);
    const { id: userId } = userInfo;
    const templateTypeId = TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.CUSTOMER_ENROLLMENT];
    yield fork(saga.handleAPIRequest, DashboardAPI.getSurveyTotalCount, { userId, templateTypeId });
    const totalCountSuccessAction = yield take(ActionTypes.SURVEY_ENROLLMENT_TOTAL_COUNT_API_SUCCESS);
    const remoteCompleted = totalCountSuccessAction.payload.data;
    const localCompleted = yield call([SurveyDataRepository, 'countByTemplateTypeIdAndCompletedAndSynced'], templateTypeId, true, false);
    const surveyTotal = remoteCompleted + localCompleted;
    const servicePending = yield call([CustomerProfileRepository, 'getServicePendingCount']);
    const complaintPending = yield call([CustomerProfileRepository, 'getComplaintPendingCount']);
    yield put(Actions.updateCount({ surveyTotal, servicePending, complaintPending }));
}

function* startHeaderQRcodeScanning(action) {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.customerQrCodeScanner = false;
    }
    yield put(Actions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    const params = action.payload.data || {};
    const initializer = {
        params,
        scanFinishedAction: (data) => postHeaderQRCodeScanning(data)
    };
    yield put(initializeQRCodeScanner(initializer));
    yield put(navigateToQRCodeScannerView());
}

function* handlePostHeaderQRcodeScanning(action) {
    const { params: { allowedQrCode }, qrcode: scannedQrCode } = action.payload.data;
    yield call(infoToast, I18n.t('qr_code_being_verified'), 0);
    yield delay(2000);
    if (allowedQrCode && allowedQrCode !== scannedQrCode) {
        yield call(errorToast, I18n.t('scanned_qr_code_is_wrong'), 2000);
        yield delay(1500);
        yield call(reactivateScanner);
        return;
    }
    yield put(resetServiceLocation());
    let position = undefined;
    const response = yield call(getLocationCheck);
    if (response === undefined) {
        const responseRequestPermission = yield call(getLocationRequestPermission);
        if (Platform.OS === 'android') {
            if (responseRequestPermission === PermissionsAndroid.RESULTS.DENIED) {
                yield call(getLocationRequestPermission);
            } else if (responseRequestPermission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                yield call(errorToast, I18n.t('allow_blocked_permissions'), 2000);
            }
        } else if (Platform.OS === 'ios') {
            if (responseRequestPermission === RESULTS.DENIED) {
                yield call(getLocationRequestPermission);
            } else if (responseRequestPermission === RESULTS.BLOCKED) {
                yield call(errorToast, I18n.t('allow_blocked_permissions'), 2000);
            }
        }
    }
    try {
        position = yield call(getCurrentPosition, { enableHighAccuracy: true, maximumAge: 0 });
    } catch (error) {
        yield call(errorToast, I18n.t('location_request_denied'), 2000);
        yield delay(1500);
        yield call(reactivateScanner);
        return;
    }
    let customerProfile = yield call([CustomerProfileRepository, 'findByQrCode'], scannedQrCode);
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const userInfo = yield select(getUserInfo);
        const language = yield select(getLanguage);
        const qrCodeRequest = {
            userId: userInfo.id,
            qrCode: scannedQrCode,
            langId: language.langId,
            serviceExecutionDate: moment.utc().format(API_DATE_TIME_FORMAT)
        };
        yield fork(saga.handleAPIRequest, ServiceAPI.getDetailsByQRCode, qrCodeRequest);
        const serviceDataAction = yield take([ServiceActionTypes.DETAILS_BY_QR_API_SUCCESS, ServiceActionTypes.DETAILS_BY_QR_API_FAILED]);
        if (serviceDataAction.type === ServiceActionTypes.DETAILS_BY_QR_API_SUCCESS) {
            const newProfile = getPayloadData(serviceDataAction.payload.data);
            if (!_.isEmpty(newProfile)) {
                if (customerProfile) {
                    yield call(mergeCustomerProfile, customerProfile, newProfile, false);
                } else {
                    yield call([SurveyDataRepository, 'saveCustomerProfileSurveyData'], newProfile.surveyData);
                    delete newProfile.surveyData;
                    customerProfile = newProfile;
                }
                yield call([CustomerProfileRepository, 'save'], customerProfile);
            }
            yield call(fetchPaymentConfig);
        } else {
            // If API fails then error message will be obtained from server.
            // In this case reactivate scanner and return.
            yield delay(1500);
            yield call(reactivateScanner);
            return;
        }
    } else {
        // NOOP
    }
    if (customerProfile) {
        // if (_.has(customerProfile, 'location.latitude') && _.has(customerProfile, 'location.longitude')) {
        // const { location: { latitude: customerLocationLatitude, longitude: customerLocationLongitude } } = customerProfile;
        // const { coords: { latitude: currentLocationLatitude, longitude: currentLocationLongitude } } = position;
        // const distance = yield call(getDistance, {
        //     latitude: customerLocationLatitude,
        //     longitude: customerLocationLongitude
        // }, {
        //     latitude: currentLocationLatitude,
        //     longitude: currentLocationLongitude
        // });
        // If distance is greater than 10 meters, show error
        // if (distance > 10) {
        //     yield call(errorToast, I18n.t('service_worker_not_near_customer_building'), 2000);
        //     yield delay(1500);
        //     yield call(reactivateScanner);
        //     return;
        // }
        // }
        yield call(hideToast);
        yield put(setServiceLocation(position));
        yield put(navigateToServiceBarcode({ qrCode: scannedQrCode }));
    } else {
        yield call(errorToast, I18n.t('no_details_found_for_this_qr_code'), 2000);
        yield delay(1500);
        yield call(reactivateScanner);
    }


}

async function getLocationCheck() {
    return await locationPermissionCheck();
}

async function getLocationRequestPermission() {
    return await locationPermissionRequest();
}

function* handleReadNotificationMsg(action) {
    const notificationRequest = {};
    if (action.payload.data.switchMsg) {
        const allNotificationMsgIds = _.map(action.payload.data.data, 'notificationId');
        notificationRequest.notificationIds = allNotificationMsgIds;
    } else {
        notificationRequest.notificationIds = [
            action.payload.data.data.notificationId
        ];
    }
    yield fork(saga.handleAPIRequest, DashboardAPI.setUnreadMsgToRead, notificationRequest);
    yield put(Actions.loadNotification());
}

function* handleQRcodeUpdateInProfile() {
    yield call([qrcodeUpdateInProfileLock, 'acquireAsync']);
    try {
        let userProfileInfo = yield call([Storage, 'getItem'], USER_INFO_STORE_KEY);
        userProfileInfo = userProfileInfo ? JSON.parse(userProfileInfo) : {};
        const defaultOrganization = getDefaultOrganization(userProfileInfo);
        if (!defaultOrganization) {
            return false;
        }
        const organizationId = defaultOrganization.id;
        let apiSucceeded = true;
        yield fork(saga.handleAPIRequest, DashboardAPI.qrUpdateInProfile, organizationId);
        const qrcodeUpdateAction = yield take([ActionTypes.QRCODE_UPDATE_IN_PROFILE_API_SUCCESS, ActionTypes.QRCODE_UPDATE_IN_PROFILE_API_FAILED]);
        if (qrcodeUpdateAction.type === ActionTypes.QRCODE_UPDATE_IN_PROFILE_API_SUCCESS) {
            userProfileInfo.defaultOrganization.qrCodeValidationRegex = qrcodeUpdateAction.payload.data.name;
            yield call([Storage, 'setItem'], USER_INFO_STORE_KEY, JSON.stringify(userProfileInfo));
            yield put(UserActions.updateQRcodeRegex(userProfileInfo));
            let metadata = yield call([Storage, 'getItem'], METADATA_STORE_KEY);
            metadata = metadata ? JSON.parse(metadata) : {};
            metadata.qrcodeUpdateInProfileLastUpdated = moment();
            yield call([Storage, 'setItem'], METADATA_STORE_KEY, JSON.stringify(metadata));
        } else {
            apiSucceeded = false;
        }
        return apiSucceeded;
    } catch {
        // NOOP
    } finally {
        yield call([qrcodeUpdateInProfileLock, 'release']);
    }
}

function* handleLoadSurveyDoneView(action) {
    yield put(initializeSurveyDone(action.payload.data));
    yield put(navigateToSurveyDoneView());
}

async function checkUpdateNeeded() {
    return await checkVersion();
}

function* appPlayStoreVersionCheck() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const response = yield call(checkUpdateNeeded);
        if (response.needsUpdate) {
            yield put(Actions.checkAppUpdate(true));
            const version = response.version;
            if (version !== undefined) {
                if (version[version.length - 1] === '0') {
                    yield put(Actions.setPlayStoreAppVersionData(false));
                } else if (version[version.length - 1] === '1') {
                    yield put(Actions.setPlayStoreAppVersionData(true));
                }
            }
        } else {
            yield put(Actions.checkAppUpdate(false));
        }
    }
}

function* setAppTourDataLocation() {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.selectLocation = false;
    }
    yield put(Actions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

function* setAppTourDataPhoto() {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.selectPhoto = false;
    }
    yield put(Actions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

function* takeTourThroughApp() {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour === undefined) {
        let appTour = {
            customerEnrollment: true,
            qrEnrollment: true,
            qrCodeTab: true,
            customerQrCodeScanner: true,
            enrollCustomerService: true,
            startCustomerService: true,
            scanQrCodeService: true,
            scanQrCodePendingService: true,
            selectPhoto: true,
            selectLocation: true,
            finishSurvey: true,
            finishSurveyBtn: true,
            qrScannerModal: true,
            addComplaint: true,
            addSpecialService: true,
            addIncidentReport: true
        };
        metadata.appTour = appTour;
    }
    yield put(Actions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));

    //Disable animation
    let animationData = yield call([Storage, 'getItem'], ANIMATION_DATA);
    animationData = animationData ? JSON.parse(animationData) : null;
    let data = false;
    if (animationData == null) {
        data = false;
    } else {
        data = animationData
    }
    yield put(SettingsActions.setComponentAnimation(data));
    yield call([Storage, 'setItem'], ANIMATION_DATA, JSON.stringify(data));
}

function* setAppTourDataStartCustomerService() {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.startCustomerService = false;
    }
    yield put(Actions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

function* setScanQrCodeAppTour() {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.qrScannerModal = false;
    }
    yield put(Actions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

function* incidentReportNavigate() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToIncidentReport());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

export default function* dashboardSaga() {
    yield all([
        takeLatest(ActionTypes.UPDATE_USER_LANGUAGE, updateUserLanguage),
        takeLatest(ActionTypes.LOAD_NOTIFICATION, loadNotification),
        takeLatest(ActionTypes.LOAD_QUS_UI_KEY, loadQuestionUIKey),
        takeLatest(ActionTypes.POPULATE_DASHBOARD_COUNT, populateDashboardCount),
        takeLatest(ActionTypes.START_HEADER_QRCODE_SCANNING, startHeaderQRcodeScanning),
        takeLatest(ActionTypes.POST_HEADER_QRCODE_SCANNING, handlePostHeaderQRcodeScanning),
        takeLatest(ActionTypes.READ_NOTIFICATION_MSG, handleReadNotificationMsg),
        takeLatest(ActionTypes.QRCODE_UPDATE_IN_PROFILE, handleQRcodeUpdateInProfile),
        takeLatest(ActionTypes.LOAD_SURVEY_DONE_VIEW, handleLoadSurveyDoneView),
        takeLatest(ActionTypes.APP_PLAYSTORE_VERSION_CHECK, appPlayStoreVersionCheck),
        takeLatest(ActionTypes.TAKE_TOUR_THROUGH_APP, takeTourThroughApp),
        takeLatest(ActionTypes.SET_APP_TOUR_DATA_START_CUSTOMER_SERVICE, setAppTourDataStartCustomerService),
        takeLatest(ActionTypes.SET_APP_TOUR_DATA_LOCATION, setAppTourDataLocation),
        takeLatest(ActionTypes.SET_APP_TOUR_DATA_PHOTO, setAppTourDataPhoto),
        takeLatest(ActionTypes.SET_SCAN_QR_CODE_APP_TOUR, setScanQrCodeAppTour),
        takeLatest(ActionTypes.INCIDENT_REPORT_NAVIGATE, incidentReportNavigate)
    ]);
}

export {
    handleQRcodeUpdateInProfile
};
