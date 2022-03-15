import { all, takeLatest, call, select, put, delay } from 'redux-saga/effects';
import Storage from '../../common/storages';
import {
    METADATA_STORE_KEY
} from '../dfg/constants';
import { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import { checkMultiple, RESULTS } from 'react-native-permissions';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Actions from './actions';
import * as LanguageActions from '../language/actions';
import * as SettingsActions from '../settings/actions';
import * as PermissionActions from '../permissions/actions';
import * as UserActions from '../user/actions';
import * as DashboardActions from '../dashboard/actions';
import { LANGUAGES, LANGUAGE_STORE_KEY } from '../language/constants';
import { AUTH_DATA_STORE_KEY, USER_INFO_STORE_KEY } from '../user/constants';
import { ROUTE_KEYS as PERMISSIONS_ROUTE_KEYS, PERMISSION_CHECK_STORE_KEY } from '../permissions/constants';
// import { PERMISSIONS_REQUIRED } from '../../common/constants';
import { getLanguage } from '../language/selectors';
import { getUserAuthData, getUserInfo } from '../user/selectors';
import { getSideBarData } from '../dashboard/selectors';
import { userUtils } from '../../common/utils';
import { getEncryptionKey } from '../user/selectors';
import container, { getInstance } from '../../common/realm';
import _ from 'lodash';

const { types: ActionTypes } = Actions;

function* initialize(action) {
    // Check if language is available in Storage
    let language = yield call([Storage, 'getItem'], LANGUAGE_STORE_KEY);
    language = language ? JSON.parse(language) : null;
    if (language) {
        const languageData = yield select(getLanguage);
        if (!languageData.hasOwnProperty('locale')) {
            yield put(LanguageActions.languageSelect({ language }));
        }
        // Check if all required permissions are granted
        // let allPermissionGranted = true;
        // if (Platform.OS === 'android') {
        //     for (let i = 0; i < PERMISSIONS_REQUIRED.length; i++) {
        //         let permission = PERMISSIONS_REQUIRED[i];
        //         let permissionGranted = yield call([PermissionsAndroid, 'check'], permission);
        //         if (!permissionGranted) {
        //             log.debug('Permission not granted for: ' + permission + '. Current status: ' + permissionGranted);
        //             allPermissionGranted = false;
        //             break;
        //         }
        //     };
        // } else if (Platform.OS === 'ios') {
        //     const checkPermissionStatuses = yield call(checkMultiple, PERMISSIONS_REQUIRED);
        //     Object.keys(checkPermissionStatuses).some(status => {
        //         if (checkPermissionStatuses[status] !== RESULTS.GRANTED) {
        //             log.debug('Permission not granted for: ' + status + '. Current status: ' + checkPermissionStatuses[status]);
        //             allPermissionGranted = false;
        //             return true;
        //         }
        //     });
        // }
        let allPermissionGranted = yield call([Storage, 'getItem'], PERMISSION_CHECK_STORE_KEY);
        if (allPermissionGranted === 'permissionChecked') {
            // Check if user authentication data is available in Storage
            let authData = yield call([Storage, 'getItem'], AUTH_DATA_STORE_KEY);
            authData = authData ? JSON.parse(authData) : null;
            let userInfo = yield call([Storage, 'getItem'], USER_INFO_STORE_KEY);
            userInfo = userInfo ? JSON.parse(userInfo) : null;
            if (authData && userInfo) {
                // Check if encryption key is available in state
                const encryptionKey = yield select(getEncryptionKey);
                if (encryptionKey) {
                    // Check if realm is loaded
                    const { realm } = container;
                    if (realm === undefined) {
                        yield call(getInstance, encryptionKey);
                    }
                    const authDataInStore = yield select(getUserAuthData);
                    const userInfoInStore = yield select(getUserInfo);
                    if (_.isEmpty(authDataInStore)) {
                        yield put(UserActions.setAuthDataFromPersistantStorage(authData));
                    }
                    if (_.isEmpty(userInfoInStore)) {
                        yield put(UserActions.setUserInfoFromPersistantStorage(userInfo));
                    }
                    if (userUtils.hasGtRole(userInfo) || userUtils.hasSurveyorRole(userInfo)) {
                        yield put(DashboardActions.navigateToDashboardSummary());
                    } else if (userUtils.hasMcfUserRole(userInfo)) {
                        yield put(DashboardActions.navigateToMcfDashboardSummary());
                    } else if (userUtils.hasRrfUserRole(userInfo)) {
                        yield put(DashboardActions.navigateToRrfDashboardSummary());
                    } else if (userUtils.hasCkcUserRole(userInfo)) {
                        yield put(DashboardActions.navigateToCkcDashboardSummary());
                    } else if (userUtils.hasSupervisorRole(userInfo)) {
                        yield put(DashboardActions.navigateToSupervisorDashboardSummary());
                    } else {
                        yield put(DashboardActions.navigateToCustomerDashboardSummary());
                    }
                    if (action.payload.data?.forceUpdate) {
                        yield put(SettingsActions.forceUpdate());
                    }
                    if (action.payload.data?.autoUpdate) {
                        yield put(UserActions.autoUpdate());
                    }
                } else {
                    yield put(UserActions.navigateToPassCode({ status: 'enter' }));
                }
            } else {
                yield put(UserActions.navigateToLogin());
            }
        } else {
            const sideBarData = yield select(getSideBarData);
            if (sideBarData.currentRoute !== PERMISSIONS_ROUTE_KEYS.PERMISSION_GRANT) {
                yield put(PermissionActions.navigateToPermissionsScreen());
            }
        }
    } else {
        yield put(LanguageActions.languageSelect({ language: LANGUAGES[0] }));
        yield put(LanguageActions.navigateToLanguageSelectScreen());
    }
}

export default function* splashSaga() {
    yield all([
        takeLatest(ActionTypes.INITIALIZE, initialize),
    ]);
}
