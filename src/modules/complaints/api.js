import { api } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

export function loadListData() {
    let payload = {
        types: [ActionTypes.COMPLAINT_DONE_API_REQUEST, ActionTypes.COMPLAINT_DONE_API_SUCCESS, ActionTypes.COMPLAINT_DONE_API_FAILED]
    };
    return {
        endpoint: 'user/profile',
        api: restAPI.get,
        payload
    };
}

export function fetchComplaints(customerNumber, params) {
    let payload = {
        types: [ActionTypes.FETCH_COMPLAINTS_REQUEST, ActionTypes.FETCH_COMPLAINTS_SUCCESS, ActionTypes.FETCH_COMPLAINTS_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/complaints`,
        api: restAPI.get,
        payload
    };
}

export function fetchSchedule(customerNumber, complaintId, params) {
    let payload = {
        types: [ActionTypes.SCHEDULE_REQUEST, ActionTypes.SCHEDULE_SUCCESS, ActionTypes.SCHEDULE_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/complaints/${complaintId}/schedules`,
        api: restAPI.get,
        payload
    };
}

export function addComplaint(customerNumber, params) {
    let payload = {
        types: [ActionTypes.ADD_COMPLAINT_REQUEST, ActionTypes.ADD_COMPLAINT_SUCCESS, ActionTypes.ADD_COMPLAINT_FAILED],
        body: params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/complaints`,
        api: restAPI.post,
        payload
    };
}

export function getAllComplaints(customerNumber, params) {
    let payload = {
        types: [ActionTypes.GET_ALL_COMPLAINTS_REQUEST, ActionTypes.GET_ALL_COMPLAINTS_SUCCESS, ActionTypes.GET_ALL_COMPLAINTS_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/reported-complaints`,
        api: restAPI.get,
        payload
    };
}

export function loadComplaintIcons(params) {
    let payload = {
        types: [ActionTypes.FETCH_COMPLAINT_ICONS_API_REQUEST, ActionTypes.FETCH_COMPLAINT_ICONS_API_SUCCESS, ActionTypes.FETCH_COMPLAINT_ICONS_API_FAILED],
        params
    };
    return {
        endpoint: 'admin/complaint-configs',
        api: restAPI.get,
        payload,
        showErrorToast: false
    };
}

export function markComplaintRecordsDownloadedFlag(body) {
    let payload = {
        types: [ActionTypes.UPDATE_DOWNLOADED_COMPLAINT_IDS_API_REQUEST, ActionTypes.UPDATE_DOWNLOADED_COMPLAINT_IDS_API_SUCCESS, ActionTypes.UPDATE_DOWNLOADED_COMPLAINT_IDS_API_FAILED],
        body
    };
    return {
        endpoint: `schedule/complaints/downloaded`,
        api: restAPI.post,
        payload
    };
}

export function deleteComplaint(customerNumber, complaintId) {
    let payload = {
        types: [ActionTypes.DELETE_COMPLAINT_API_REQUEST, ActionTypes.DELETE_COMPLAINT_API_SUCCESS, ActionTypes.DELETE_COMPLAINT_API_FAILED],
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/complaints/${complaintId}`,
        api: restAPI.del,
        payload
    };
}
