import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as DFG_ROUTE_KEYS } from './constants';
import { actions } from '../../common';

const { action, navigation: { navigate } } = actions;

export const types = {
    INITIALIZE_DYNAMIC_FORM: 'Dfg/INITIALIZE_DYNAMIC_FORM',
    FETCH_SURVEY_TEMPLATES: 'Dfg/FETCH_SURVEY_TEMPLATES',
    SURVEY_TEMPLATE_METADATA_API_REQUEST: 'Dfg/SURVEY_TEMPLATE_METADATA_API_REQUEST',
    SURVEY_TEMPLATE_METADATA_API_SUCCESS: 'Dfg/SURVEY_TEMPLATE_METADATA_API_SUCCESS',
    SURVEY_TEMPLATE_METADATA_API_FAILED: 'Dfg/SURVEY_TEMPLATE_METADATA_API_FAILED',
    SET_SURVEY_TEMPLATE_MESSAGE: 'Dfg/SET_SURVEY_TEMPLATE_MESSAGE',
    SURVEY_TEMPLATE_API_REQUEST: 'Dfg/SURVEY_TEMPLATE_API_REQUEST',
    SURVEY_TEMPLATE_API_SUCCESS: 'Dfg/SURVEY_TEMPLATE_API_SUCCESS',
    SURVEY_TEMPLATE_API_FAILED: 'Dfg/SURVEY_TEMPLATE_API_FAILED',
    TOGGLE_SURVEY_TEMPLATE_UPDATE_IN_PROGRESS: 'Dfg/TOGGLE_SURVEY_TEMPLATE_UPDATE_IN_PROGRESS',
    START_SURVEY: 'Dfg/START_SURVEY',
    RESET_SURVEY: 'Dfg/RESET_SURVEY',
    SURVEY_DATA_API_REQUEST: 'Dfg/SURVEY_DATA_API_REQUEST',
    SURVEY_DATA_API_SUCCESS: 'Dfg/SURVEY_DATA_API_SUCCESS',
    SURVEY_DATA_API_FAILED: 'Dfg/SURVEY_DATA_API_FAILED',
    SET_TEMPLATE_DATA: 'Dfg/SET_TEMPLATE_DATA',
    SET_SURVEY_DATA: 'Dfg/SET_SURVEY_DATA',
    SET_RENDER_DATA: 'Dfg/SET_RENDER_DATA',
    PROCESS_CONNECTED_QUESTIONS: 'Dfg/PROCESS_CONNECTED_QUESTIONS',
    UPDATE_CONNECTED_QUESTIONS_TO_SHOW: 'Dfg/UPDATE_CONNECTED_QUESTIONS_TO_SHOW',
    CLEAR_CONNECTED_QUESTIONS_TO_SHOW: 'Dfg/CLEAR_CONNECTED_QUESTIONS_TO_SHOW',
    SET_INFO_MESSAGE: 'Dfg/SET_INFO_MESSAGE',
    SET_ERROR_MESSAGE: 'Dfg/SET_ERROR_MESSAGE',
    CLEAR_MESSAGES: 'Dfg/CLEAR_MESSAGES',
    NEXT_BUTTON: 'Dfg/NEXT_BUTTON',
    PREVIOUS_BUTTON: 'Dfg/PREVIOUS_BUTTON',
    DO_RESUME: 'Dfg/DO_RESUME',
    DONT_RESUME: 'Dfg/DONT_RESUME',
    SET_SURVEY_DATA_PERIODIC_SYNC_ID: 'Dfg/SET_SURVEY_DATA_PERIODIC_SYNC_ID',
    SYNC_INPROGRESS_DATA: 'Dfg/SYNC_INPROGRESS_DATA',
    SYNC_INPROGRESS_SURVEY_API_REQUEST: 'Dfg/SYNC_INPROGRESS_SURVEY_API_REQUEST',
    SYNC_INPROGRESS_SURVEY_API_SUCCESS: 'Dfg/SYNC_INPROGRESS_SURVEY_API_SUCCESS',
    SYNC_INPROGRESS_SURVEY_API_FAILED: 'Dfg/SYNC_INPROGRESS_SURVEY_API_FAILED',
    FETCH_FILTER_DROPDOWN_DATA_API_REQUEST: 'Dfg/FETCH_FILTER_DROPDOWN_DATA_API_REQUEST',
    FETCH_FILTER_DROPDOWN_DATA_API_SUCCESS: 'Dfg/FETCH_FILTER_DROPDOWN_DATA_API_SUCCESS',
    FETCH_FILTER_DROPDOWN_DATA_API_FAILED: 'Dfg/FETCH_FILTER_DROPDOWN_DATA_API_FAILED',
    SET_DATASOURCE: 'Dfg/SET_DATASOURCE',
    ADD_TO_QUEUE: 'Dfg/ADD_TO_QUEUE',
    REMOVE_FROM_QUEUE: 'Dfg/REMOVE_FROM_QUEUE',
    UPDATE_PROGRESS: 'Dfg/UPDATE_PROGRESS',
    REMOVE_PROGRESS: 'Dfg/REMOVE_PROGRESS',
    SET_FAILED: 'Dfg/SET_FAILED',
    UNSET_FAILED: 'Dfg/UNSET_FAILED',
    SET_PROCESSED: 'Dfg/SET_PROCESSED',
    UNSET_PROCESSED: 'Dfg/UNSET_PROCESSED',
    SET_SERVICE_EXECUTED: 'Dfg/SET_SERVICE_EXECUTED',
    SET_COMPLAINT_EXECUTED: 'Dfg/SET_COMPLAINT_EXECUTED',
    LOAD_COMPLETE_SURVEY_LIST_API_REQUEST: 'Dfg/LOAD_COMPLETE_SURVEY_LIST_API_REQUEST',
    LOAD_COMPLETE_SURVEY_LIST_API_SUCCESS: 'Dfg/LOAD_COMPLETE_SURVEY_LIST_API_SUCCESS',
    LOAD_COMPLETE_SURVEY_LIST_API_FAILED: 'Dfg/LOAD_COMPLETE_SURVEY_LIST_API_FAILED',
    RESET_COMPLETED_SURVEYS_PAGE: 'Dfg/RESET_COMPLETED_SURVEYS_PAGE',
    TOGGLE_START_SERVICE_ENROLLMENT_DATA_MODAL_VISIBILITY: 'Dfg/TOGGLE_START_SERVICE_ENROLLMENT_DATA_MODAL_VISIBILITY',
    FETCH_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA: 'Dfg/FETCH_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA',
    CLEAR_COMPLETED_SURVEY_FILTER: 'Dfg/CLEAR_COMPLETED_SURVEY_FILTER',
    SET_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA: 'Dfg/SET_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA',
    SET_COMPLETED_SURVEY_FILTER: 'Dfg/SET_COMPLETED_SURVEY_FILTER',
    FILTER_MODAL_VISIBILITY: 'Dfg/FILTER_MODAL_VISIBILITY',
    CLEAR_SURVEY_DATA_FETCH_MESSAGE: 'Dfg/CLEAR_SURVEY_DATA_FETCH_MESSAGE',
    SET_SURVEY_DATA_FETCH_MESSAGE: 'Dfg/SET_SURVEY_DATA_FETCH_MESSAGE',
    TOGGLE_DOWNLOADING_SURVEY_DATA_MODAL_VISIBILITY: 'Dfg/TOGGLE_DOWNLOADING_SURVEY_DATA_MODAL_VISIBILITY',
    LOAD_COMPLETED_SURVEYS: 'Dfg/LOAD_COMPLETED_SURVEYS',
    INITIALIZE_SURVEY_DONE: 'Dfg/INITIALIZE_SURVEY_DONE',
    RESET_COMPLETED_SURVEY: 'Dfg/RESET_COMPLETED_SURVEY',
    SET_FINISH_SURVEY_BTN: 'Dfg/SET_FINISH_SURVEY_BTN'
};

export function initializeDynamicForm(data) {
    return action(types.INITIALIZE_DYNAMIC_FORM, { data });
}

export function navigateToDynamicFormView() {
    return navigate(MODULE_ROUTE_KEYS.DFG, { screen: DFG_ROUTE_KEYS.DYNAMICFORM })
}

export function setSurveyTemplateMessage(data) {
    return action(types.SET_SURVEY_TEMPLATE_MESSAGE, { data });
}

export function fetchSurveyTemplates(data) {
    return action(types.FETCH_SURVEY_TEMPLATES, { data });
}

export function toggleSurveyTemplateUpdateInProgress(data) {
    return action(types.TOGGLE_SURVEY_TEMPLATE_UPDATE_IN_PROGRESS, { data });
}

export function startSurvey() {
    return action(types.START_SURVEY);
}

export function resetSurvey() {
    return action(types.RESET_SURVEY);
}

export function setTemplateData(data) {
    return action(types.SET_TEMPLATE_DATA, { data });
}

export function setSurveyData(data) {
    return action(types.SET_SURVEY_DATA, { data });
}

export function setRenderData(data) {
    return action(types.SET_RENDER_DATA, { data });
}

export function processConnectedQuestions(data) {
    return action(types.PROCESS_CONNECTED_QUESTIONS, { data });
}

export function updateConnectedQuestionsToShow(data) {
    return action(types.UPDATE_CONNECTED_QUESTIONS_TO_SHOW, { data });
}

export function clearConnectedQuestionsToShow() {
    return action(types.CLEAR_CONNECTED_QUESTIONS_TO_SHOW);
}

export function setInfoMessage(data) {
    return action(types.SET_INFO_MESSAGE, { data });
}

export function setErrorMessage(data) {
    return action(types.SET_ERROR_MESSAGE, { data });
}

export function clearMessages() {
    return action(types.CLEAR_MESSAGES);
}

export function nextButton(data) {
    return action(types.NEXT_BUTTON, { data });
}

export function previousButton() {
    return action(types.PREVIOUS_BUTTON);
}

export function doResume() {
    return action(types.DO_RESUME);
}

export function dontResume() {
    return action(types.DONT_RESUME);
}

export function setSurveyDataPeriodicSyncId(data) {
    return action(types.SET_SURVEY_DATA_PERIODIC_SYNC_ID, { data });
}

export function syncInprogressData() {
    return action(types.SYNC_INPROGRESS_DATA);
}

export function setDataSource(data) {
    return action(types.SET_DATASOURCE, { data });
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

export function setServiceExecuted(data) {
    return action(types.SET_SERVICE_EXECUTED, { data });
}

export function setComplaintExecuted(data) {
    return action(types.SET_COMPLAINT_EXECUTED, { data });
}

export function resetCompletedSurveysPage() {
    return action(types.RESET_COMPLETED_SURVEYS_PAGE);
}

export function toogleStartServiceEnrollmentDataModalVisibility(data) {
    return action(types.TOGGLE_START_SERVICE_ENROLLMENT_DATA_MODAL_VISIBILITY, { data });
}

export function fetchCompletedSurveyFilterDropDownData(data) {
    return action(types.FETCH_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA, { data });
}

export function clearCompleteSurveyFilter() {
    return action(types.CLEAR_COMPLETED_SURVEY_FILTER);
}

export function setCompletedSurveysFilterDropDownData(data) {
    return action(types.SET_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA, { data });
}

export function setCompletedSurveysFilter(data) {
    return action(types.SET_COMPLETED_SURVEY_FILTER, { data });
}

export function filterModalVisibility(data) {
    return action(types.FILTER_MODAL_VISIBILITY, { data });
}

export function clearSurveyDataFetchMessage() {
    return action(types.CLEAR_SURVEY_DATA_FETCH_MESSAGE);
}

export function setSurveyDataFetchMessage(data) {
    return action(types.SET_SURVEY_DATA_FETCH_MESSAGE, { data });
}

export function toogleDownloadingSurveyDataModalVisibility(data) {
    return action(types.TOGGLE_DOWNLOADING_SURVEY_DATA_MODAL_VISIBILITY, { data });
}

export function navigateToSurveyFilter(data) {
    return navigate(MODULE_ROUTE_KEYS.DFG, { screen: DFG_ROUTE_KEYS.SURVEYFILTER, params: { data } })
}

export function navigateToSurveyDoneView() {
    return navigate(MODULE_ROUTE_KEYS.DFG, { screen: DFG_ROUTE_KEYS.SURVEYDONE });
}

export function navigateToSurveyDoneDetails(data) {
    return navigate(MODULE_ROUTE_KEYS.DFG, { screen: DFG_ROUTE_KEYS.SURVEYDONEDETAILS, params: { data } });
}

export function loadCompletedSurveys(data) {
    return action(types.LOAD_COMPLETED_SURVEYS, { data });
}

export function initializeSurveyDone(data) {
    return action(types.INITIALIZE_SURVEY_DONE, { data });
}

export function resetCompletedSurvey() {
    return action(types.RESET_COMPLETED_SURVEY);
}

export function setFinishSurveyBtn() {
    return action(types.SET_FINISH_SURVEY_BTN);
}
