import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as INCIDENTREPORT_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    ADD_INCIDENTREPORT: 'IncidentReport/ADD_INCIDENTREPORT',
    FETCH_INCIDENTREPORT_LIST: 'IncidentReport/FETCH_INCIDENTREPORT_LIST',
    FETCH_INCIDENTREPORTS: 'IncidentReport/FETCH_INCIDENTREPORTS',
    FETCH_INCIDENTREPORT_LIST_API_REQUEST: 'IncidentReport/FETCH_INCIDENTREPORT_LIST_API_REQUEST',
    FETCH_INCIDENTREPORT_LIST_API_SUCCESS: 'IncidentReport/FETCH_INCIDENTREPORT_LIST_API_SUCCESS',
    FETCH_INCIDENTREPORT_LIST_API_FAILED: 'IncidentReport/FETCH_INCIDENTREPORT_LIST_API_FAILED',
    ADD_NEW_INCIDENTREPORT_API_REQUEST: 'IncidentReport/ADD_NEW_INCIDENTREPORT_API_REQUEST',
    ADD_NEW_INCIDENTREPORT_API_SUCCESS: 'IncidentReport/ADD_NEW_INCIDENTREPORT_API_SUCCESS',
    ADD_NEW_INCIDENTREPORT_API_FAILED: 'IncidentReport/ADD_NEW_INCIDENTREPORT_API_FAILED',
    FETCH_INCIDENTREPORT_API_REQUEST: 'IncidentReport/FETCH_INCIDENTREPORT_API_REQUEST',
    FETCH_INCIDENTREPORT_API_SUCCESS: 'IncidentReport/FETCH_INCIDENTREPORT_API_SUCCESS',
    FETCH_INCIDENTREPORT_API_FAILED: 'IncidentReport/FETCH_INCIDENTREPORT_API_FAILED',
}

export function navigateToAddNewIncidentReport() {
    return navigate(MODULE_ROUTE_KEYS.INCIDENTREPORT, { screen: INCIDENTREPORT_ROUTE_KEYS.ADDNEWINCIDENTREPORT });
}

export function fetchIncidentReportList(data) {
    return action(types.FETCH_INCIDENTREPORT_LIST, { data });
}

export function addIncidentReport(data) {
    return action(types.ADD_INCIDENTREPORT, { data });
}

export function fetchIncidentReport(data) {
    return action(types.FETCH_INCIDENTREPORTS, { data });
}