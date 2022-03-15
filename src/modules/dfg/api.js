import { api } from '../../common';
import * as Actions from './actions';
// import dummyTemplate from './template';

const { types: ActionTypes } = Actions;
const { restAPI } = api;

export function fetchSurveyTemplateMetadata({ organizationId, templateId, templateTypeId, version }) {
    let payload = {
        body: {
            templateId,
            templateTypeId,
            version
        },
        types: [ActionTypes.SURVEY_TEMPLATE_METADATA_API_REQUEST, ActionTypes.SURVEY_TEMPLATE_METADATA_API_SUCCESS, ActionTypes.SURVEY_TEMPLATE_METADATA_API_FAILED]
    };
    return {
        endpoint: `admin/organizations/${organizationId}/templates/version-checker`,
        api: restAPI.post,
        payload
    };
}

export function fetchSurveyTemplate(body) {
    let payload = {
        types: [ActionTypes.SURVEY_TEMPLATE_API_REQUEST, ActionTypes.SURVEY_TEMPLATE_API_SUCCESS, ActionTypes.SURVEY_TEMPLATE_API_FAILED],
        body
    };
    return {
        endpoint: `dfg/templates/combined`,
        // testpoint: 'https://api.npoint.io/f3a3ffa6fe953475298f',
        api: restAPI.post,
        payload,
        showErrorToast: false
    };
}

export function syncInProgressSurvey({ userId, orgId, surveyData, uploadMonitor }) {
    let payload = {
        body: surveyData,
        types: [ActionTypes.SYNC_INPROGRESS_SURVEY_API_REQUEST, ActionTypes.SYNC_INPROGRESS_SURVEY_API_SUCCESS, ActionTypes.SYNC_INPROGRESS_SURVEY_API_FAILED]
    };
    return {
        endpoint: `dfg/templates/${surveyData.templateId}/users/${userId}/organizations/${orgId}/answers`,
        api: restAPI.post,
        payload,
        onUploadProgress: (progress) => {
            uploadMonitor(surveyData.id, progress);
        },
        // showErrorToast: false
    };
}

export function fetchCompleteSurveyList({ surveyCompleteListData }) {
    let payload = {
        params: surveyCompleteListData,
        types: [ActionTypes.LOAD_COMPLETE_SURVEY_LIST_API_REQUEST, ActionTypes.LOAD_COMPLETE_SURVEY_LIST_API_SUCCESS, ActionTypes.LOAD_COMPLETE_SURVEY_LIST_API_FAILED],
        options: {
            encode: false,
            arrayFormat: 'comma'
        }
    };
    return {
        endpoint: `dfg/templates/answers`,
        api: restAPI.get,
        payload
    };
}

export function fetchSurveyData(params) {
    let payload = {
        params,
        types: [ActionTypes.SURVEY_DATA_API_REQUEST, ActionTypes.SURVEY_DATA_API_SUCCESS, ActionTypes.SURVEY_DATA_API_FAILED]
    };
    return {
        endpoint: `dfg/templates/answers`,
        api: restAPI.get,
        payload,
        showErrorToast: false
    };
}

export function fetchSurveyTemplateForAnswer({ answerId, langId }) {
    let payload = {
        types: [ActionTypes.SURVEY_TEMPLATE_API_REQUEST, ActionTypes.SURVEY_TEMPLATE_API_SUCCESS, ActionTypes.SURVEY_TEMPLATE_API_FAILED],
        params: {
            langId
        }
    };
    return {
        endpoint: `dfg/templates/answers/${answerId}/template-json`,
        api: restAPI.get,
        payload,
        showErrorToast: false
    };
}

export function fetchFilterDropDownData(params) {
    let payload = {
        types: [ActionTypes.FETCH_FILTER_DROPDOWN_DATA_API_REQUEST, ActionTypes.FETCH_FILTER_DROPDOWN_DATA_API_SUCCESS, ActionTypes.FETCH_FILTER_DROPDOWN_DATA_API_FAILED],
        params
    };
    return {
        endpoint: `dfg/templates/answers`,
        api: restAPI.get,
        payload
    }
}