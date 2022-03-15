import { api } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

export function fetchIncidentList(params) {
    let payload = {
        types: [ActionTypes.FETCH_INCIDENTREPORT_LIST_API_REQUEST, ActionTypes.FETCH_INCIDENTREPORT_LIST_API_SUCCESS, ActionTypes.FETCH_INCIDENTREPORT_LIST_API_FAILED],
        params
    };
    return {
        endpoint: 'user/incidents',
        api: restAPI.get,
        payload
    };
}

export function addNewIncidentReport(params) {
    let payload = {
        types: [ActionTypes.ADD_NEW_INCIDENTREPORT_API_REQUEST, ActionTypes.ADD_NEW_INCIDENTREPORT_API_SUCCESS, ActionTypes.ADD_NEW_INCIDENTREPORT_API_FAILED],
        body: params
    };
    return {
        endpoint: 'user/incidents',
        api: restAPI.post,
        payload
    };
}

export function fetchIncidentReport(params) {
    let payload = {
        types: [ActionTypes.FETCH_INCIDENTREPORT_API_REQUEST, ActionTypes.FETCH_INCIDENTREPORT_API_SUCCESS, ActionTypes.FETCH_INCIDENTREPORT_API_FAILED],
        params
    };
    return {
        endpoint: 'admin/incident-configs',
        api: restAPI.get,
        payload
    };
}
