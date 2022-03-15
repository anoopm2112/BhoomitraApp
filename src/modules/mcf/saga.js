import { all, takeLatest, delay, put, fork, take, select, call } from 'redux-saga/effects';
import _ from 'lodash';
import * as Actions from './actions';
import * as DashboardActions from '../dashboard/actions';
import { utils, I18n, saga, actions } from '../../common';
import NetInfo from '@react-native-community/netinfo';
import * as McfAPI from './api';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import { getDefaultOrganization } from '../dfg/common/utils';
import { getStockInItems, getSaleItems } from './selectors';
import { errorToast } from '../../common/utils/toastUtil';


const { types: ActionTypes } = Actions;
const { toastUtils: { infoToast } } = utils;

function* handleMcfStockIn() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddMcfStockIn());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleMcfStockTransfer() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddMcfStockTransfer());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleMcfSale() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddMcfSale());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* handleAddMCfStockIn(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    if (action.payload.data.organizationServiceProviderId && action.payload.data.items.length > 0) {
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
        yield call(infoToast, I18n.t('mcf_stock_in_requesting'));
        yield fork(saga.handleAPIRequest, McfAPI.addMcfStockIn, params, id);
        const updateServiceRequestAction = yield take([ActionTypes.ADD_MCF_STOCK_IN_API_SUCCESS, ActionTypes.ADD_MCF_STOCK_IN_API_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.ADD_MCF_STOCK_IN_API_SUCCESS) {
            yield call(infoToast, I18n.t('mcf_stock_in_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToMcfDashboardSummary());

        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* handleAddMcfStockTransfer(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    if (action.payload.data.facilityTypeId && action.payload.data.transferTo && action.payload.data.items.length > 0) {
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
            facilityTypeId: action.payload.data.facilityTypeId,
            transferTo: action.payload.data.transferTo,
            transactedBy: action.payload.data.transactedBy,
            items: data
        }
        yield call(infoToast, I18n.t('mcf_stock_transfer_requesting'));
        yield fork(saga.handleAPIRequest, McfAPI.addMcfStockTransfer, params, id);
        const updateServiceRequestAction = yield take([ActionTypes.ADD_MCF_STOCK_TRANSFER_API_SUCCESS, ActionTypes.ADD_MCF_STOCK_TRANSFER_API_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.ADD_MCF_STOCK_TRANSFER_API_SUCCESS) {
            yield call(infoToast, I18n.t('mcf_stock_transfer_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToMcfDashboardSummary());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* handleAddMcfSale(action) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    if (action.payload.data.vendorId && action.payload.data.items.length > 0) {
        yield call(infoToast, I18n.t('mcf_stock_sale_requesting'));
        let params = action.payload.data;
        yield fork(saga.handleAPIRequest, McfAPI.addMcfSales, params, id);
        const updateServiceRequestAction = yield take([ActionTypes.ADD_MCF_SALE_API_SUCCESS, ActionTypes.ADD_MCF_SALE_API_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.ADD_MCF_SALE_API_SUCCESS) {
            yield call(infoToast, I18n.t('mcf_stock_sale_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToMcfDashboardSummary());
            yield put(Actions.resetRate());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* getMcfItemName() {
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        type: 'dropdown',
        langId: langId.langId
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, McfAPI.getMcfItemName, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToMcfDashboardSummary());
    }
}

function* getMcfStockTransferTo(actions) {
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        type: 'dropdown',
        langId: langId.langId,
        names: actions.payload.data,
        filter: true
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, McfAPI.getMcfStockTransferTo, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToMcfDashboardSummary());
    }
}

function* getMcfItemTypes() {
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        type: 'dropdown',
        langId: langId.langId
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, McfAPI.getMcfItemTypes, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToMcfDashboardSummary());
    }
}

function* getAssociations(action) {
    const orgType = action.payload.data;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { id } = defaultOrganization;
    let params = {
        type: 'dropdown',
        langId: langId.langId,
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, McfAPI.getAssociations, params, id, orgType);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'));
        yield put(DashboardActions.navigateToMcfDashboardSummary());
    }
}

function* getRate(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        itemId: action.payload.data.saleItemId,
        itemTypeId: action.payload.data.saleItemType,
        itemSubCategoryId: action.payload.data.saleItemSubCategoryId
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, McfAPI.getRate, params, action.payload.data.vendorId);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'));
    }
}

function* addStockInItem(action) {
    const stockInItems = yield select(getStockInItems);
    if (action.payload.data.quantityInKg && action.payload.data.itemId) {
        let data = {
            itemId: action.payload.data.itemId,
            itemName: action.payload.data.itemName,
            quantityInKg: action.payload.data.quantityInKg,
            itemSubCategoryId: action.payload.data.itemSubCategoryId,
            itemSubCategoryName: action.payload.data.itemSubCategoryName,
            itemTypeId: action.payload.data.itemTypeId,
            itemTypeName: action.payload.data.itemTypeName
        }
        if (stockInItems.length > 0) {
            let oldItem = _.find(stockInItems, function (o) { return o.itemId === action.payload.data.itemId && o.itemSubCategoryId === action.payload.data.itemSubCategoryId && o.itemTypeId === action.payload.data.itemTypeId; });
            let existItem = _.find(stockInItems, function (o) { return o.id === action.payload.data.id; });
            let newId = 0;
            if (oldItem === undefined && existItem !== undefined) {
                newId = existItem.id;
            } else if (oldItem !== undefined) {
                newId = oldItem.id
            }
            if (oldItem !== undefined || action.payload.data.editItem !== undefined) {
                data.id = newId;
                stockInItems[newId] = data;
                if (_.isEqual(data, oldItem)) {
                    yield call(errorToast, I18n.t('item_already_exists'));
                }
            } else {
                data.id = stockInItems[stockInItems.length - 1].id + 1;
                stockInItems.push(data);
            }
        } else {
            data.id = 0;
            stockInItems.push(data);
            yield put(Actions.setStockInItemData(stockInItems));
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* addSaleItem(action) {
    const saleItems = yield select(getSaleItems);
    if (action.payload.data.quantityInKg && action.payload.data.itemId && action.payload.data.itemSubCategoryId && action.payload.data.rate) {
        let data = {
            itemId: action.payload.data.itemId,
            itemName: action.payload.data.itemName,
            negativeRate: action.payload.data.negativeRate,
            itemTypeId: action.payload.data.itemTypeId,
            itemTypeName: action.payload.data.itemTypeName,
            quantityInKg: action.payload.data.quantityInKg,
            rate: action.payload.data.rate,
            total: action.payload.data.total,
            itemSubCategoryId: action.payload.data.itemSubCategoryId,
            itemSubCategoryName: action.payload.data.itemSubCategoryName
        }
        if (saleItems.length > 0) {
            let oldItem = _.find(saleItems, function (o) { return o.itemId === action.payload.data.itemId && o.itemSubCategoryId === action.payload.data.itemSubCategoryId && o.itemTypeId === action.payload.data.itemTypeId; });
            let existItem = _.find(saleItems, function (o) { return o.id === action.payload.data.id; });
            let newId = 0;
            if (oldItem === undefined && existItem !== undefined) {
                newId = existItem.id;
            } else if (oldItem !== undefined) {
                newId = oldItem.id
            }
            if (oldItem !== undefined || action.payload.data.editItem !== undefined) {
                data.id = newId;
                saleItems[newId] = data;
                if (_.isEqual(data, oldItem)) {
                    yield call(errorToast, I18n.t('item_already_exists'));
                }
            } else {
                data.id = saleItems[saleItems.length - 1].id + 1;
                saleItems.push(data);
            }
        } else {
            data.id = 0;
            saleItems.push(data);
            yield put(Actions.setSaleItemData(saleItems));
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* handleMcfSegregation() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToAddMcfSegregation());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* getSegregationItem() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(DashboardActions.navigateToAddMcfSegregation());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'));
    }
}

function* handleSegregationItem(action) {
    yield call(infoToast, I18n.t('mcf_segregation_requesting'));
    let params = action.payload.data;
    if (action.payload.data.itemId && action.payload.data.quantityInKg) {
        yield fork(saga.handleAPIRequest, McfAPI.addMcfSegregation, params);
        const updateServiceRequestAction = yield take([ActionTypes.ADD_MCF_SEGREGATION_SUCCESS, ActionTypes.ADD_MCF_SEGREGATION_FAILED]);
        if (updateServiceRequestAction.type === ActionTypes.ADD_MCF_SEGREGATION_SUCCESS) {
            yield call(infoToast, I18n.t('mcf_segregation_requested'));
            yield delay(1000);
            yield put(DashboardActions.navigateToMcfDashboardSummary());
        }
    } else {
        yield call(infoToast, I18n.t('fill_required_fields'));
    }
}

function* getSegregationQuantity(action) {
    yield put(Actions.setSegregationQuantity(action.payload.data))
}

function* getItemSubCategories(action) {
    const langId = yield select(getLanguage);
    let params = {
        type: 'dropdown',
        langId: langId.langId
    };
    yield fork(saga.handleAPIRequest, McfAPI.getItemSubCategories, params, action.payload.data);
}

function* removeItem(action) {
    const stockInItems = yield select(getStockInItems);
    if (action.payload.data) {
        if (stockInItems.length > 0) {
            let item = stockInItems.filter(function (ele) {
                return ele !== action.payload.data
            });
            yield put(Actions.setStockInItemData(item));
        }
    } else {
        yield call(infoToast, I18n.t('something_wrong'));
    }
}

function* removeSaleItem(action) {
    const saleItems = yield select(getSaleItems);
    if (action.payload.data) {
        if (saleItems.length > 0) {
            let item = saleItems.filter(function (ele) {
                return ele !== action.payload.data
            });
            yield put(Actions.setSaleItemData(item));
        }
    } else {
        yield call(infoToast, I18n.t('something_wrong'));
    }
}

export default function* mcfSaga() {
    yield all([
        takeLatest(ActionTypes.MCF_STOCK_IN, handleMcfStockIn),
        takeLatest(ActionTypes.MCF_STOCK_TRANSFER, handleMcfStockTransfer),
        takeLatest(ActionTypes.MCF_SALE, handleMcfSale),
        takeLatest(ActionTypes.ADD_MCF_STOCK_IN, handleAddMCfStockIn),
        takeLatest(ActionTypes.GET_MCF_ITEM_NAME, getMcfItemName),
        takeLatest(ActionTypes.GET_MCF_STOCK_TRANSFER_TO, getMcfStockTransferTo),
        takeLatest(ActionTypes.GET_MCF_ITEM_TYPES, getMcfItemTypes),
        takeLatest(ActionTypes.GET_ASSOCIATIONS, getAssociations),
        takeLatest(ActionTypes.SAVE_MCF_STOCK_TRANSFER, handleAddMcfStockTransfer),
        takeLatest(ActionTypes.GET_RATE, getRate),
        takeLatest(ActionTypes.ADD_MCF_SALE, handleAddMcfSale),
        takeLatest(ActionTypes.ADD_STOCK_IN_ITEM, addStockInItem),
        takeLatest(ActionTypes.ADD_SALE_ITEM, addSaleItem),
        takeLatest(ActionTypes.MCF_SEGREGATION, handleMcfSegregation),
        takeLatest(ActionTypes.GET_SEGREGATION_ITEM, getSegregationItem),
        takeLatest(ActionTypes.GET_SEGREGATION_QUANTITY, getSegregationQuantity),
        takeLatest(ActionTypes.SET_SEGREGATION_ITEM, handleSegregationItem),
        takeLatest(ActionTypes.GET_ITEM_SUB_CATEGORIES, getItemSubCategories),
        takeLatest(ActionTypes.REMOVE_ITEM, removeItem),
        takeLatest(ActionTypes.REMOVE_SALE_ITEM, removeSaleItem),
    ]);
}
