import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as ENROLLMENT_ROUTE_KEYS } from './constants';
import { actions } from '../../common';

const { action, navigation: { navigate } } = actions;

export const types = {
    START_ENROLLMENT_SURVEY: 'Enrollment/START_ENROLLMENT_SURVEY',
    EDIT_SYNCED_SURVEY: 'Enrollment/EDIT_SYNCED_SURVEY',
    LOAD_INCOMPLETE_SURVEYS: 'Enrollment/LOAD_INCOMPLETE_SURVEYS',
    SET_INCOMPLETE_SURVEYS: 'Enrollment/SET_INCOMPLETE_SURVEYS',
    SET_RESUME_MODAL_VISIBILITY: 'Enrollment/SET_RESUME_MODAL_VISIBILITY',
    LOAD_PENDING_QR_CODE_SURVEYS: 'Enrollment/LOAD_PENDING_QR_CODE_SURVEYS',
    SET_PENDING_QR_CODE_SURVEYS: 'Enrollment/SET_PENDING_QR_CODE_SURVEYS',
    START_QR_CODE_ENROLLMENT: 'Enrollment/START_QR_CODE_ENROLLMENT',
    CHECK_QR_CODE_EXISTS_API_REQUEST: 'Enrollment/CHECK_QR_CODE_EXISTS_API_REQUEST',
    CHECK_QR_CODE_EXISTS_API_SUCCESS: 'Enrollment/CHECK_QR_CODE_EXISTS_API_SUCCESS',
    CHECK_QR_CODE_EXISTS_API_FAILED: 'Enrollment/CHECK_QR_CODE_EXISTS_API_FAILED',
    CLEAR_PENDING_QR_CODE_SURVEYS: 'Enrollment/CLEAR_PENDING_QR_CODE_SURVEYS',
    REMOVE_INPROGRESS_DATA: 'Enrollment/REMOVE_INPROGRESS_DATA',
    SET_SURVEYS_TO_BE_DELETED: 'Enrollment/SET_SURVEYS_TO_BE_DELETED',
    CLEAR_SURVEYS_TO_BE_DELETED: 'Enrollment/CLEAR_SURVEYS_TO_BE_DELETED',
    START_SERVICE_ENROLMENT: 'Enrollment/START_SERVICE_ENROLMENT',
    SYNC_SERVICE_ENROLLMENT_PROGRESS_DATA: 'Enrollment/SYNC_SERVICE_ENROLLMENT_PROGRESS_DATA',
    START_QRCODE_SCANNING: 'Enrollment/START_QRCODE_SCANNING',
    POST_QRCODE_SCANNING: 'Enrollment/POST_QRCODE_SCANNING',
    UPDATE_CUSTOMER_API_REQUEST: 'Enrollment/UPDATE_CUSTOMER_API_REQUEST',
    UPDATE_CUSTOMER_API_SUCCESS: 'Enrollment/UPDATE_CUSTOMER_API_SUCCESS',
    UPDATE_CUSTOMER_API_FAILED: 'Enrollment/UPDATE_CUSTOMER_API_FAILED',
    ENROLLMET_SUBSCRIPTIONS: 'Enrollment/ENROLLMET_SUBSCRIPTIONS',
    ENROLLMET_SUBSCRIBED: 'Enrollment/ENROLLMET_SUBSCRIBED',
    FETCH_ENROLLMET_SUBSCRIPTIONS_API_REQUEST: 'Enrollment/ENROLLMET_SUBSCRIPTIONS_API_REQUEST',
    FETCH_ENROLLMET_SUBSCRIPTIONS_API_SUCCESS: 'Enrollment/ENROLLMET_SUBSCRIPTIONS_API_SUCCESS',
    FETCH_ENROLLMET_SUBSCRIPTIONS_API_FAILED: 'Enrollment/ENROLLMET_SUBSCRIPTIONS_API_FAILED',
    FETCH_ENROLLMET_SUBSCRIBED_API_REQUEST: 'Enrollment/ENROLLMET_SUBSCRIBED_API_REQUEST',
    FETCH_ENROLLMET_SUBSCRIBED_API_SUCCESS: 'Enrollment/ENROLLMET_SUBSCRIBED_API_SUCCESS',
    FETCH_ENROLLMET_SUBSCRIBED_API_FAILED: 'Enrollment/ENROLLMET_SUBSCRIBED_API_FAILED',
    OPT_IN_OUT: 'Enrollment/OPT_IN_OUT',
    UPDATE_SUBSCRIBED_API_REQUEST: 'Enrollment/UPDATE_SUBSCRIBED_API_REQUEST',
    UPDATE_SUBSCRIBED_API_SUCCESS: 'Enrollment/UPDATE_SUBSCRIBED_API_SUCCESS',
    UPDATE_SUBSCRIBED_API_FAILED: 'Enrollment/UPDATE_SUBSCRIBED_API_FAILED',
    UPDATE_SUBSCRIPTIONS_API_REQUEST: 'Enrollment/UPDATE_SUBSCRIPTIONS_API_REQUEST',
    UPDATE_SUBSCRIPTIONS_API_SUCCESS: 'Enrollment/UPDATE_SUBSCRIPTIONS_API_SUCCESS',
    UPDATE_SUBSCRIPTIONS_API_FAILED: 'Enrollment/UPDATE_SUBSCRIPTIONS_API_FAILED',
    SUBSCRIPTIONS: 'Enrollment/SUBSCRIPTIONS',
    RESET_QR_ENROLLMENT_TOUR: 'Enrollment/RESET_QR_ENROLLMENT_TOUR',
    RESET_QR_ENROLLMENT_TAB_TOUR: 'Enrollment/RESET_QR_ENROLLMENT_TAB_TOUR',
    ENROLLMENT_INPROGRESS_ANIMATION_STATUS: 'Enrollment/ENROLLMENT_INPROGRESS_ANIMATION_STATUS'
};

export function startEnrollmentSurvey(data) {
    return action(types.START_ENROLLMENT_SURVEY, { data });
}

export function editSyncedSurvey(data) {
    return action(types.EDIT_SYNCED_SURVEY, { data });
}

export function loadIncompleteSurveys() {
    return action(types.LOAD_INCOMPLETE_SURVEYS);
}

export function setIncompleteSurveys(data) {
    return action(types.SET_INCOMPLETE_SURVEYS, { data });
}

export function setResumeModalVisibility(data) {
    return action(types.SET_RESUME_MODAL_VISIBILITY, { data });
}

export function loadPendingQrCodeSurveys() {
    return action(types.LOAD_PENDING_QR_CODE_SURVEYS);
}

export function setPendingQrCodeSurveys(data) {
    return action(types.SET_PENDING_QR_CODE_SURVEYS, { data });
}

export function startQrCodeEnrollment(data) {
    return action(types.START_QR_CODE_ENROLLMENT, { data });
}

export function clearPendingQrCodeSurveys(data) {
    return action(types.CLEAR_PENDING_QR_CODE_SURVEYS, { data });
}

export function removeInprogressData(data) {
    return action(types.REMOVE_INPROGRESS_DATA, { data });
}

export function setSurveysToBeDeleted(data) {
    return action(types.SET_SURVEYS_TO_BE_DELETED, { data });
}

export function clearSurveysToBeDeleted(data) {
    return action(types.CLEAR_SURVEYS_TO_BE_DELETED, { data });
}

export function startServiceEnrolment(data) {
    return action(types.START_SERVICE_ENROLMENT, { data });
}

export function startQRCodeScanning(data) {
    return action(types.START_QRCODE_SCANNING, { data });
}

export function postQRCodeScanning(data) {
    return action(types.POST_QRCODE_SCANNING, { data });
}

export function fetchSubscription() {
    return action(types.ENROLLMET_SUBSCRIPTIONS);
}

export function fetchSubscribed() {
    return action(types.ENROLLMET_SUBSCRIBED);
}

export function subscriptions() {
    return action(types.SUBSCRIPTIONS);
}

export function navigateToSubscription() {
    return navigate(MODULE_ROUTE_KEYS.ENROLLMENT, { screen: ENROLLMENT_ROUTE_KEYS.ENROLLMENTSUBSCRIPTION });
}

export function optInOptOrOut(data) {
    return action(types.OPT_IN_OUT, { data });
}

export function resetQrEnrollmentTourData(data) {
    return action(types.RESET_QR_ENROLLMENT_TOUR, { data });
}

export function resetQrEnrollmentTabTourData(data) {
    return action(types.RESET_QR_ENROLLMENT_TAB_TOUR, { data });
}

export function enrollmentInProgressAnimationStatus(data) {
    return action(types.ENROLLMENT_INPROGRESS_ANIMATION_STATUS, { data });
}
