import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as SERVICE_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate, navigateWithReset } } = actions;

export const types = {
    UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_REQUEST: 'Service/UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_REQUEST',
    UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_SUCCESS: 'Service/UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_SUCCESS',
    UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_FAILED: 'Service/UPDATE_DOWNLOADED_SERVICE_EXECUTION_IDS_API_FAILED',
    LOAD_INCOMPLETE_SERVICES: 'Service/LOAD_INCOMPLETE_SERVICES',
    SET_INCOMPLETE_SERVICES: 'Service/SET_INCOMPLETE_SERVICES',
    LOAD_DONE_SERVICES: 'Service/LOAD_DONE_SERVICES',
    SET_DONE_SERVICES: 'Service/SET_DONE_SERVICES',
    LOAD_PHOTOS: 'Service/LOAD_PHOTOS',
    SET_PHOTOS: 'Service/SET_PHOTOS',
    RESET_PHOTOS: 'Service/RESET_PHOTOS',
    SERVICE_INCOMPLETE_API_REQUEST: 'Service/SERVICE_INCOMPLETE_API_REQUEST',
    SERVICE_INCOMPLETE_API_SUCCESS: 'Service/SERVICE_INCOMPLETE_API_SUCCESS',
    SERVICE_INCOMPLETE_API_FAILED: 'Service/SERVICE_INCOMPLETE_API_FAILED',
    DETAILS_BY_QR_API_REQUEST: 'Service/DETAILS_BY_QR_API_REQUEST',
    DETAILS_BY_QR_API_SUCCESS: 'Service/DETAILS_BY_QR_API_SUCCESS',
    DETAILS_BY_QR_API_FAILED: 'Service/DETAILS_BY_QR_API_FAILED',
    FETCH_SERVICES: 'Service/FETCH_SERVICES',
    FETCH_SERVICE_ICONS: 'Service/FETCH_SERVICE_ICONS',
    FETCH_SERVICE_ICONS_API_REQUEST: 'Service/FETCH_SERVICE_ICONS_API_REQUEST',
    FETCH_SERVICE_ICONS_API_SUCCESS: 'Service/FETCH_SERVICE_ICONS_API_SUCCESS',
    FETCH_SERVICE_ICONS_API_FAILED: 'Service/FETCH_SERVICE_ICONS_API_FAILED',
    SET_SERVICE_ICONS: 'Service/SET_SERVICE_ICONS',
    START_MOBILE_SERVICE_ENROLLMENT: 'Service/START_MOBILE_SERVICE_ENROLLMENT',
    SET_SUBSCRIPTION_RESUME_MODAL_VISIBILITY: 'Service/SET_SUBSCRIPTION_RESUME_MODAL_VISIBILITY',
    SET_SERVICING_RESUME_MODAL_VISIBILITY: 'Service/SET_SERVICING_RESUME_MODAL_VISIBILITY',
    GENERATE_SERVICE_EXECUTION_SURVEY_DATA_MAP: 'Service/GENERATE_SERVICE_EXECUTION_SURVEY_DATA_MAP',
    SET_SERVICE_EXECUTION_SURVEY_DATA_MAP: 'Service/SET_SERVICE_EXECUTION_SURVEY_DATA_MAP',
    RESET_SERVICE_EXECUTION_SURVEY_DATA_MAP: 'Service/RESET_SERVICE_EXECUTION_SURVEY_DATA_MAP',
    START_SERVICE_EXECUTION: 'Service/START_SERVICE_EXECUTION',
    NEW_SPECIAL_SERVICE_REQUEST: 'Service/NEW_SPECIAL_SERVICE_REQUEST',
    SPECIAL_SERVICE_API_REQUEST: 'Service/SPECIAL_API_SERVICE_REQUEST',
    SPECIAL_SERVICE_API_SUCCESS: 'Service/SPECIAL_SERVICE_API_SUCCESS',
    SPECIAL_SERVICE_API_FAILED: 'Service/SPECIAL_SERVICE_API_FAILED',
    UPDATE_SERVICE_REQUEST: 'Service/UPDATE_SERVICE_REQUEST',
    UPDATE_SERVICE_REQUEST_API_REQUEST: 'Service/UPDATE_SERVICE_REQUEST_API_REQUEST',
    UPDATE_SERVICE_REQUEST_API_SUCCESS: 'Service/UPDATE_SERVICE_REQUEST_API_SUCCESS',
    UPDATE_SERVICE_REQUEST_API_FAILED: 'Service/UPDATE_SERVICE_REQUEST_API_FAILED',
    UPDATE_SERVICE_REQUEST_BY_ID_API_REQUEST: 'Service/UPDATE_SERVICE_REQUEST_BY_ID_API_REQUEST',
    UPDATE_SERVICE_REQUEST_BY_ID_API_SUCCESS: 'Service/UPDATE_SERVICE_REQUEST_BY_ID_API_SUCCESS',
    UPDATE_SERVICE_REQUEST_BY_ID_API_FAILED: 'Service/UPDATE_SERVICE_REQUEST_BY_ID_API_FAILED',
    FETCH_SPECIAL_SERVICE_BY_ID: 'Service/FETCH_SPECIAL_SERVICE_BY_ID',
    FETCH_SPECIAL_SERVICE_BY_ID_API_REQUEST: 'Service/FETCH_SPECIAL_SERVICE_BY_ID_API_REQUEST',
    FETCH_SPECIAL_SERVICE_BY_ID_API_SUCCESS: 'Service/FETCH_SPECIAL_SERVICE_BY_ID_API_SUCCESS',
    FETCH_SPECIAL_SERVICE_BY_ID_API_FAILED: 'Service/FETCH_SPECIAL_SERVICE_BY_ID_API_FAILED',
    FETCH_SPECIAL_SERVICE_REQUEST_API_REQUEST: 'Service/FETCH_SPECIAL_SERVICE_REQUEST_API_REQUEST',
    FETCH_SPECIAL_SERVICE_REQUEST_API_SUCCESS: 'Service/FETCH_SPECIAL_SERVICE_REQUEST_API_SUCCESS',
    FETCH_SPECIAL_SERVICE_REQUEST_API_FAILED: 'Service/FETCH_SPECIAL_SERVICE_REQUEST_API_FAILED',
    DELETE_SPECIAL_SERVICE_REQUEST: 'Service/DELETE_SPECIAL_SERVICE_REQUEST',
    DELETE_SPECIAL_SERVICE_REQUEST_REQUEST: 'Service/DELETE_SPECIAL_SERVICE_REQUEST_REQUEST',
    DELETE_SPECIAL_SERVICE_REQUEST_SUCCESS: 'Service/DELETE_SPECIAL_SERVICE_REQUEST_SUCCESS',
    DELETE_SPECIAL_SERVICE_REQUEST_FAILED: 'Service/DELETE_SPECIAL_SERVICE_REQUEST_FAILED',
    FETCH_SERVICE_HISTORY: 'Service/FETCH_SERVICE_HISTORY',
    FETCH_SERVICE_HISTORY_API_REQUEST: 'Service/FETCH_SERVICE_HISTORY_API_REQUEST',
    FETCH_SERVICE_HISTORY_API_SUCCESS: 'Service/FETCH_SERVICE_HISTORY_API_SUCCESS',
    FETCH_SERVICE_HISTORY_API_FAILED: 'Service/FETCH_SERVICE_HISTORY_API_FAILED',
    SERVICE_HISTORY: 'Service/SERVICE_HISTORY',
    SPECIAL_SERVICES: 'Service/SPECIAL_SERVICES',
    LOAD_CUSTOMER_PROFILE: 'Service/LOAD_CUSTOMER_PROFILE',
    SET_CUSTOMER_PROFILE: 'Service/SET_CUSTOMER_PROFILE',
    RESET_CUSTOMER_PROFILE: 'Service/RESET_CUSTOMER_PROFILE',
    SET_SERVICE_LOCATION: 'Service/SET_SERVICE_LOCATION',
    RESET_SERVICE_LOCATION: 'Service/RESET_SERVICE_LOCATION',
    SCAN_QR_CODE_PENDING_SERVICE_TOUR: 'Service/SCAN_QR_CODE_PENDING_SERVICE_TOUR',
    PAYMENT_CONFIG_API_REQUEST: 'Service/PAYMENT_CONFIG_API_REQUEST',
    PAYMENT_CONFIG_API_SUCCESS: 'Service/PAYMENT_CONFIG_API_SUCCESS',
    PAYMENT_CONFIG_API_FAILED: 'Service/PAYMENT_CONFIG_API_FAILED',
    ADD_TO_QUEUE: 'Service/ADD_TO_QUEUE',
    REMOVE_FROM_QUEUE: 'Service/REMOVE_FROM_QUEUE',
    UPDATE_PROGRESS: 'Service/UPDATE_PROGRESS',
    REMOVE_PROGRESS: 'Service/REMOVE_PROGRESS',
    SET_FAILED: 'Service/SET_FAILED',
    UNSET_FAILED: 'Service/UNSET_FAILED',
    SET_PROCESSED: 'Service/SET_PROCESSED',
    UNSET_PROCESSED: 'Service/UNSET_PROCESSED',
    GENERATE_SERVICE_PAYMENT_COLLECTION_DATA: 'Service/GENERATE_SERVICE_PAYMENT_COLLECTION_DATA',
    SET_SERVICE_PAYMENT_COLLECTION_DATA: 'Service/SET_SERVICE_PAYMENT_COLLECTION_DATA',
    RESET_SERVICE_PAYMENT_COLLECTION_DATA: 'Service/RESET_SERVICE_PAYMENT_COLLECTION_DATA',
    SET_SERVICE_PAYMENT_COLLECTION_ITEM: 'Service/SET_SERVICE_PAYMENT_COLLECTION_ITEM',
    POPULATE_ADVANCE_OUTSTANDING_PAYMENT_DATA: 'Service/POPULATE_ADVANCE_OUTSTANDING_PAYMENT_DATA',
    SET_ADVANCE_OUTSTANDING_PAYMENT_DATA: 'Service/SET_ADVANCE_OUTSTANDING_PAYMENT_DATA',
    UPDATE_PAYMENT_COLLECTION: 'Service/UPDATE_PAYMENT_COLLECTION',
    SET_PAYMENT_IN_PROGRESS: 'Service/SET_PAYMENT_IN_PROGRESS',
    SYNC_PAYMENT_DATA: 'Service/SYNC_PAYMENT_DATA',
    SYNC_PAYMENT_DATA_API_REQUEST: 'Service/SYNC_PAYMENT_DATA_API_REQUEST',
    SYNC_PAYMENT_DATA_API_SUCCESS: 'Service/SYNC_PAYMENT_DATA_API_SUCCESS',
    SYNC_PAYMENT_DATA_API_FAILED: 'Service/SYNC_PAYMENT_DATA_API_FAILED',
    SET_SYNCING_INVOICES: 'Service/SET_SYNCING_INVOICES',
    RESET_SYNCING_INVOICES: 'Service/RESET_SYNCING_INVOICES',
    FETCH_CUSTOMER_INVOICES_API_REQUEST: 'Service/FETCH_CUSTOMER_INVOICES_API_REQUEST',
    FETCH_CUSTOMER_INVOICES_API_SUCCESS: 'Service/FETCH_CUSTOMER_INVOICES_API_SUCCESS',
    FETCH_CUSTOMER_INVOICES_API_FAILED: 'Service/FETCH_CUSTOMER_INVOICES_API_FAILED',
    DELETE_INVOICE: 'Service/DELETE_INVOICE',
    INVOICE_HISTORY: 'Service/INVOICE_HISTORY',
    FETCH_CUSTOMER_INVOICE_HISTORY: 'Service/FETCH_CUSTOMER_INVOICE_HISTORY',
    FETCH_CUSTOMER_INVOICE_HISTORY_API_REQUEST: 'Service/FETCH_CUSTOMER_INVOICE_HISTORY_API_REQUEST',
    FETCH_CUSTOMER_INVOICE_HISTORY_API_SUCCESS: 'Service/FETCH_CUSTOMER_INVOICE_HISTORY_API_SUCCESS',
    FETCH_CUSTOMER_INVOICE_HISTORY_API_FAILED: 'Service/FETCH_CUSTOMER_INVOICE_HISTORY_API_FAILED',
    PAYMENT_HISTORY: 'Service/PAYMENT_HISTORY',
    FETCH_CUSTOMER_PAYMENT_HISTORY: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY',
    FETCH_CUSTOMER_PAYMENT_HISTORY_API_REQUEST: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_API_REQUEST',
    FETCH_CUSTOMER_PAYMENT_HISTORY_API_SUCCESS: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_API_SUCCESS',
    FETCH_CUSTOMER_PAYMENT_HISTORY_API_FAILED: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_API_FAILED',
    RESET_PAYMENT_HISTORY_PAGE: 'Service/RESET_PAYMENT_HISTORY_PAGE',
    FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS',
    FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_REQUEST: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_REQUEST',
    FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_SUCCESS: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_SUCCESS',
    FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_FAILED: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_FAILED',
    FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_REQUEST: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_REQUEST',
    FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_SUCCESS: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_SUCCESS',
    FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_FAILED: 'Service/FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_FAILED'
};

export function navigateToServiceBarcode(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.SERVICEBARCODE, params: { data } });
}

export function loadIncompleteServices() {
    return action(types.LOAD_INCOMPLETE_SERVICES);
}

export function setIncompleteServices(data) {
    return action(types.SET_INCOMPLETE_SERVICES, { data });
}

export function loadDoneServices() {
    return action(types.LOAD_DONE_SERVICES);
}

export function setDoneServices(data) {
    return action(types.SET_DONE_SERVICES, { data });
}

export function loadPhotos(data) {
    return action(types.LOAD_PHOTOS, { data });
}

export function setPhotos(data) {
    return action(types.SET_PHOTOS, { data });
}

export function resetPhotos() {
    return action(types.RESET_PHOTOS);
}

export function navigateToServiceItemList(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.SERVICELIST, params: { data } });
}

export function navigateToServiceItemComplaintList(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.COMPLAINTLIST, params: { data } });
}

export function navigateToNewServiceRequest(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.SERVICENEWREQUEST, params: { data } });
}

export function navigateToSpecialService() {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.SERVICEREQUESTLIST });
}

export function navigateWithResetToSpecialService() {
    return navigateWithReset(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.SERVICEREQUESTLIST });
}

export function navigateToServiceHistory() {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.SERVICEHISTORY });
}

export function navigateToServicePayment(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.SERVICEPAYMENT, params: { data } });
}

export function navigateToPaymentCollectionList(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.PAYMENTCOLLECTIONLIST, params: { data } });
}

export function navigateToPaymentCollection() {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.PAYMENTCOLLECTION });
}

export function serviceHistory() {
    return action(types.SERVICE_HISTORY);
}

export function fetchServices() {
    return action(types.FETCH_SERVICES);
}

export function specialServices() {
    return action(types.SPECIAL_SERVICES);
}

export function loadServiceIcons(data) {
    return action(types.FETCH_SERVICE_ICONS, { data });
}

export function setServiceIcons(data) {
    return action(types.SET_SERVICE_ICONS, { data });
}

export function startMobileServiceEnrollment(data) {
    return action(types.START_MOBILE_SERVICE_ENROLLMENT, { data });
}

export function setSubscriptionResumeModalVisibility(data) {
    return action(types.SET_SUBSCRIPTION_RESUME_MODAL_VISIBILITY, { data });
}

export function setServicingResumeModalVisibility(data) {
    return action(types.SET_SERVICING_RESUME_MODAL_VISIBILITY, { data });
}

export function generateServiceExecutionSurveyDataMap(data) {
    return action(types.GENERATE_SERVICE_EXECUTION_SURVEY_DATA_MAP, { data });
}

export function setServiceExecutionSurveyDataMap(data) {
    return action(types.SET_SERVICE_EXECUTION_SURVEY_DATA_MAP, { data });
}

export function resetServiceExecutionSurveyDataMap() {
    return action(types.RESET_SERVICE_EXECUTION_SURVEY_DATA_MAP);
}

export function startServiceExecution(data) {
    return action(types.START_SERVICE_EXECUTION, { data });
}

export function fetchServiceHistory() {
    return action(types.FETCH_SERVICE_HISTORY);
}

export function newServiceRequest(data) {
    return action(types.NEW_SPECIAL_SERVICE_REQUEST, { data });
}

export function updateServiceRequest(data) {
    return action(types.UPDATE_SERVICE_REQUEST, { data });
}

export function getSpecialServiceById(data) {
    return action(types.FETCH_SPECIAL_SERVICE_BY_ID, { data });
}

export function deleteSpecialServiceRequest(data) {
    return action(types.DELETE_SPECIAL_SERVICE_REQUEST, { data });
}

export function loadCustomerProfile(data) {
    return action(types.LOAD_CUSTOMER_PROFILE, { data });
}

export function setCustomerProfile(data) {
    return action(types.SET_CUSTOMER_PROFILE, { data });
}

export function resetCustomerProfile() {
    return action(types.RESET_CUSTOMER_PROFILE);
}

export function setServiceLocation(data) {
    return action(types.SET_SERVICE_LOCATION, { data });
}

export function resetServiceLocation() {
    return action(types.RESET_SERVICE_LOCATION);
}

export function scanQrCodePendingServiceTourData() {
    return action(types.SCAN_QR_CODE_PENDING_SERVICE_TOUR);
}

export function addToQueue(data) {
    return action(types.ADD_TO_QUEUE, { data });
}

export function removeFromQueue(data) {
    return action(types.REMOVE_FROM_QUEUE, { data });
}

export function updateProgress(data) {
    return action(types.UPDATE_PROGRESS, { data });
}

export function removeProgress(data) {
    return action(types.REMOVE_PROGRESS, { data });
}

export function setFailed(data) {
    return action(types.SET_FAILED, { data });
}

export function unsetFailed(data) {
    return action(types.UNSET_FAILED, { data });
}

export function setProcessed(data) {
    return action(types.SET_PROCESSED, { data });
}

export function unsetProcessed(data) {
    return action(types.UNSET_PROCESSED, { data });
}

export function generateServicePaymentCollectionData(data) {
    return action(types.GENERATE_SERVICE_PAYMENT_COLLECTION_DATA, { data });
}

export function setServicePaymentCollectionData(data) {
    return action(types.SET_SERVICE_PAYMENT_COLLECTION_DATA, { data });
}

export function resetServicePaymentCollectionData() {
    return action(types.RESET_SERVICE_PAYMENT_COLLECTION_DATA);
}

export function setServicePaymentCollectionItem(data) {
    return action(types.SET_SERVICE_PAYMENT_COLLECTION_ITEM, { data });
}

export function populateAdvanceOutstandingPaymentData(data) {
    return action(types.POPULATE_ADVANCE_OUTSTANDING_PAYMENT_DATA, { data });
}

export function setAdvanceOutstandingPaymentData(data) {
    return action(types.SET_ADVANCE_OUTSTANDING_PAYMENT_DATA, { data });
}

export function updatePaymentCollection(data) {
    return action(types.UPDATE_PAYMENT_COLLECTION, { data });
}

export function setPaymentInProgress(data) {
    return action(types.SET_PAYMENT_IN_PROGRESS, { data });
}

export function syncPaymentData() {
    return action(types.SYNC_PAYMENT_DATA);
}

export function setSyncingInvoices(data) {
    return action(types.SET_SYNCING_INVOICES, { data });
}

export function resetSyncingInvoices() {
    return action(types.RESET_SYNCING_INVOICES);
}

export function deleteInvoice(data) {
    return action(types.DELETE_INVOICE, { data });
}

export function fetchCustomerInvoiceHistory() {
    return action(types.FETCH_CUSTOMER_INVOICE_HISTORY);
}

export function navigateToInvoiceCollectionList(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.INVOICEHISTORYCOLLECTIONLIST, params: { data } });
}

export function navigateToInvoiceCollectionDetails(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.INVOICEHISTORYCOLLECTIONDETAILS, params: { data } });
}

export function invoiceHistory() {
    return action(types.INVOICE_HISTORY);
}

export function navigateToPaymentHistory(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.PAYMNETHISTORYDETAILS, params: { data } });
}

export function paymentHistory(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.PAYMENTHISTORY, params: { data } });
}

export function fetchCustomerPaymentHistory(data) {
    return action(types.FETCH_CUSTOMER_PAYMENT_HISTORY, { data });
}

export function navigateToPaymentHistoryDetails(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.PAYMNETHISTORYDETAILS, params: { data } });
}

export function navigateToInvoiceSubscriptionDetails(data) {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: SERVICE_ROUTE_KEYS.INVOICEHISTORYSUBSCRIPTIONDETAILS, params: { data } });
}

export function resetPaymentHistoryPage(data) {
    return action(types.RESET_PAYMENT_HISTORY_PAGE, { data });
}

export function fetchCustomerPaymentHistoryDetails(data) {
    return action(types.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS, { data });
}

export function getPaymentHistory(data) {
    return action(types.PAYMENT_HISTORY, { data });
}
