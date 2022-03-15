import { api } from '../../common';
import * as Actions from './actions';

const { types: ActionTypes } = Actions;
const { restAPI } = api;

export function updateCustomer({ customerEnrollmentId, qrcode }) {
    let payload = {
        body: {
            qrCode: qrcode
        },
        types: [ActionTypes.UPDATE_CUSTOMER_API_REQUEST, ActionTypes.UPDATE_CUSTOMER_API_SUCCESS, ActionTypes.UPDATE_CUSTOMER_API_FAILED]
    };
    return {
        endpoint: `user/customers/customer-enrollment-ids/${customerEnrollmentId}`,
        api: restAPI.put,
        payload
    };
}

export function checkQrCodeExists(qrCode) {
    let payload = {
        types: [ActionTypes.CHECK_QR_CODE_EXISTS_API_REQUEST, ActionTypes.CHECK_QR_CODE_EXISTS_API_SUCCESS, ActionTypes.CHECK_QR_CODE_EXISTS_API_FAILED]
    };
    return {
        endpoint: `user/qrCodes/${qrCode}`,
        api: restAPI.get,
        showErrorToast: false,
        payload
    };
}

export function fetchSubscriptionServices(customerNumber, params) {
    let payload = {
        types: [ActionTypes.FETCH_ENROLLMET_SUBSCRIPTIONS_API_REQUEST, ActionTypes.FETCH_ENROLLMET_SUBSCRIPTIONS_API_SUCCESS, ActionTypes.FETCH_ENROLLMET_SUBSCRIPTIONS_API_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/subscription-services`,
        api: restAPI.get,
        payload
    };
}

export function fetchSubscribedServices(customerNumber, params) {
    let payload = {
        types: [ActionTypes.FETCH_ENROLLMET_SUBSCRIBED_API_REQUEST, ActionTypes.FETCH_ENROLLMET_SUBSCRIBED_API_SUCCESS, ActionTypes.FETCH_ENROLLMET_SUBSCRIBED_API_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/subscribed-services`,
        api: restAPI.get,
        payload
    };
}

export function optInOptOrOutSubscribed(customerNumber, params) {
    let payload = {
        body: params,
        types: [ActionTypes.UPDATE_SUBSCRIBED_API_REQUEST, ActionTypes.UPDATE_SUBSCRIBED_API_SUCCESS, ActionTypes.UPDATE_SUBSCRIBED_API_FAILED],
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/subscribed-services`,
        api: restAPI.post,
        payload
    };
}

export function optInOptOrOutSubscription(customerNumber, params) {
    let payload = {
        body: params,
        types: [ActionTypes.UPDATE_SUBSCRIPTIONS_API_REQUEST, ActionTypes.UPDATE_SUBSCRIPTIONS_API_SUCCESS, ActionTypes.UPDATE_SUBSCRIPTIONS_API_FAILED],
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/subscription-services`,
        api: restAPI.post,
        payload
    };
}