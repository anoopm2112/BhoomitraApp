import { api } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

export function addRrfStockIn(params, organizationId) {
    let payload = {
        body: params,
        types: [ActionTypes.ADD_RRF_STOCK_IN_API_REQUEST, ActionTypes.ADD_RRF_STOCK_IN_API_SUCCESS, ActionTypes.ADD_RRF_STOCK_IN_API_FAILED],
    };
    return {
        endpoint: `admin/organizations/${organizationId}/rrf-stock-ins`,
        api: restAPI.post,
        payload
    };
}

export function addRrfSales(params, organizationId) {
    let payload = {
        body: params,
        types: [ActionTypes.ADD_RRF_SALE_API_REQUEST, ActionTypes.ADD_RRF_SALE_API_SUCCESS, ActionTypes.ADD_RRF_SALE_API_FAILED],
    };
    return {
        endpoint: `admin/organizations/${organizationId}/rrf-sales`,
        api: restAPI.post,
        payload
    };
}

export function saveShreddedPlastic(params) {
    let payload = {
        body: params,
        types: [ActionTypes.SAVE_SHREDDED_PLASTIC_API_REQUEST, ActionTypes.SAVE_SHREDDED_PLASTIC_API_SUCCESS, ActionTypes.SAVE_SHREDDED_PLASTIC_API_FAILED],
    };
    return {
        endpoint: `admin/rrf-shredding`,
        api: restAPI.post,
        payload
    };
}

