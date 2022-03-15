import { all, takeLatest, call, select, put } from 'redux-saga/effects';
import { PermissionsAndroid, Platform } from 'react-native';
import { requestMultiple, RESULTS } from 'react-native-permissions';
import * as Actions from './actions';
import * as SplashActions from '../splash/actions';
import { PERMISSIONS_REQUIRED } from '../../common/constants';
import { log } from '../../config';
import { PERMISSION_CHECK_STORE_KEY } from './constants';
import Storage from '../../common/storages';

const { types: ActionTypes } = Actions;

function* grantPermissions() {
    yield call([Storage, 'setItem'], PERMISSION_CHECK_STORE_KEY, 'permissionChecked');
    let allPermissionsGranted = true;
    if (allPermissionsGranted) {
        // Re-initialize here
        yield put(SplashActions.initialize());
    }
    // let blockedPermissions = [];
    // if (Platform.OS === 'android') {
    //     const requestPermissionStatuses = yield call([PermissionsAndroid, 'requestMultiple'], PERMISSIONS_REQUIRED);
    //     Object.keys(requestPermissionStatuses).forEach(permission => {
    //         let result = requestPermissionStatuses[permission];
    //         if (result !== PermissionsAndroid.RESULTS.GRANTED) {
    //             log.debug('Permission not granted for: ' + permission + '. Current status: ' + result);
    //             allPermissionsGranted = false;
    //         }
    //         if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    //             blockedPermissions.push(permission);
    //         }
    //     });
    // } else if (Platform.OS === 'ios') {
    //     const requestPermissionStatuses = yield call(requestMultiple, PERMISSIONS_REQUIRED);
    //     Object.keys(requestPermissionStatuses).forEach(permission => {
    //         let result = requestPermissionStatuses[permission];
    //         if (result !== RESULTS.GRANTED) {
    //             log.debug('Permission not granted for: ' + permission + '. Current status: ' + result);
    //             allPermissionsGranted = false;
    //         }
    //         if (result === RESULTS.BLOCKED) {
    //             blockedPermissions.push(permission);
    //         }
    //     });
    // }
    // if (allPermissionsGranted) {
    //     // Re-initialize here
    //     yield put(SplashActions.initialize());
    // }
    // } else {
    //     if (blockedPermissions.length > 0) {
    //         yield put(Actions.showAllowBlockedPermissionsModal(true));
    //     } else {
    //         yield put(Actions.showGrantPermissionsModal(true));
    //     }
    // }
}

function* denyPermissions() {
    yield put(Actions.showGrantPermissionsModal(true));
}

export default function* permissionSaga() {
    yield all([
        takeLatest(ActionTypes.GRANT_PERMISSIONS, grantPermissions),
        takeLatest(ActionTypes.DENY_PERMISSIONS, denyPermissions)
    ]);
}
