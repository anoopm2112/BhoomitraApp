import flow from 'lodash/fp/flow';
import _ from 'lodash';
import { STATE_REDUCER_KEY } from './constants';

export const getDfg = state => state[STATE_REDUCER_KEY];

const initializer = dfg => dfg.initializer;
export const getInitializer = flow(getDfg, initializer);

const surveyTemplateFetchStatus = dfg => dfg.surveyTemplateFetchStatus;
export const getSurveyTemplateFetchStatus = flow(getDfg, surveyTemplateFetchStatus);

const surveyDataPeriodicSyncId = dfg => dfg.surveyDataPeriodicSyncId;
export const getSurveyDataPeriodicSyncId = flow(getDfg, surveyDataPeriodicSyncId);

const template = dfg => dfg.template;
export const getTemplate = flow(getDfg, template);

const templateFragments = dfg => _.get(dfg, 'template.fragments', []);
export const getTemplateFragments = flow(getDfg, templateFragments);

const templateRoutes = dfg => _.get(dfg, 'template.routes', {});
export const getTemplateRoutes = flow(getDfg, templateRoutes);

const survey = dfg => dfg.survey;
export const getSurvey = flow(getDfg, survey);

const render = dfg => dfg.render;
export const getRender = flow(getDfg, render);

const renderFragment = dfg => _.get(dfg, 'render.fragment', {});
export const getRenderFragment = flow(getDfg, renderFragment);

const renderInfoMessage = dfg => dfg.render.infoMessage;
export const getRenderInfoMessage = flow(getDfg, renderInfoMessage);

const renderErrorMessage = dfg => dfg.render.errorMessage;
export const getRenderErrorMessage = flow(getDfg, renderErrorMessage);

const renderConnectedQuestionsToShow = dfg => dfg.render.connectedQuestionsToShow;
export const getRenderConnectedQuestionsToShow = flow(getDfg, renderConnectedQuestionsToShow);

const deleteSurveysInProgress = dfg => dfg.deleteSurveysInProgress;
export const getDeleteSurveysInProgress = flow(getDfg, deleteSurveysInProgress);

const queued = dfg => dfg.queued;
export const getQueued = flow(getDfg, queued);

const progress = dfg => dfg.progress;
export const getProgress = flow(getDfg, progress);

const failed = dfg => dfg.failed;
export const getFailed = flow(getDfg, failed);

const processed = dfg => dfg.processed;
export const getProcessed = flow(getDfg, processed);

const completedSurveys = dfg => dfg.completedSurveys;
export const getCompletedSurveys = flow(getDfg, completedSurveys);
