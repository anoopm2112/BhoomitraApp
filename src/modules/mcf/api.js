import { api } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

export function addMcfStockIn(params, organizationId) {
    let payload = {
        body: params,
        types: [ActionTypes.ADD_MCF_STOCK_IN_API_REQUEST, ActionTypes.ADD_MCF_STOCK_IN_API_SUCCESS, ActionTypes.ADD_MCF_STOCK_IN_API_FAILED],
    };
    return {
        endpoint: `admin/organizations/${organizationId}/mcf-stock-ins`,
        api: restAPI.post,
        payload
    };
}

export function addMcfStockTransfer(params, organizationId) {
    let payload = {
        body: params,
        types: [ActionTypes.ADD_MCF_STOCK_TRANSFER_API_REQUEST, ActionTypes.ADD_MCF_STOCK_TRANSFER_API_SUCCESS, ActionTypes.ADD_MCF_STOCK_TRANSFER_API_FAILED],
    };
    return {
        endpoint: `admin/organizations/${organizationId}/mcf-stock-transfers`,
        api: restAPI.post,
        payload
    };
}

export function addMcfSales(params, organizationId) {
    let payload = {
        body: params,
        types: [ActionTypes.ADD_MCF_SALE_API_REQUEST, ActionTypes.ADD_MCF_SALE_API_SUCCESS, ActionTypes.ADD_MCF_SALE_API_FAILED],
    };
    return {
        endpoint: `admin/organizations/${organizationId}/mcf-sales`,
        api: restAPI.post,
        payload
    };
}


export function getMcfItemName(params) {
    let payload = {
        types: [ActionTypes.GET_MCF_ITEM_NAME_API_REQUEST, ActionTypes.GET_MCF_ITEM_NAME_API_SUCCESS, ActionTypes.GET_MCF_ITEM_NAME_API_FAILED],
        params
    };
    return {
        endpoint: 'admin/items',
        api: restAPI.get,
        payload
    };
}

export function getMcfStockTransferTo(params) {
    let payload = {
        types: [ActionTypes.GET_MCF_STOCK_TRANSFER_TO_REQUEST, ActionTypes.GET_MCF_STOCK_TRANSFER_TO_SUCCESS, ActionTypes.GET_MCF_STOCK_TRANSFER_TO_FAILED],
        params
    };
    return {
        endpoint: 'admin/facility-types',
        api: restAPI.get,
        payload
    };
}

export function getMcfItemTypes(params) {
    let payload = {
        types: [ActionTypes.GET_MCF_ITEM_TYPES_REQUEST, ActionTypes.GET_MCF_ITEM_TYPES_SUCCESS, ActionTypes.GET_MCF_ITEM_TYPES_FAILED],
        params
    };
    return {
        endpoint: 'admin/item-types',
        api: restAPI.get,
        payload
    };
}

export function getAssociations(params, organizationId, orgtype) {
    let payload = {
        types: [ActionTypes.GET_MCF_ASSOCIATIONS_API_REQUEST, ActionTypes.GET_MCF_ASSOCIATIONS_API_SUCCESS, ActionTypes.GET_MCF_ASSOCIATIONS_API_FAILED],
        params
    };
    return {
        endpoint: `admin/organizations/${organizationId}/types/${orgtype}/associations`,
        api: restAPI.get,
        payload
    };
}

export function getRate(params, organizationId,) {
    let payload = {
        types: [ActionTypes.GET_RATE_API_REQUEST, ActionTypes.GET_RATE_API_SUCCESS, ActionTypes.GET_RATE_API_FAILED],
        params
    };
    return {
        endpoint: `admin/organizations/${organizationId}/price`,
        api: restAPI.get,
        payload
    };
}

export function getSegregationItemName(params) {
    let payload = {
        types: [ActionTypes.GET_SEGREGATION_ITEM_TYPES_REQUEST, ActionTypes.GET_SEGREGATION_ITEM_TYPES_SUCCESS, ActionTypes.GET_SEGREGATION_ITEM_TYPES_FAILED],
        params
    };
    return {
        endpoint: `admin/item-types`,
        api: restAPI.get,
        payload
    };
}

export function getItemSubCategories(params, itemId) {
    let payload = {
        types: [ActionTypes.GET_ITEM_SUB_CATEGORIES_REQUEST, ActionTypes.GET_ITEM_SUB_CATEGORIES_SUCCESS, ActionTypes.GET_ITEM_SUB_CATEGORIES_FAILED],
        params
    };
    return {
        endpoint: `admin/items/${itemId}/item-subcategories`,
        api: restAPI.get,
        payload
    };
}

export function addMcfSegregation(params) {
    let payload = {
        body: params,
        types: [ActionTypes.ADD_MCF_SEGREGATION_REQUEST, ActionTypes.ADD_MCF_SEGREGATION_SUCCESS, ActionTypes.ADD_MCF_SEGREGATION_FAILED],
    };
    return {
        endpoint: `admin/mcf-segregation`,
        api: restAPI.post,
        payload
    };
}