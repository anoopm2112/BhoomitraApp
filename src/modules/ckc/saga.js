import { all, takeLatest, delay, put, fork, take, select, call } from 'redux-saga/effects';
import _ from 'lodash';
import * as Actions from './actions';
import * as DashboardActions from '../dashboard/actions';
import { utils, I18n, saga } from '../../common';
import NetInfo from "@react-native-community/netinfo";
import * as CkcAPI from './api';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import { getDefaultOrganization } from '../dfg/common/utils';

const { types: ActionTypes } = Actions;
const { toastUtils: { infoToast } } = utils;


function* handleCkcPickUp() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddCkcPickUp());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleCkcSale() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddCkcSale());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleCkcLsgiType() {
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        type: 'dropdown',
        langId: langId.langId
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, CkcAPI.getCkcLsgiType, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCkcDashboardSummary());
    }
}

function* handleCkcLsgiName(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        langId: langId.langId,
        districtId: action.payload.data.districtId,
        lsgiType: action.payload.data.itemValue
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, CkcAPI.getCkcLsgiName, params, id);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCkcDashboardSummary());
    }
}

function* handleMcfRrfName(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        langId: langId.langId,
        lsgiId: action.payload.data,
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, CkcAPI.getCkcMcfRrfName, params, id);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCkcDashboardSummary());
    }
}

function* handleCkcGoDown(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        langId: langId.langId,
        districtId: action.payload.data,
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, CkcAPI.getCkcGoDown, params, id);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCkcDashboardSummary());
    }
}

function* handleAddPickp(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    if (action.payload.data.pickupVehicleNumber && action.payload.data.lsgiId && action.payload.data.lsgiTypeId && action.payload.data.mcfOrRrfId && action.payload.data.godownId && action.payload.data.items.length > 0) {
        yield call(infoToast, I18n.t('pick_up_requesting'));
        let params = action.payload.data;
        yield fork(saga.handleAPIRequest, CkcAPI.addPickUp, params, id);
        const updateServiceRequestAction = yield take([ActionTypes.SAVE_PICK_UP_API_SUCCESS, ActionTypes.SAVE_PICK_UP_API_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.SAVE_PICK_UP_API_SUCCESS) {
            yield call(infoToast, I18n.t('pick_up_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToCkcDashboardSummary());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* handleAddSale(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    if (action.payload.data.vendorId && action.payload.data.godownId && action.payload.data.items.length > 0) {
        yield call(infoToast, I18n.t('sales_requesting'));
        let params = action.payload.data;
        yield fork(saga.handleAPIRequest, CkcAPI.addSale, params, id);
        const updateServiceRequestAction = yield take([ActionTypes.SAVE_CKC_SALE_API_SUCCESS, ActionTypes.SAVE_CKC_SALE_API_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.SAVE_CKC_SALE_API_SUCCESS) {
            yield call(infoToast, I18n.t('sales_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToCkcDashboardSummary());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }

}

export default function* ckcSaga() {
    yield all([
        takeLatest(ActionTypes.CKC_PICK_UP, handleCkcPickUp),
        takeLatest(ActionTypes.CKC_SALE, handleCkcSale),
        takeLatest(ActionTypes.CKC_LSGI_TYPE, handleCkcLsgiType),
        takeLatest(ActionTypes.CKC_LSGI_NAME, handleCkcLsgiName),
        takeLatest(ActionTypes.CKC_MCF_RRF_NAME, handleMcfRrfName),
        takeLatest(ActionTypes.CKC_GO_DOWN, handleCkcGoDown),
        takeLatest(ActionTypes.SAVE_PICK_UP, handleAddPickp),
        takeLatest(ActionTypes.SAVE_CKC_SALE, handleAddSale),
    ]);
}
