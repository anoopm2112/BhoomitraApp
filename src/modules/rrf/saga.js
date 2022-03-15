import { all, takeLatest, delay, put, fork, take, select, call } from 'redux-saga/effects';
import _ from 'lodash';
import * as Actions from './actions';
import * as DashboardActions from '../dashboard/actions';
import { utils, I18n, saga } from '../../common';
import NetInfo from "@react-native-community/netinfo";
import * as McfAPI from './api';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import { getDefaultOrganization } from '../dfg/common/utils';

const { types: ActionTypes } = Actions;
const { toastUtils: { infoToast, successToast } } = utils;


function* handleRrfStockIn() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddRrfStockIn());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleRrfSale() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddRrfSale());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleAddRrfStockIn(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    if (action.payload.data.organizationServiceProviderId && action.payload.data.items.length > 0) {
        yield call(infoToast, I18n.t('rrf_stock_in_requesting'));
        let data = [];
        action.payload.data.items.forEach(element => {
            let item = {
                itemId: element.itemId,
                quantityInKg: element.quantityInKg,
                itemSubCategoryId: element.itemSubCategoryId
            }
            data.push(item);
        });
        let params = {
            remarks: action.payload.data.remarks,
            organizationServiceProviderId: action.payload.data.organizationServiceProviderId,
            transactedBy: action.payload.data.transactedBy,
            items: data
        }
        yield fork(saga.handleAPIRequest, McfAPI.addRrfStockIn, params, id);
        const updateServiceRequestAction = yield take([ActionTypes.ADD_RRF_STOCK_IN_API_SUCCESS, ActionTypes.ADD_RRF_STOCK_IN_API_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.ADD_RRF_STOCK_IN_API_SUCCESS) {
            yield call(infoToast, I18n.t('rrf_stock_in_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToRrfDashboardSummary());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* handleAddRrfSale(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    if (action.payload.data.vendorId && action.payload.data.items.length > 0) {
        yield call(infoToast, I18n.t('rrf_stock_sale_requesting'));
        let params = action.payload.data;
        yield fork(saga.handleAPIRequest, McfAPI.addRrfSales, params, id);
        const updateServiceRequestAction = yield take([ActionTypes.ADD_RRF_SALE_API_SUCCESS, ActionTypes.ADD_RRF_SALE_API_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.ADD_RRF_SALE_API_SUCCESS) {
            yield call(infoToast, I18n.t('rrf_stock_sale_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToRrfDashboardSummary());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* handleAddShreddedPlastic() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddShreddedPlastic());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleSaveShreddedPlastic(action) {
    yield call(infoToast, I18n.t('shredded_plastic_requesting'), 0);
    if (action.payload.data.itemId && action.payload.data.quantityInKg) {
        yield fork(saga.handleAPIRequest, McfAPI.saveShreddedPlastic, action.payload.data);
        const saveShreddedPlasticRequestAction = yield take([ActionTypes.SAVE_SHREDDED_PLASTIC_API_SUCCESS]);
        if (saveShreddedPlasticRequestAction.type === ActionTypes.SAVE_SHREDDED_PLASTIC_API_SUCCESS) {
            yield call(successToast, I18n.t('shredded_plastic_successfully'));
            yield put(DashboardActions.navigateToRrfDashboardSummary());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

export default function* rrfSaga() {
    yield all([
        takeLatest(ActionTypes.RRF_STOCK_IN, handleRrfStockIn),
        takeLatest(ActionTypes.RRF_SALE, handleRrfSale),
        takeLatest(ActionTypes.ADD_RRF_STOCK_IN, handleAddRrfStockIn),
        takeLatest(ActionTypes.ADD_RRF_SALE, handleAddRrfSale),
        takeLatest(ActionTypes.RRF_SHREDDED_PLASTIC, handleAddShreddedPlastic),
        takeLatest(ActionTypes.SAVE_SHREDDED_PLASTIC, handleSaveShreddedPlastic),
    ]);
}
