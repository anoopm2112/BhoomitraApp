import { actions, MODULE_ROUTE_KEYS } from '../../common';
import { ROUTE_KEYS as DASHBOARD_ROUTE_KEYS } from './constants';
import { ROUTE_KEYS as INCIDENTREPORT_ROUTE_KEYS } from '../incidentReport/constants';

const { action, navigation: { navigate, navigateWithReset } } = actions;

export const types = {
    INITIALIZE_QRCODE_SCANNER: 'Dashboard/INITIALIZE_QRCODE_SCANNER',
    CLEAR_MESSAGES: 'Dashboard/CLEAR_MESSAGES',
    UPDATE_USER_LANGUAGE: 'Dashboard/UPDATE_USER_LANGUAGE',
    LOAD_NOTIFICATION: 'Dashboard/LOAD_NOTIFICATION',
    SET_NOTIFICATION: 'Dashboard/SET_NOTIFICATION',
    TOGGLE_LOGOUT_MODAL: 'Dashboard/TOGGLE_LOGOUT_MODAL',
    LOAD_QUS_UI_KEY: 'Dashboard/LOAD_QUS_UI_KEY',
    SET_QUS_UI_KEY: 'Dashboard/SET_QUS_UI_KEY',
    UPDATE_USER_LANGUAGE_API_REQUEST: 'Dashboard/UPDATE_USER_LANGUAGE_API_REQUEST',
    UPDATE_USER_LANGUAGE_API_SUCCESS: 'Dashboard/UPDATE_USER_LANGUAGE_API_SUCCESS',
    UPDATE_USER_LANGUAGE_API_FAILED: 'Dashboard/UPDATE_USER_LANGUAGE_API_FAILED',
    NOTIFICATION_API_REQUEST: 'Dashboard/NOTIFICATION_API_REQUEST',
    NOTIFICATION_API_SUCCESS: 'Dashboard/NOTIFICATION_API_SUCCESS',
    NOTIFICATION_API_FAILED: 'Dashboard/NOTIFICATION_API_FAILED',
    QUS_UI_KEY_API_REQUEST: 'Dashboard/QUS_UI_KEY_API_REQUEST',
    QUS_UI_KEY_API_SUCCESS: 'Dashboard/QUS_UI_KEY_API_SUCCESS',
    QUS_UI_KEY_API_FAILED: 'Dashboard/QUS_UI_KEY_API_FAILED',
    POPULATE_DASHBOARD_COUNT: 'DashBoard/POPULATE_DASHBOARD_COUNT',
    UPDATE_COUNT: 'Dashboard/UPDATE_COUNT',
    SURVEY_ENROLLMENT_TOTAL_COUNT_API_REQUEST: 'Dashboard/SURVEY_ENROLLMENT_TOTAL_COUNT_API_REQUEST',
    SURVEY_ENROLLMENT_TOTAL_COUNT_API_SUCCESS: 'Dashboard/SURVEY_ENROLLMENT_TOTAL_COUNT_API_SUCCESS',
    SURVEY_ENROLLMENT_TOTAL_COUNT_API_FAILED: 'Dashboard/SURVEY_ENROLLMENT_TOTAL_COUNT_API_FAILED',
    START_HEADER_QRCODE_SCANNING: 'Dashboard/START_HEADER_QRCODE_SCANNING',
    POST_HEADER_QRCODE_SCANNING: 'Dashboard/POST_HEADER_QRCODE_SCANNING',
    READ_NOTIFICATION_API_REQUEST: 'Dashboard/READ_NOTIFICATION_API_REQUEST',
    READ_NOTIFICATION_API_SUCCESS: 'Dashboard/READ_NOTIFICATION_API_SUCCESS',
    READ_NOTIFICATION_API_FAILED: 'Dashboard/READ_NOTIFICATION_API_FAILED',
    READ_NOTIFICATION_MSG: 'Dashboard/READ_NOTIFICATION_MSG',
    QRCODE_UPDATE_IN_PROFILE: 'Dashboard/QRCODE_UPDATE_IN_PROFILE',
    QRCODE_UPDATE_IN_PROFILE_API_REQUEST: 'Dashboard/QRCODE_UPDATE_IN_PROFILE_API_REQUEST',
    QRCODE_UPDATE_IN_PROFILE_API_SUCCESS: 'Dashboard/QRCODE_UPDATE_IN_PROFILE_API_SUCCESS',
    QRCODE_UPDATE_IN_PROFILE_API_FAILED: 'Dashboard/QRCODE_UPDATE_IN_PROFILE_API_FAILED',
    LOAD_SURVEY_DONE_VIEW: 'Dashboard/LOAD_SURVEY_DONE_VIEW',
    CHECK_APP_UPDATE: 'Dashboard/CHECK_APP_UPDATE',
    APP_PLAYSTORE_VERSION_CHECK: 'Dashboard/APP_PLAYSTORE_VERSION_CHECK',
    SET_PLAYSTORE_APP_VERSION_DATA: 'Dashboard/SET_PLAYSTORE_APP_VERSION_DATA',
    TAKE_TOUR_THROUGH_APP: 'Dashboard/TAKE_TOUR_THROUGH_APP',
    SET_APP_TOUR_DATA: 'Dashboard/SET_APP_TOUR_DATA',
    SET_APP_TOUR_DATA_START_CUSTOMER_SERVICE: 'Dashboard/SET_APP_TOUR_DATA_START_CUSTOMER_SERVICE',
    SET_APP_TOUR_DATA_LOCATION: 'Dashboard/SET_APP_TOUR_DATA_LOCATION',
    SET_APP_TOUR_DATA_PHOTO: 'Dashboard/SET_APP_TOUR_DATA_PHOTO',
    SET_SCAN_QR_CODE_APP_TOUR: 'Dashboard/SET_SCAN_QR_CODE_APP_TOUR',
    SET_SCAN_QR_CODE_MODAL: 'Dashboard/SET_SCAN_QR_CODE_MODAL',
    INCIDENT_REPORT_NAVIGATE: 'Dashboard/INCIDENT_REPORT_NAVIGATE',
    DRAWER_STATUS: 'Dashboard/DRAWER_STATUS',
};

export function navigateToEnrollmentTopBar() {
    return navigate(DASHBOARD_ROUTE_KEYS.ENTROLLMENTTOPBAR);
}

export function navigateToServiceTopBar() {
    return navigate(DASHBOARD_ROUTE_KEYS.SERVICETOPBAR);
}

export function navigateToComplaintsTopBar() {
    return navigate(DASHBOARD_ROUTE_KEYS.COMPLAINTSTOPBAR);
}

export function navigateToDashboardSummary() {
    return navigateWithReset(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.SUMMARY });
}

export function navigateToNotificationView() {
    return navigate(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.NOTIFICATION });
}

export function navigateToQRCodeScannerView() {
    return navigate(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.QRCODESCANNER });
}

export function initializeQRCodeScanner(data) {
    return action(types.INITIALIZE_QRCODE_SCANNER, { data });
}

export function updateUserLanguage(data) {
    return action(types.UPDATE_USER_LANGUAGE, { data });
}

export function loadNotification() {
    return action(types.LOAD_NOTIFICATION);
}

export function setNotification(data) {
    return action(types.SET_NOTIFICATION, { data });
}

export function toggleLogoutModal(data) {
    return action(types.TOGGLE_LOGOUT_MODAL, { data });
}

export function loadQuestionUIKey() {
    return action(types.LOAD_QUS_UI_KEY);
}

export function setQuestionUIKey(data) {
    return action(types.SET_QUS_UI_KEY, { data });
}

export function populateDashboardCount() {
    return action(types.POPULATE_DASHBOARD_COUNT);
}

export function updateCount(data) {
    return action(types.UPDATE_COUNT, { data })
}

export function navigateToCustomerDashboardSummary() {
    return navigateWithReset(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.CUSTOMERSUMMARY });
}

export function navigateToMcfDashboardSummary() {
    return navigateWithReset(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.MCFSUMMARY });
}

export function startHeaderQRCodeScanning(data) {
    return action(types.START_HEADER_QRCODE_SCANNING, { data });
}

export function postHeaderQRCodeScanning(data) {
    return action(types.POST_HEADER_QRCODE_SCANNING, { data });
}

export function navigateToSubscription() {
    return navigate(MODULE_ROUTE_KEYS.ENROLLMENT, { screen: DASHBOARD_ROUTE_KEYS.ENROLLMENTSUBSCRIPTION });
}

export function navigateToServiceHistory() {
    return navigate(MODULE_ROUTE_KEYS.SERVICE, { screen: DASHBOARD_ROUTE_KEYS.SERVICEHISTORY });
}

export function navigateToNearestMcf() {
    return navigate(MODULE_ROUTE_KEYS.FACILITY, { screen: DASHBOARD_ROUTE_KEYS.FACILITYNEARESTMCF });
}

export function readNotificationMsg(data) {
    return action(types.READ_NOTIFICATION_MSG, { data })
}

export function qrcodeUpdateInProfile(data) {
    return action(types.QRCODE_UPDATE_IN_PROFILE, { data })
}

export function loadSurveyDoneView(data) {
    return action(types.LOAD_SURVEY_DONE_VIEW, { data });
}

export function checkAppUpdate(data) {
    return action(types.CHECK_APP_UPDATE, { data });
}

export function appPlayStoreVersionCheck() {
    return action(types.APP_PLAYSTORE_VERSION_CHECK);
}

export function setPlayStoreAppVersionData(data) {
    return action(types.SET_PLAYSTORE_APP_VERSION_DATA, { data });
}

export function takeTourThroughApp() {
    return action(types.TAKE_TOUR_THROUGH_APP);
}

export function setAppTourData(data) {
    return action(types.SET_APP_TOUR_DATA, { data });
}

export function setAppTourDataStartCustomerService(data) {
    return action(types.SET_APP_TOUR_DATA_START_CUSTOMER_SERVICE, { data });
}

export function setAppTourDataLocation(data) {
    return action(types.SET_APP_TOUR_DATA_LOCATION, { data });
}

export function setAppTourDataPhoto(data) {
    return action(types.SET_APP_TOUR_DATA_PHOTO, { data });
}

export function setScanQrCodeAppTour(data) {
    return action(types.SET_SCAN_QR_CODE_APP_TOUR, { data });
}

export function setScanQrCodeModal(data) {
    return action(types.SET_SCAN_QR_CODE_MODAL, { data });
}
export function navigateToIncidentReport() {
    return navigate(MODULE_ROUTE_KEYS.INCIDENTREPORT, { screen: INCIDENTREPORT_ROUTE_KEYS.INCIDENTREPORTLIST });
}

export function incidentReportNavigate() {
    return action(types.INCIDENT_REPORT_NAVIGATE);
}

export function drawerStatus(data) {
    return action(types.DRAWER_STATUS, { data });
}

export function navigateToRrfDashboardSummary() {
    return navigateWithReset(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.RRFSUMMARY });
}

export function navigateToCkcDashboardSummary() {
    return navigateWithReset(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.CKCSUMMARY });
}

export function navigateToSupervisorDashboardSummary() {
    return navigateWithReset(MODULE_ROUTE_KEYS.DASHBOARD, { screen: DASHBOARD_ROUTE_KEYS.SUPERVISORSUMMARY });
}
