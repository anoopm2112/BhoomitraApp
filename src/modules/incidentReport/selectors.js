import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getIncidentReport = state => state[STATE_REDUCER_KEY];

const incidentReportList = incidentReport => incidentReport.incidentReportList;
export const getIncidentReportList = flow(getIncidentReport, incidentReportList);

const incidentReportData = incidentReport => incidentReport.incidentReportData;
export const getIncidentReportData = flow(getIncidentReport, incidentReportData);