import { all, call, takeLatest, select, spawn, put } from 'redux-saga/effects';
import Storage from '../../common/storages';
import _ from 'lodash';
import NetInfo from "@react-native-community/netinfo";
import { DEVELOPER_OPTIONS_STORE_KEY, ANIMATION_DATA } from '../settings/constants';
import { getDeveloperOptions } from '../settings/selectors';
import { getUserInfo } from '../user/selectors';
import * as Actions from './actions';
import { saga, utils, I18n, constants } from '../../common';
import { handleFetchSurveyTemplates } from '../dfg/saga';
import { handleQRcodeUpdateInProfile } from '../dashboard/saga';
import { loadIncompleteServices, fetchServiceIcons } from '../service/saga';
import { fetchComplaintIcons } from '../complaints/saga';

const { toastUtils: { infoToast, successToast, errorToast }, userUtils: { hasAnyRole } } = utils;

const { ROLE_TYPES: { ROLE_SW_SUPERVISOR, ROLE_SURVEYOR_SUPERVISOR, ROLE_GT, ROLE_SURVEYOR, ROLE_CUSTOMER } } = constants;

const { types: ActionTypes } = Actions;


function* setDeveloperOptions(action) {
    const developerOptions = _.cloneDeep((yield select(getDeveloperOptions)));
    _.merge(developerOptions, action.payload.data);
    yield spawn([Storage, 'setItem'], DEVELOPER_OPTIONS_STORE_KEY, JSON.stringify(developerOptions));
}

function* handleForceUpdate() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        let templateUpdateSucceeded = true, qrCodeUpdateSucceeded = true,
            loadIncompleteServicesSucceeded = true, fetchServiceIconsSucceeded = true,
            fetchComplaintIconsSucceeded = true;
        const userInfo = yield select(getUserInfo);
        const commonRoles = [ROLE_SW_SUPERVISOR, ROLE_SURVEYOR_SUPERVISOR, ROLE_GT, ROLE_SURVEYOR];
        const hasCommonRoles = hasAnyRole(userInfo, commonRoles);
        if (hasCommonRoles) {
            yield call(infoToast, I18n.t('server_sync_in_progress'), 0);
            templateUpdateSucceeded = yield call(handleFetchSurveyTemplates);
            if (!templateUpdateSucceeded) {
                yield call(errorToast, I18n.t('error_while_updating_templates'));
            }
            qrCodeUpdateSucceeded = yield call(handleQRcodeUpdateInProfile);
            if (!qrCodeUpdateSucceeded) {
                yield call(errorToast, I18n.t('error_while_updating_qrcode_regex'));
            }
        }
        if (hasAnyRole(userInfo, [ROLE_SW_SUPERVISOR, ROLE_GT, ROLE_CUSTOMER])) {
            fetchServiceIconsSucceeded = yield call(fetchServiceIcons, { payload: { data: { forceUpdate: true } } });
            if (!fetchServiceIconsSucceeded) {
                yield call(errorToast, I18n.t('error_while_updating_service_icons'));
            }
        }
        if (hasAnyRole(userInfo, [ROLE_SW_SUPERVISOR, ROLE_GT])) {
            fetchComplaintIconsSucceeded = yield call(fetchComplaintIcons, { payload: { data: { forceUpdate: true } } });
            if (!fetchComplaintIconsSucceeded) {
                yield call(errorToast, I18n.t('error_while_updating_complaint_icons'));
            }
            loadIncompleteServicesSucceeded = yield call(loadIncompleteServices);
            if (!loadIncompleteServicesSucceeded) {
                yield call(errorToast, I18n.t('error_while_updating_service_and_complaint_data'));
            }
        }
        if (
            hasCommonRoles && templateUpdateSucceeded &&
            qrCodeUpdateSucceeded && loadIncompleteServicesSucceeded &&
            fetchServiceIconsSucceeded && fetchComplaintIconsSucceeded
        ) {
            yield call(successToast, I18n.t('server_sync_completed'));
        }
    }
}

function* componentAnimation() {
    let animationData = yield call([Storage, 'getItem'], ANIMATION_DATA);
    animationData = JSON.parse(animationData);
    let data = false;
    if (animationData == null) {
        data = false;
    } else {
        data = animationData;
    }
    yield put(Actions.setComponentAnimation(!data));
    yield call([Storage, 'setItem'], ANIMATION_DATA, JSON.stringify(!data));
}

export default function* settingsSaga() {
    yield all([
        takeLatest(ActionTypes.SET_DEVELOPER_OPTIONS, setDeveloperOptions),
        takeLatest(ActionTypes.FORCE_UPDATE, handleForceUpdate),
        takeLatest(ActionTypes.ANIMATION_DATA, componentAnimation)
    ]);
}
