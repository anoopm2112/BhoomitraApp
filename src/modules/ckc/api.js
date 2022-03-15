import { api } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

export function getCkcLsgiType(params) {
    let payload = {
        types: [ActionTypes.GET_CKC_LSGI_TYPE_API_REQUEST, ActionTypes.GET_CKC_LSGI_TYPE_API_SUCCESS, ActionTypes.GET_CKC_LSGI_TYPE_API_FAILED],
        params
    };
    return {
        endpoint: 'admin/organization-types/lsgi',
        api: restAPI.get,
        payload
    };
}

export function getCkcLsgiName(params, organizationId) {
    let payload = {
        types: [ActionTypes.GET_CKC_LSGI_NAME_API_REQUEST, ActionTypes.GET_CKC_LSGI_NAME_API_SUCCESS, ActionTypes.GET_CKC_LSGI_NAME_API_FAILED],
        params
    };
    return {
        endpoint: `admin/organizations/${organizationId}/lsgis`,
        api: restAPI.get,
        payload
    };
}

export function getCkcMcfRrfName(params, organizationId) {
    let payload = {
        types: [ActionTypes.GET_CKC_MCF_RRF_NAME_API_REQUEST, ActionTypes.GET_CKC_MCF_RRF_NAME_API_SUCCESS, ActionTypes.GET_CKC_MCF_RRF_NAME_API_FAILED],
        params
    };
    return {
        endpoint: `admin/organizations/${organizationId}/lsgi-associations`,
        api: restAPI.get,
        payload
    };
}

export function getCkcGoDown(params) {
    let payload = {
        types: [ActionTypes.GET_CKC_GO_DOWN_API_REQUEST, ActionTypes.GET_CKC_GO_DOWN_API_SUCCESS, ActionTypes.GET_CKC_GO_DOWN_API_FAILED],
        params
    };
    return {
        endpoint: 'admin/organizations/godowns',
        api: restAPI.get,
        payload
    };
}

export function addPickUp(params, organizationId) {
    let payload = {
        body: params,
        types: [ActionTypes.SAVE_PICK_UP_API_REQUEST, ActionTypes.SAVE_PICK_UP_API_SUCCESS, ActionTypes.SAVE_PICK_UP_API_FAILED],
    };
    return {
        endpoint: `admin/organizations/${organizationId}/ckc-pickups`,
        api: restAPI.post,
        payload
    };
}

export function addSale(params, organizationId) {
    let payload = {
        body: params,
        types: [ActionTypes.SAVE_CKC_SALE_API_REQUEST, ActionTypes.SAVE_CKC_SALE_API_SUCCESS, ActionTypes.SAVE_CKC_SALE_API_FAILED],
    };
    return {
        endpoint: `admin/organizations/${organizationId}/ckc-sales`,
        api: restAPI.post,
        payload
    };
}

