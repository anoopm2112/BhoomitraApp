import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as COMPLAINT_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    LOAD_INCOMPLETE_COMPLAINTS: 'Complaint/LOAD_INCOMPLETE_COMPLAINTS',
    SET_INCOMPLETE_COMPLAINTS: 'Complaint/SET_INCOMPLETE_COMPLAINTS',
    LOAD_DONE_COMPLAINTS: 'Complaint/LOAD_DONE_COMPLAINTS',
    SET_DONE_COMPLAINTS: 'Complaint/SET_DONE_COMPLAINTS',

    COMPLAINT_DONE_API_REQUEST: 'Complaint/COMPLAINT_DONE_API_REQUEST',
    COMPLAINT_DONE_API_SUCCESS: 'Complaint/COMPLAINT_DONE_API_SUCCESS',
    COMPLAINT_DONE_API_FAILED: 'Complaint/COMPLAINT_DONE_API_FAILED',

    CUSTOMER_COMPLAINT: 'Complaint/CUSTOMER_COMPLAINT',
    NEW_COMPLAINT: 'Complaint/NEW_COMPLAINT',
    NEW_COMPLAINT_IMAGE: 'Complaint/NEW_COMPLAINT_IMAGE',
    DELETE_COMPLAINT_IMAGE: 'Complaint/DELETE_COMPLAINT_IMAGE',
    FETCH_COMPLAINTS: 'Complaint/FETCH_COMPLAINTS',
    FETCH_COMPLAINTS_REQUEST: 'Complaint/FETCH_COMPLAINTS_REQUEST',
    FETCH_COMPLAINTS_SUCCESS: 'Complaint/FETCH_COMPLAINTS_SUCCESS',
    FETCH_COMPLAINTS_FAILED: 'Complaint/FETCH_COMPLAINTS_FAILED',
    SCHEDULE: 'Complaint/SCHEDULE',
    SCHEDULE_REQUEST: 'Complaint/SCHEDULE_REQUEST',
    SCHEDULE_SUCCESS: 'Complaint/SCHEDULE_SUCCESS',
    SCHEDULE_FAILED: 'Complaint/SCHEDULE_FAILED',
    ADD_COMPLAINT: 'Complaint/ADD_COMPLAINT',
    ADD_COMPLAINT_REQUEST: 'Complaint/ADD_COMPLAINT_REQUEST',
    ADD_COMPLAINT_SUCCESS: 'Complaint/ADD_COMPLAINT_SUCCESS',
    ADD_COMPLAINT_FAILED: 'Complaint/ADD_COMPLAINT_FAILED',
    GET_ALL_COMPLAINTS: 'Complaint/GET_ALL_COMPLAINTS',
    GET_ALL_COMPLAINTS_REQUEST: 'Complaint/GET_ALL_COMPLAINTS_REQUEST',
    GET_ALL_COMPLAINTS_SUCCESS: 'Complaint/GET_ALL_COMPLAINTS_SUCCESS',
    GET_ALL_COMPLAINTS_FAILED: 'Complaint/GET_ALL_COMPLAINTS_FAILED',
    START_COMPLAINT_EXECUTION: 'Complaint/START_COMPLAINT_EXECUTION',
    GENERATE_COMPLAINT_EXECUTION_SURVEY_DATA_MAP: 'Complaint/GENERATE_COMPLAINT_EXECUTION_SURVEY_DATA_MAP',
    SET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP: 'Complaint/SET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP',
    RESET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP: 'Complaint/RESET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP',
    COMPLAINT_INCOMPLETE_API_REQUEST: 'Complaint/COMPLAINT_INCOMPLETE_API_REQUEST',
    COMPLAINT_INCOMPLETE_API_SUCCESS: 'Complaint/COMPLAINT_INCOMPLETE_API_SUCCESS',
    COMPLAINT_INCOMPLETE_API_FAILED: 'Complaint/COMPLAINT_INCOMPLETE_API_FAILED',
    SET_COMPLAINTING_RESUME_MODAL_VISIBILITY: 'Complaint/SET_COMPLAINTING_RESUME_MODAL_VISIBILITY',
    FETCH_COMPLAINT_ICONS: 'Complaint/FETCH_COMPLAINT_ICONS',
    SET_COMPLAINT_ICONS: 'Complaint/SET_COMPLAINT_ICONS',
    FETCH_COMPLAINT_ICONS_API_REQUEST: 'Complaint/FETCH_COMPLAINT_ICONS_API_REQUEST',
    FETCH_COMPLAINT_ICONS_API_SUCCESS: 'Complaint/FETCH_COMPLAINT_ICONS_API_SUCCESS',
    FETCH_COMPLAINT_ICONS_API_FAILED: 'Complaint/FETCH_COMPLAINT_ICONS_API_FAILED',
    LOAD_COMPLAINT_PHOTOS: 'Complaint/LOAD_COMPLAINT_PHOTOS',
    SET_COMPLAINT_PHOTOS: 'Complaint/SET_COMPLAINT_PHOTOS',
    RESET_COMPLAINT_PHOTOS: 'Complaint/RESET_COMPLAINT_PHOTOS',
    UPDATE_DOWNLOADED_COMPLAINT_IDS_API_REQUEST: 'Complaint/UPDATE_DOWNLOADED_COMPLAINT_IDS_API_REQUEST',
    UPDATE_DOWNLOADED_COMPLAINT_IDS_API_SUCCESS: 'Complaint/UPDATE_DOWNLOADED_COMPLAINT_IDS_API_SUCCESS',
    UPDATE_DOWNLOADED_COMPLAINT_IDS_API_FAILED: 'Complaint/UPDATE_DOWNLOADED_COMPLAINT_IDS_API_FAILED',
    DELETE_COMPLAINT_API_REQUEST: 'Complaint/DELETE_COMPLAINT_API_REQUEST',
    DELETE_COMPLAINT_API_SUCCESS: 'Complaint/DELETE_COMPLAINT_API_SUCCESS',
    DELETE_COMPLAINT_API_FAILED: 'Complaint/DELETE_COMPLAINT_API_FAILED',
    DELETE_COMPLAINT: 'Complaint/DELETE_COMPLAINT'
};

export function loadIncompleteComplaints() {
    return action(types.LOAD_INCOMPLETE_COMPLAINTS);
}

export function setIncompleteComplaints(data, complaintIncompleteList) {
    return action(types.SET_INCOMPLETE_COMPLAINTS, { data, complaintIncompleteList });
}

export function loadDoneComplaints() {
    return action(types.LOAD_DONE_COMPLAINTS);
}

export function setDoneComplaints(data) {
    return action(types.SET_DONE_COMPLAINTS, { data });
}

export function customerComplaints() {
    return action(types.CUSTOMER_COMPLAINT);
}

export function navigateToCustomerComplaints() {
    return navigate(MODULE_ROUTE_KEYS.COMPLAINT, { screen: COMPLAINT_ROUTE_KEYS.COMPLAINTLIST });
}

export function newComplaint(data) {
    return action(types.NEW_COMPLAINT, { data });
}

export function navigateToNewComplaint() {
    return navigate(MODULE_ROUTE_KEYS.COMPLAINT, { screen: COMPLAINT_ROUTE_KEYS.COMPLAINTADD });
}

export function navigateToComplaintImage() {
    return navigate(MODULE_ROUTE_KEYS.COMPLAINT, { screen: COMPLAINT_ROUTE_KEYS.COMPLAINTIMAGE });
}

export function newComplaintImage(data) {
    return action(types.NEW_COMPLAINT_IMAGE, { data });
}

export function deleteComplaintImage(data) {
    return action(types.DELETE_COMPLAINT_IMAGE, { data });
}

export function fetchComplaints(data) {
    return action(types.FETCH_COMPLAINTS, { data });
}

export function schedule(data) {
    return action(types.SCHEDULE, { data });
}

export function addComplaint(data) {
    return action(types.ADD_COMPLAINT, { data });
}

export function getAllComplaints() {
    return action(types.GET_ALL_COMPLAINTS);
}

export function navigateToComplaintItemList(data) {
    return navigate(MODULE_ROUTE_KEYS.COMPLAINT, { screen: COMPLAINT_ROUTE_KEYS.COMPLAINTITEMLIST, params: { data } });
}

export function startComplaintExecution(data) {
    return action(types.START_COMPLAINT_EXECUTION, { data });
}

export function generateComplaintExecutionSurveyDataMap(data) {
    return action(types.GENERATE_COMPLAINT_EXECUTION_SURVEY_DATA_MAP, { data });
}

export function setComplaintExecutionSurveyDataMap(data) {
    return action(types.SET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP, { data });
}

export function resetComplaintExecutionSurveyDataMap(data) {
    return action(types.RESET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP, { data });
}

export function setComplaintingResumeModalVisibility(data) {
    return action(types.SET_COMPLAINTING_RESUME_MODAL_VISIBILITY, { data });
}

export function loadComplaintIcons(data) {
    return action(types.FETCH_COMPLAINT_ICONS, { data });
}

export function setComplaintIcons(data) {
    return action(types.SET_COMPLAINT_ICONS, { data });
}

export function loadComplaintPhotos(data) {
    return action(types.LOAD_COMPLAINT_PHOTOS, { data });
}

export function setComplaintPhotos(data) {
    return action(types.SET_COMPLAINT_PHOTOS, { data });
}

export function resetComplaintPhotos() {
    return action(types.RESET_COMPLAINT_PHOTOS);
}

export function deleteComplaint(data) {
    return action(types.DELETE_COMPLAINT, { data });
}
