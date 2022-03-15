import { api } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

export function markServiceExecutionRecordsDownloadedFlag(body) {
    let payload = {
        types: [ActionTypes.UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_REQUEST, ActionTypes.UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_SUCCESS, ActionTypes.UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_FAILED],
        body
    };
    return {
        endpoint: `schedule/service-executions/downloaded`,
        api: restAPI.post,
        payload
    };
}

export function loadIncompleteServiceList({ userId, ...body }) {
    let payload = {
        types: [ActionTypes.SERVICE_INCOMPLETE_API_REQUEST, ActionTypes.SERVICE_INCOMPLETE_API_SUCCESS, ActionTypes.SERVICE_INCOMPLETE_API_FAILED],
        body
    };
    return {
        endpoint: `schedule/services/${userId}`,
        api: restAPI.post,
        payload,
        showErrorToast: false
    };
}

export function getDetailsByQRCode({ userId, ...body }) {
    let payload = {
        types: [ActionTypes.DETAILS_BY_QR_API_REQUEST, ActionTypes.DETAILS_BY_QR_API_SUCCESS, ActionTypes.DETAILS_BY_QR_API_FAILED],
        body
    };
    return {
        endpoint: `schedule/services/${userId}`,
        api: restAPI.post,
        payload
    };
}

export function loadServiceIcons(params) {
    let payload = {
        types: [ActionTypes.FETCH_SERVICE_ICONS_API_REQUEST, ActionTypes.FETCH_SERVICE_ICONS_API_SUCCESS, ActionTypes.FETCH_SERVICE_ICONS_API_FAILED],
        params
    };
    return {
        endpoint: 'admin/service-configs',
        api: restAPI.get,
        payload,
        showErrorToast: false
    };
}

export function getSpecialService(params, organizationId, customerNumber) {
    let payload = {
        types: [ActionTypes.SPECIAL_SERVICE_API_REQUEST, ActionTypes.SPECIAL_SERVICE_API_SUCCESS, ActionTypes.SPECIAL_SERVICE_API_FAILED],
        params
    };
    return {
        endpoint: `admin/organizations/${organizationId}/customers/${customerNumber}/special-services`,
        api: restAPI.get,
        payload
    };
}

export function updateServiceRequest(customerNumber, params) {
    let payload = {
        types: [ActionTypes.UPDATE_SERVICE_REQUEST_API_REQUEST, ActionTypes.UPDATE_SERVICE_REQUEST_API_SUCCESS, ActionTypes.UPDATE_SERVICE_REQUEST_API_FAILED],
        body: params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/special-service-request`,
        api: restAPI.post,
        payload
    };
}

export function updateServiceRequestById(specialServiceRequestId, customerNumber, params) {
    let payload = {
        types: [ActionTypes.UPDATE_SERVICE_REQUEST_BY_ID_API_REQUEST, ActionTypes.UPDATE_SERVICE_REQUEST_BY_ID_API_SUCCESS, ActionTypes.UPDATE_SERVICE_REQUEST_BY_ID_API_FAILED],
        body: params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/special-service-request/${specialServiceRequestId}`,
        api: restAPI.put,
        payload
    };
}

export function getSpecialServiceById(customerNumber, specialServiceRequestId, params) {
    let payload = {
        types: [ActionTypes.FETCH_SPECIAL_SERVICE_BY_ID_API_REQUEST, ActionTypes.FETCH_SPECIAL_SERVICE_BY_ID_API_SUCCESS, ActionTypes.FETCH_SPECIAL_SERVICE_BY_ID_API_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/special-service-request/${specialServiceRequestId}`,
        api: restAPI.get,
        payload
    };
}

export function fetchSpecialServiceRequests(customerNumber, params) {
    let payload = {
        types: [ActionTypes.FETCH_SPECIAL_SERVICE_REQUEST_API_REQUEST, ActionTypes.FETCH_SPECIAL_SERVICE_REQUEST_API_SUCCESS, ActionTypes.FETCH_SPECIAL_SERVICE_REQUEST_API_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/special-service-request`,
        api: restAPI.get,
        payload
    };
}

export function deleteSpecialServiceRequest(customerNumber, specialServiceRequestId) {
    let payload = {
        types: [ActionTypes.DELETE_SPECIAL_SERVICE_REQUEST_REQUEST, ActionTypes.DELETE_SPECIAL_SERVICE_REQUEST_SUCCESS, ActionTypes.DELETE_SPECIAL_SERVICE_REQUEST_FAILED],
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/special-service-request/${specialServiceRequestId}`,
        api: restAPI.del,
        payload
    };
}

export function fetchServiceHistory(customerNumber, params) {
    let payload = {
        types: [ActionTypes.FETCH_SERVICE_HISTORY_API_REQUEST, ActionTypes.FETCH_SERVICE_HISTORY_API_SUCCESS, ActionTypes.FETCH_SERVICE_HISTORY_API_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/services`,
        api: restAPI.get,
        payload
    };
}

export function fetchPaymentConfig({ serviceProviderId, ...params }) {
    let payload = {
        types: [ActionTypes.PAYMENT_CONFIG_API_REQUEST, ActionTypes.PAYMENT_CONFIG_API_SUCCESS, ActionTypes.PAYMENT_CONFIG_API_FAILED],
        params
    };
    return {
        endpoint: `payment/service-providers/${serviceProviderId}/payment-configs`,
        api: restAPI.get,
        payload
    };
}

export function syncPaymentData(paymentData, invoiceNumber, uploadMonitor) {
    let payload = {
        types: [ActionTypes.SYNC_PAYMENT_DATA_API_REQUEST, ActionTypes.SYNC_PAYMENT_DATA_API_SUCCESS, ActionTypes.SYNC_PAYMENT_DATA_API_FAILED],
        body: paymentData
    };
    return {
        endpoint: `payment/payments`,
        api: restAPI.post,
        payload,
        onUploadProgress: (progress) => {
            uploadMonitor(invoiceNumber, progress);
        },
        showErrorToast: false
    };
}

export function fetchCustomerInvoices(body) {
    let payload = {
        types: [ActionTypes.FETCH_CUSTOMER_INVOICES_API_REQUEST, ActionTypes.FETCH_CUSTOMER_INVOICES_API_SUCCESS, ActionTypes.FETCH_CUSTOMER_INVOICES_API_FAILED],
        body
    };
    return {
        endpoint: `payment/service-worker/customer-invoices`,
        api: restAPI.post,
        payload
    };
}

export function getCustomerInvoiceHistory(params) {
    let payload = {
        types: [ActionTypes.FETCH_CUSTOMER_INVOICE_HISTORY_API_REQUEST, ActionTypes.FETCH_CUSTOMER_INVOICE_HISTORY_API_SUCCESS, ActionTypes.FETCH_CUSTOMER_INVOICE_HISTORY_API_FAILED],
        body: params
    };
    return {
        endpoint: `payment/customer-invoices`,
        api: restAPI.post,
        payload
    };
}

export function getCustomerPaymentHistory(params) {
    let payload = {
        params,
        types: [ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_API_REQUEST, ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_API_SUCCESS, ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_API_FAILED],
    };
    return {
        endpoint: `payment/payments`,
        api: restAPI.get,
        payload
    };
}

export function getCustomerPaymentHistoryDetails(invoiceNumber) {
    let payload = {
        types: [ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_REQUEST, ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_SUCCESS, ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_FAILED],
    };
    return {
        endpoint: `payment/payments/${invoiceNumber}`,
        api: restAPI.get,
        payload
    };
}

export function getCustomerPaymentHistoryInvoicesDetails(invoiceNumber, params) {
    let payload = {
        params,
        types: [ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_REQUEST, ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_SUCCESS, ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_FAILED],
    };
    return {
        endpoint: `payment/payments/invoices/${invoiceNumber}`,
        api: restAPI.get,
        payload
    };
}
