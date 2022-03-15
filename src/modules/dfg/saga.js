import { all, takeLatest, takeEvery, call, fork, spawn, put, select, delay, race, take } from 'redux-saga/effects';
import './common/RandomValuesGenerator';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import AwaitLock from 'await-lock';
import _ from 'lodash';
import { Buffer } from 'buffer';
import * as yup from 'yup';
// import template from './template';
import * as DfgAPI from './api';
import I18n from './common/I18n';
import saga from './common/saga';
import locks from './common/locks';
import Storage from './common/storage';
import NetInfo from './common/NetInfo';
import Repositories from './common/repositories';
import { store } from './common/store';
import { Actions } from './common/actions';
import * as DashboardActions from '../dashboard/actions';
import { getDefaultOrganization, hasGtRole, errorToast, getPayloadData } from './common/utils';
import {
    getInitializer, getTemplate, getTemplateFragments, getTemplateRoutes, getSurvey,
    getRender, getRenderFragment, getSurveyTemplateFetchStatus, getDeveloperOptions,
    getUserInfo, getLanguage, getQueued, getFailed, getProcessed, getCompletedSurveys
} from './common/selectors';
import {
    METADATA_STORE_KEY, SURVEY_TEMPLATE_STORE_KEY,
    YUP_EXCLUDED_QUESTION_TYPES, QUESTION_TYPES,
    VALIDATION_TYPES, API_DATE_TIME_FORMAT, VALIDATION_RULES
} from './common/constants';
import { APP_TOUR_STORE_KEY } from '../dashboard/constants';

const { types: ActionTypes } = Actions;
const { surveyDataLock, syncInprogressDataLock, fetchSurveyTemplateLock } = locks;
const { SurveyDataRepository } = Repositories;

function* handleFetchSurveyTemplates(action) {
    yield call([fetchSurveyTemplateLock, 'acquireAsync']);
    try {
        const newTemplatesOnly = action?.payload?.data?.newTemplatesOnly || false;
        let templates = newTemplatesOnly ? (yield call([Storage, 'getItem'], SURVEY_TEMPLATE_STORE_KEY)) : undefined;
        templates = templates ? JSON.parse(templates) : {};
        const userInfo = yield select(getUserInfo);
        const { id: userId } = userInfo;
        const defaultOrganization = getDefaultOrganization(userInfo);
        if (!defaultOrganization) {
            yield put(Actions.setSurveyTemplateMessage(I18n.t('organizations_unavailable')));
            return false;
        }
        const surveyTemplateApiRequest = {
            orgId: defaultOrganization.id,
            langId: (yield select(getLanguage)).langId,
            userId
        };
        if (newTemplatesOnly) {
            const excludedTemplates = {};
            const excludedKeys = ['active'];
            for (const key in templates) {
                if (!excludedKeys.includes(key)) {
                    let templateVersions = Object.keys(templates[key]);
                    excludedTemplates[key] = templateVersions.map(version => templates[key][version].id);
                }
            }
            if (!_.isEmpty(excludedTemplates)) {
                surveyTemplateApiRequest.excludedTemplates = excludedTemplates;
            }
        }
        let apiSucceeded = true;
        yield fork(saga.handleAPIRequest, DfgAPI.fetchSurveyTemplate, surveyTemplateApiRequest);
        const surveyTemplateApiAction = yield take([ActionTypes.SURVEY_TEMPLATE_API_SUCCESS, ActionTypes.SURVEY_TEMPLATE_API_FAILED]);
        if (surveyTemplateApiAction.type === ActionTypes.SURVEY_TEMPLATE_API_SUCCESS) {
            const surveyTemplateApiResponse = getPayloadData(surveyTemplateApiAction.payload.data);
            if (!_.isEmpty(surveyTemplateApiResponse)) {
                let mergedTemplates = _.merge(templates, surveyTemplateApiResponse);
                yield call([Storage, 'setItem'], SURVEY_TEMPLATE_STORE_KEY, JSON.stringify(mergedTemplates));
                let metadata = yield call([Storage, 'getItem'], METADATA_STORE_KEY);
                metadata = metadata ? JSON.parse(metadata) : {};
                metadata.templatesLastUpdated = moment();
                yield call([Storage, 'setItem'], METADATA_STORE_KEY, JSON.stringify(metadata));
            }
        } else {
            apiSucceeded = false;
        }
        return apiSucceeded;
    } catch {
        // NOOP
    } finally {
        yield call([fetchSurveyTemplateLock, 'release']);
    }
}

function* handleStartSurvey() {
    const initializer = yield select(getInitializer);
    const {
        templateTypeId, version, surveyDataKey, readOnly,
        setResumeModalVisibility, skipResume, additionalInfo } = initializer;
    try {
        const surveyTemplateFetchStatus = yield select(getSurveyTemplateFetchStatus);
        if (surveyTemplateFetchStatus.updateInProgress) {
            yield put(Actions.setErrorMessage('survey_template_being_updated'));
            return;
        }
        let templates = yield call([Storage, 'getItem'], SURVEY_TEMPLATE_STORE_KEY);
        templates = templates ? JSON.parse(templates) : null;
        if (!templates) {
            yield put(Actions.setErrorMessage('template_unavailable'));
            return;
        }
        let template;
        let organizationId;
        const userInfo = yield select(getUserInfo);
        const { id: surveyorId, username: surveyor } = userInfo;
        const defaultOrganization = getDefaultOrganization(userInfo);
        // Check if current survey is a fresh survey or editing of an existing survey
        if (!surveyDataKey) {
            if (defaultOrganization) {
                organizationId = defaultOrganization.id;
            } else {
                yield put(Actions.setErrorMessage('organizations_unavailable'));
                return;
            }
            if (version !== undefined) {
                template = templates[templateTypeId][version];
            }
            else {
                let activeVersion = _.get(templates, `active.${templateTypeId}`, null);
                if (activeVersion) {
                    template = templates[templateTypeId][activeVersion];
                } else {
                    yield put(Actions.setErrorMessage('template_unavailable'));
                    return;
                }
            }
        }
        const serviceWorkerInfo = hasGtRole(userInfo) ? {
            serviceWorker: surveyor,
            serviceWorkerId: surveyorId
        } : {};
        const surveyDataIsEmpty = yield call([SurveyDataRepository, 'isEmpty'], readOnly);
        if (surveyDataIsEmpty) {
            if (surveyDataKey || readOnly) {
                yield put(Actions.setErrorMessage('survey_data_unavailable'));
                return;
            }
            const surveyData = yield call(saveOrUpdateSurveyDatasRootNode, {
                templateId: template.id,
                templateTypeId: template.typeId,
                version: template.version,
                surveyor,
                surveyorId,
                ...serviceWorkerInfo,
                organizationId,
                additionalInfo
            });
            yield put(Actions.setSurveyData(surveyData));
        } else {
            if (surveyDataKey) {
                if (!readOnly) {
                    surveyDataLock[surveyDataKey] = surveyDataLock[surveyDataKey] || new AwaitLock();
                    yield call([surveyDataLock[surveyDataKey], 'acquireAsync']);
                }
                const surveyData = yield call([SurveyDataRepository, 'findById'], surveyDataKey, readOnly);
                if (!surveyData) {
                    yield put(Actions.setErrorMessage('survey_data_unavailable'));
                    return;
                }
                if (templates.hasOwnProperty(surveyData.templateTypeId)) {
                    if (templates[surveyData.templateTypeId].hasOwnProperty(surveyData.version)) {
                        template = templates[surveyData.templateTypeId][surveyData.version];
                    } else {
                        yield put(Actions.setErrorMessage('template_version_unavailable'));
                        return;
                    }
                } else {
                    yield put(Actions.setErrorMessage('template_unavailable'));
                    return;
                }
                if (!_.isEmpty(surveyData.dynamicTemplate)) {
                    yield call(mergeDynamicTemplate, template, surveyData.dynamicTemplate);
                }
                yield put(Actions.setSurveyData(surveyData));
            } else {
                if (readOnly) {
                    yield put(Actions.setErrorMessage('readonly_missing_survey_data_key'));
                    return;
                }
                const surveyData = yield call(saveOrUpdateSurveyDatasRootNode, {
                    templateId: template.id,
                    templateTypeId: template.typeId,
                    version: template.version,
                    surveyor,
                    surveyorId,
                    ...serviceWorkerInfo,
                    organizationId,
                    additionalInfo
                });
                yield put(Actions.setSurveyData(surveyData));
            }
        }
        if (template.fragments && template.fragments.length) {
            if (!template.routes) {
                yield put(Actions.setErrorMessage('template_routes_unavailable'));
                return;
            }
            let fragmentToRender = template.fragments[0].id;
            if (surveyDataKey) {
                const surveyData = yield select(getSurvey);
                surveyData.completed = false;
                surveyData.surveyStartedAt = moment.utc().format(API_DATE_TIME_FORMAT);
                if (skipResume) {
                    surveyData.lastVisitedFragment = null;
                    surveyData.currentDynamicQuestionFragment = null;
                }
                else if (surveyData.lastVisitedFragment) {
                    yield put(setResumeModalVisibility(true));
                    const { doResume, dontResume } = yield race({
                        doResume: take(ActionTypes.DO_RESUME),
                        dontResume: take(ActionTypes.DONT_RESUME)
                    });
                    yield put(setResumeModalVisibility(false));
                    if (doResume) {
                        fragmentToRender = surveyData.lastVisitedFragment;
                    } else if (dontResume) {
                        surveyData.lastVisitedFragment = null;
                        surveyData.currentDynamicQuestionFragment = null;
                    }
                }
                // Update survey data in Storage (if not in readOnly mode) and reducer
                if (!readOnly) {
                    yield call(updateSurveyDataInStorage, surveyData);
                }
                yield put(Actions.setSurveyData(surveyData));
            }
            // Set template data in reducer
            yield put(Actions.setTemplateData(template));
            // Update render data in reducer
            yield call(updateRenderDataInReducer, fragmentToRender);
        } else {
            yield put(Actions.setErrorMessage('template_fragment_unavailable'));
            return;
        }
    } finally {
        if (surveyDataKey && !readOnly &&
            surveyDataLock.hasOwnProperty(surveyDataKey) &&
            surveyDataLock[surveyDataKey].acquired) {
            surveyDataLock[surveyDataKey].release();
            if (!surveyDataLock[surveyDataKey].acquired) {
                delete surveyDataLock[surveyDataKey];
            }
        }
    }
}

function* saveOrUpdateSurveyDatasRootNode({ templateId, templateTypeId, version, surveyor, surveyorId, serviceWorker, serviceWorkerId, organizationId, additionalInfo }) {
    let surveyData = {
        templateId,
        templateTypeId,
        version,
        surveyor,
        surveyorId,
        serviceWorker,
        serviceWorkerId,
        organizationId,
        surveyStartedAt: moment.utc().format(API_DATE_TIME_FORMAT),
        trackers: {},
        answers: {},
        dataSources: {},
        dynamicTemplate: {}
    };
    if (!_.isEmpty(additionalInfo)) {
        surveyData.additionalInfo = _.map(additionalInfo, (value, key) => ({ key, value }));
    }
    surveyData = yield call([SurveyDataRepository, 'save'], surveyData);
    return surveyData;
}

function* handlePreviousButton() {
    const surveyData = _.cloneDeep(yield select(getSurvey));
    const { trackers } = surveyData;
    const render = yield select(getRender);
    const renderFragment = yield select(getRenderFragment);
    // Update current dynamic question fragment if needed
    let previousDynamicQuestionFragment = _.findKey(trackers, (item) => (item.includes(renderFragment.id)));
    if (typeof surveyData.currentDynamicQuestionFragment === 'number') {
        // Cast previousDynamicQuestionFragment value from string to number if the value is not null or undefined
        previousDynamicQuestionFragment = previousDynamicQuestionFragment && parseInt(previousDynamicQuestionFragment, 10);
    }
    if (surveyData.currentDynamicQuestionFragment !== previousDynamicQuestionFragment) {
        surveyData.currentDynamicQuestionFragment = previousDynamicQuestionFragment;
    }
    // Find out which fragment comes before current fragment
    let previousFragmentToRender = render.prev;
    if (previousFragmentToRender === -1) {
        const fragmentsInTracker = trackers[previousDynamicQuestionFragment];
        const currentFragmentIndexInTracker = fragmentsInTracker.indexOf(renderFragment.id);
        if (currentFragmentIndexInTracker === 0) {
            previousFragmentToRender = previousDynamicQuestionFragment;
        } else {
            previousFragmentToRender = fragmentsInTracker[currentFragmentIndexInTracker - 1];
        }
    }
    if (previousFragmentToRender === undefined) {
        yield put(Actions.setInfoMessage('fragment_route_unavailable'));
        return;
    }
    surveyData.lastVisitedFragment = previousFragmentToRender;
    const { readOnly } = yield select(getInitializer);
    // Update survey data in Storage (if not in readOnly mode) and reducer
    if (!readOnly) {
        yield spawn(updateSurveyDataInStorage, surveyData);
    }
    yield put(Actions.setSurveyData(surveyData));
    // Update render data in reducer
    yield call(updateRenderDataInReducer, previousFragmentToRender);
}

function* handleNextButton(action) {
    const render = yield select(getRender);
    const { connectedQuestionsToShow, fragment, cloneFragment, questionsWithFilterCriteria, questionsHavingUiKeys } = render;
    const initializer = yield select(getInitializer);
    const { readOnly, customValidations, surveyFinishedAction = () => { } } = initializer;
    // Perform any custom validations if required
    if (!_.isEmpty(questionsHavingUiKeys) && !_.isEmpty(customValidations)) {
        let validationsPassed = true;
        for (const uiKey in customValidations) {
            const validator = customValidations[uiKey];
            const questionId = questionsHavingUiKeys[uiKey];
            if (questionId) {
                const result = yield call(validator, action.payload.data[questionId]);
                if (!result) {
                    validationsPassed = false;
                    return false;
                }
            }
        }
        if (!validationsPassed) {
            return;
        }
    }
    // Check if current fragment contains any question with cloneFragment
    if (cloneFragment) {
        yield call(generateDynamicTemplate, render, action.payload.data);
    }
    const surveyData = _.cloneDeep(yield select(getSurvey));
    const { dataSources, trackers, answers } = surveyData;
    const templateFragments = yield select(getTemplateFragments);
    const templateRoutes = yield select(getTemplateRoutes);
    let resetCompletedStatus = false;
    // Find out which fragment to render next
    let nextFragmentToRender = templateRoutes[fragment.id].next;
    const { linkToFragmentQuestion } = render;
    if (linkToFragmentQuestion) {
        let optionSelected = action.payload.data[linkToFragmentQuestion];
        if (optionSelected === undefined) {
            yield put(Actions.setInfoMessage('no_option_selected'));
            return;
        }
        if (typeof optionSelected === 'number') {
            optionSelected = optionSelected.toString();
        }
        nextFragmentToRender = templateRoutes[optionSelected];
        if (!nextFragmentToRender || nextFragmentToRender.next === undefined) {
            yield put(Actions.setInfoMessage('option_route_unavailable'));
            return;
        }
        nextFragmentToRender = nextFragmentToRender.next;
    } else {
        if (nextFragmentToRender === undefined) {
            yield put(Actions.setInfoMessage('fragment_route_unavailable'));
            return;
        }
    }
    // Remove stale answers if dynamic question's old answer is changed
    if (linkToFragmentQuestion && trackers.hasOwnProperty(fragment.id)) {
        const oldFragmentsInTracker = trackers[fragment.id];
        if (oldFragmentsInTracker.length && oldFragmentsInTracker[0] !== nextFragmentToRender) {
            resetCompletedStatus = true;
            removeStaleAnswers(fragment.id, dataSources, trackers, answers, templateFragments);
        }
    }
    // Set completed flag to true, survey finished time
    // and online status if this is the last fragment
    const processed = yield select(getProcessed);
    const queued = yield select(getQueued);
    if (nextFragmentToRender === 0) {
        surveyData.completed = true;
        surveyData.waitingForSync = true;
        if (!readOnly) {
            if (processed.includes(surveyData.id)) {
                yield put(Actions.unsetProcessed(surveyData.id));
            }
            if (!queued.includes(surveyData.id)) {
                yield put(Actions.addToQueue(surveyData.id));
            }
        }
        surveyData.surveyFinishedAt = moment.utc().format(API_DATE_TIME_FORMAT);
        const netInfo = yield call([NetInfo, 'fetch']);
        surveyData.online = netInfo.isInternetReachable;
        surveyData.lastVisitedFragment = null;
        surveyData.currentDynamicQuestionFragment = null;
    } else if (resetCompletedStatus) {
        if (surveyData.completed) {
            surveyData.completed = false;
            surveyData.waitingForSync = false;
            if (!readOnly) {
                if (queued.includes(surveyData.id)) {
                    yield put(Actions.removeFromQueue(surveyData.id));
                }
            }
        }
        if (surveyData.surveyFinishedAt) {
            surveyData.surveyFinishedAt = null;
        }
        if (surveyData.online) {
            surveyData.online = null;
        }
    }
    // Setup trackers
    if (linkToFragmentQuestion) {
        surveyData.currentDynamicQuestionFragment = fragment.id;
        if (!trackers.hasOwnProperty(fragment.id) && nextFragmentToRender) {
            trackers[fragment.id] = [nextFragmentToRender];
        }
    }
    else if (surveyData.currentDynamicQuestionFragment) {
        let fragmentsInTracker = trackers[surveyData.currentDynamicQuestionFragment];
        if (!fragmentsInTracker.includes(nextFragmentToRender)) {
            // Add nextFragmentToRender to fragmentsInTracker only if nextFragmentToRender != 0
            nextFragmentToRender && fragmentsInTracker.push(nextFragmentToRender);
        }
    }
    // Setup answers
    // First remove old answers if present and then merge with new ones
    removeAnswers(templateFragments, fragment.id, null, answers);
    const newAnswers = _.mapValues(action.payload.data, (value) => Array.isArray(value) ? _.compact(value) : value);
    _.merge(answers, newAnswers);
    // If current render data contains any questions with filterCriteria
    // then update the values of those questions in questionsHavingDependentQuestion
    // property
    if (questionsWithFilterCriteria) {
        let { questionsHavingDependentQuestion } = surveyData;
        if (!questionsHavingDependentQuestion) {
            questionsHavingDependentQuestion = {};
        }
        _.forOwn(questionsWithFilterCriteria, (value, key) => {
            const { parentQuestionId } = value;
            questionsHavingDependentQuestion[parentQuestionId] = answers[parentQuestionId];
        });
        surveyData.questionsHavingDependentQuestion = questionsHavingDependentQuestion;
    }
    // Update last visited fragment data
    if (nextFragmentToRender !== 0) {
        surveyData.lastVisitedFragment = nextFragmentToRender;
    }
    // Save the updated copy of connectedQuestionsToShow
    if (Array.isArray(connectedQuestionsToShow) && connectedQuestionsToShow.length) {
        surveyData.connectedQuestionsToShow = [...connectedQuestionsToShow];
    } else {
        surveyData.connectedQuestionsToShow = [];
    }
    // Handle any last fragment actions here
    if (nextFragmentToRender === 0) {
        if (surveyData.retainInactiveOptions) {
            surveyData.retainInactiveOptions = null;
        }
        // Update survey data in Storage (if not in readOnly mode)
        if (!readOnly) {
            yield call(updateSurveyDataInStorage, surveyData);
            yield call(surveyFinishedAction, surveyData);
            yield put(Actions.syncInprogressData());
        } else {
            yield call([SurveyDataRepository, 'deleteById'], surveyData.id, readOnly);
            yield call(surveyFinishedAction);
        }
        return;
    }
    // Update survey data in Storage (if not in readOnly mode) and reducer
    if (!readOnly) {
        yield spawn(updateSurveyDataInStorage, surveyData);
    }
    yield put(Actions.setSurveyData(surveyData));
    // Update render data in reducer
    yield call(updateRenderDataInReducer, nextFragmentToRender);
}

function* generateDynamicTemplate(render, values) {
    const initializer = yield select(getInitializer);
    const { templateTypeId } = initializer;
    const { cloneFragment: { parentFragmentId, loopQuestionId, cloneFragmentId } } = render;
    const numCopiesNeeded = values[loopQuestionId];
    if (isNaN(numCopiesNeeded) || numCopiesNeeded < 0) {
        return;
    }
    const surveyData = _.cloneDeep(yield select(getSurvey));
    let { dynamicTemplate } = surveyData;
    if (!dynamicTemplate) {
        dynamicTemplate = {};
    }
    if (!dynamicTemplate.hasOwnProperty(parentFragmentId)) {
        dynamicTemplate[parentFragmentId] = {};
    }
    const { routes = {}, fragments = [] } = dynamicTemplate[parentFragmentId];
    const numCopiesExisting = fragments.length;
    const difference = numCopiesNeeded - numCopiesExisting;
    if (difference === 0) {
        return;
    }
    let templates = yield call([Storage, 'getItem'], SURVEY_TEMPLATE_STORE_KEY);
    templates = JSON.parse(templates);
    let template = templates[templateTypeId][surveyData.version];
    const { fragments: templateFragments, routes: templateRoutes } = template;
    if (difference > 0) {
        const requiredKeys = ['id', 'titles[].id', 'titles[].questions[].id', 'titles[].questions[].isConnectedQuestion', 'titles[].questions[].options[].id', 'titles[].questions[].options[].hasConnectedQuestion', 'titles[].questions[].options[].dependantQuestionGid'];
        const cloneFragment = pickExtended(templateFragments.find(fragment => fragment.id === cloneFragmentId), requiredKeys);
        const newFragments = Array.from({ length: difference }, () => (_.cloneDeep(cloneFragment)));
        const connectedQuestionsMap = {};
        // Setup dynamic ids and connected questions map for the cloned fragments
        newFragments.forEach((fragment, index) => {
            fragment.id = uuidv4();
            connectedQuestionsMap[fragment.id] = {};
            const { titles = [] } = fragment;
            titles.forEach(title => {
                title.id = uuidv4();
                const { questions = [] } = title;
                questions.forEach(question => {
                    const questionId = uuidv4();
                    if (question.isConnectedQuestion) {
                        connectedQuestionsMap[fragment.id] = {
                            ...connectedQuestionsMap[fragment.id],
                            [question.id]: questionId
                        };
                    }
                    question.id = questionId;
                    const { options = [] } = question;
                    options.forEach(option => {
                        option.id = uuidv4();
                    });
                });
            });
        });
        for (let i = 0; i < newFragments.length; i++) {
            // Setup links in routes object
            let next, prev;
            if (i !== newFragments.length - 1) {
                next = newFragments[i + 1].id;
            }
            if (i !== 0) {
                prev = newFragments[i - 1].id;
            }
            routes[newFragments[i].id] = {
                next,
                prev
            };
            // Setup connected questions in routes object
            const { titles = [] } = newFragments[i];
            titles.forEach(title => {
                const { questions = [] } = title;
                questions.forEach(question => {
                    const { options = [] } = question;
                    options.forEach(option => {
                        if (option.hasConnectedQuestion) {
                            const { dependantQuestionGid = [] } = option;
                            const newDependantQuestionGid = dependantQuestionGid.map(item => {
                                return connectedQuestionsMap[newFragments[i].id][item];
                            });
                            option.dependantQuestionGid = newDependantQuestionGid;
                            routes[option.id] = {
                                connect: newDependantQuestionGid
                            }
                        }
                    });
                });
            });
        }
        let originalNext;
        if (numCopiesExisting === 0) {
            originalNext = templateRoutes[parentFragmentId].next;
            if (!routes.hasOwnProperty(parentFragmentId)) {
                routes[parentFragmentId] = {};
            }
            routes[parentFragmentId].next = newFragments[0].id;
            routes[newFragments[0].id].prev = parentFragmentId;
        } else {
            originalNext = routes[fragments[fragments.length - 1].id].next;
            routes[fragments[fragments.length - 1].id].next = newFragments[0].id;
            routes[newFragments[0].id].prev = fragments[fragments.length - 1].id;
        }
        routes[newFragments[newFragments.length - 1].id].next = originalNext;
        if (originalNext !== 0) {
            if (!routes.hasOwnProperty(originalNext)) {
                routes[originalNext] = {};
            }
            routes[originalNext].prev = newFragments[newFragments.length - 1].id;
        }
        fragments.push(...newFragments);
        dynamicTemplate[parentFragmentId] = {
            cloneFragmentId,
            routes,
            fragments
        };
    } else if (difference < 0) {
        const { answers, trackers } = surveyData;
        const numCopiesDeleted = Math.abs(difference);
        const deletedFragments = fragments.splice(fragments.length - numCopiesDeleted);
        deletedFragments.forEach(fragment => {
            const tracker = _.findKey(trackers, (item) => (item.includes(fragment.id)));
            if (tracker) {
                _.remove(trackers[tracker], (fragmentId) => fragmentId === fragment.id);
            }
            const { titles = [] } = fragment;
            titles.forEach(title => {
                const { questions = [] } = title;
                questions.forEach(question => {
                    delete answers[question.id];
                    const { options = [] } = question;
                    options.forEach(option => {
                        if (option.hasConnectedQuestion) {
                            delete routes[option.id];
                        }
                    });
                });
            });
        });
        if (numCopiesDeleted === numCopiesExisting) {
            delete dynamicTemplate[parentFragmentId];
        } else {
            const lastDeletedFragmentNextPointer = routes[deletedFragments[deletedFragments.length - 1].id].next;
            routes[fragments[fragments.length - 1].id].next = lastDeletedFragmentNextPointer;
            if (!routes.hasOwnProperty(lastDeletedFragmentNextPointer)) {
                routes[lastDeletedFragmentNextPointer] = {};
            }
            routes[lastDeletedFragmentNextPointer].prev = fragments[fragments.length - 1].id;
            deletedFragments.forEach(fragment => {
                delete routes[fragment.id];
            });
            dynamicTemplate[parentFragmentId] = {
                cloneFragmentId,
                routes,
                fragments
            }
        }
    }
    surveyData.dynamicTemplate = dynamicTemplate;
    yield call(mergeDynamicTemplate, template, dynamicTemplate);
    // Update survey data in Storage (if not in readOnly mode) and reducer
    const { readOnly } = yield select(getInitializer);
    if (!readOnly) {
        yield spawn(updateSurveyDataInStorage, surveyData);
    }
    yield put(Actions.setSurveyData(surveyData));
    yield put(Actions.setTemplateData(template));
}

function mergeDynamicTemplate(template, dynamicTemplate) {
    const { fragments: templateFragments, routes: templateRoutes } = template;
    _.forOwn(dynamicTemplate, (value, key) => {
        _.merge(templateRoutes, value.routes);
        const mergedFragments = [];
        const cloneFragment = templateFragments.find(fragment => fragment.id === value.cloneFragmentId);
        value.fragments.forEach((fragment, index) => {
            const mergedFragment = _.merge({}, cloneFragment, fragment);
            mergedFragment.label = `${mergedFragment.label} ${index + 1}`;
            mergedFragments.push(mergedFragment);
        });
        const fragmentsInsertionPoint = (_.findIndex(templateFragments, { 'id': key }) + 1);
        templateFragments.splice(fragmentsInsertionPoint, 0, ...mergedFragments);
    });
}

const pickExtended = (object, paths) => {
    return paths.reduce((result, path) => {
        if (path.includes("[].")) {
            const [collectionPath, itemPath] = path.split(/\[]\.(.+)/);
            const collection = _.get(object, collectionPath);
            if (!_.isArray(collection)) {
                return result;
            }
            const partialResult = {};
            _.set(
                partialResult,
                collectionPath,
                _.map(collection, item => pickExtended(item, [itemPath]))
            );
            return _.merge(result, partialResult);
        }
        return _.merge(result, _.pick(object, [path]));
    }, {});
};

function removeStaleAnswers(fragmentId, dataSources, trackers, answers, templateFragments) {
    let fragmentsInTracker = trackers[fragmentId] || [];
    for (let i = 0; i < fragmentsInTracker.length; i++) {
        let currentFragmentId = fragmentsInTracker[i];
        if (trackers.hasOwnProperty(currentFragmentId)) {
            removeStaleAnswers(fragmentsInTracker[i], dataSources, trackers, answers, templateFragments);
            delete trackers[currentFragmentId];
        }
        removeAnswers(templateFragments, currentFragmentId, dataSources, answers);
    }
    delete trackers[fragmentId];
}

function removeAnswers(templateFragments, fragmentId, dataSources, answers) {
    const currentFragment = templateFragments.find(fragment => fragment.id === fragmentId);
    if (currentFragment) {
        const { titles = [] } = currentFragment;
        titles.forEach(title => {
            const { questions = [] } = title;
            questions.forEach(question => {
                const { options } = question;
                if (!_.isEmpty(dataSources) && !_.isEmpty(options)) {
                    const option = _.head(options);
                    if (option.hasOwnProperty('dataSourceName')) {
                        delete dataSources[option.dataSourceName];
                    }
                }
                delete answers[question.id];
            });
        });
    }
}

function* updateRenderDataInReducer(fragmentId) {
    const developerOptions = yield select(getDeveloperOptions);
    const { fragments, routes, dynamicDatas } = yield select(getTemplate);
    const { readOnly } = yield select(getInitializer);
    const surveyData = _.cloneDeep(yield select(getSurvey)) || {};
    const { answers, connectedQuestionsToShow: existingConnectedQuestionsToShow, retainInactiveOptions } = surveyData;
    const previousAnswers = {};
    let { questionsHavingDependentQuestion } = surveyData;
    if (!questionsHavingDependentQuestion) {
        questionsHavingDependentQuestion = {};
    }
    let updateSurveyData = false;
    let optionsHavingNoNextRoutes;
    let optionsHavingConnectedQuestions;
    let questionsWithFilterCriteria;
    let questionsHavingUiKeys;
    let linkToFragmentQuestion;
    let hasMultipleLinkToFragmentQuestions = false;
    let validationSchema = {
        defaultQuestions: {},
        connectedQuestions: {}
    };
    let questionsRequiringRefs;
    let connectedQuestionsToShow;
    let yupExcludedQuestions;
    let cloneFragment;
    let hasMultipleCloneFragmentQuestions = false;
    const targetFragment = _.cloneDeep(fragments.find(fragment => fragment.id === fragmentId)) || {};
    // Check for any question having dynamicData property set to true
    const { titles = [] } = targetFragment;
    titles.forEach(title => {
        let { questions = [] } = title;
        questions.forEach(question => {
            let includePreviousAnswer = true;
            // If a question has dynamicData then update its type and options with data from templateDynamicDatas
            if (question.dynamicData) {
                const data = dynamicDatas[question.type];
                if (data) {
                    question.type = data.type;
                    question.options = data.options;
                    // Once updated, reset dynamicData flag
                    question.dynamicData = false;
                }
            }
            switch (question.type) {
                case QUESTION_TYPES.OPTION:
                case QUESTION_TYPES.DROPDOWN:
                case QUESTION_TYPES.SEARCHABLE_DROPDOWN:
                case QUESTION_TYPES.CHECKBOX:
                case QUESTION_TYPES.OPTION_WITH_ICON:
                    let { options = [], filterCriteria } = question;
                    // Primary filtering of options based on filterCriteria
                    if (filterCriteria && answers.hasOwnProperty(filterCriteria.questionId)) {
                        let parentValue = answers[filterCriteria.questionId];
                        if (typeof parentValue === 'number') {
                            parentValue = parentValue.toString();
                        }
                        options = _.filter(options, (option) => {
                            let childValue = option[filterCriteria.property];
                            if (Array.isArray(childValue)) {
                                childValue = childValue.map(item => item.toString());
                                return childValue.includes(parentValue);
                            }
                            if (typeof childValue === 'number') {
                                childValue = childValue.toString();
                            }
                            return childValue === parentValue;
                        });
                    }
                    // Secondary filtering of options based on active status
                    options = _.filter(options, (option) => {
                        if (!option.hasOwnProperty('active') || option.active) {
                            return true;
                        }
                        if (answers.hasOwnProperty(question.id) && answers[question.id] === option.id) {
                            if (!retainInactiveOptions) {
                                surveyData.retainInactiveOptions = true;
                                updateSurveyData = true;
                            }
                            return true;
                        }
                        if (retainInactiveOptions) {
                            return true;
                        }
                        return false;
                    });
                    question.options = options;
                    const optionsHavingConnectedQuestionsData = [];
                    const optionsHavingNoNextRoutesData = [];
                    options.forEach(option => {
                        if (option.hasConnectedQuestion) {
                            optionsHavingConnectedQuestionsData.push(option.id);
                        }
                        if (question.linkToFragment && routes[option.id] && routes[option.id].next === 0) {
                            optionsHavingNoNextRoutesData.push(option.id);
                        }
                    });
                    if (optionsHavingConnectedQuestionsData.length) {
                        if (optionsHavingConnectedQuestions === undefined) {
                            optionsHavingConnectedQuestions = {};
                        }
                        optionsHavingConnectedQuestions[question.id] = optionsHavingConnectedQuestionsData;
                    }
                    if (optionsHavingNoNextRoutesData.length) {
                        if (optionsHavingNoNextRoutes === undefined) {
                            optionsHavingNoNextRoutes = {};
                        }
                        optionsHavingNoNextRoutes[question.id] = optionsHavingNoNextRoutesData;
                    }
                    if (question.linkToFragment) {
                        if (linkToFragmentQuestion === undefined) {
                            linkToFragmentQuestion = question.id;
                        } else {
                            hasMultipleLinkToFragmentQuestions = true;
                        }
                    }
                    if (question.hasOwnProperty('filterCriteria')) {
                        const parentQuestionId = question['filterCriteria'].questionId;
                        if (questionsWithFilterCriteria === undefined) {
                            questionsWithFilterCriteria = {};
                        }
                        questionsWithFilterCriteria[question.id] = {
                            options,
                            parentQuestionId
                        };
                        const currentParentQuestionAnswer = answers[parentQuestionId];
                        const previousParentQuestionAnswer = questionsHavingDependentQuestion[parentQuestionId];
                        if (currentParentQuestionAnswer !== previousParentQuestionAnswer) {
                            includePreviousAnswer = false;
                        }
                    }
                    if (question.hasOwnProperty('hasDependentQuestion')) {
                        if (!questionsHavingDependentQuestion.hasOwnProperty(question.id)) {
                            questionsHavingDependentQuestion[question.id] = answers[question.id];
                            surveyData.questionsHavingDependentQuestion = questionsHavingDependentQuestion;
                            updateSurveyData = true;
                        }
                    }
                    break;
                case QUESTION_TYPES.QR_CODE:
                case QUESTION_TYPES.LOCATION:
                    // For now nothing needs to be done
                    break;
                case QUESTION_TYPES.TEXT:
                    if (!questionsRequiringRefs) {
                        questionsRequiringRefs = [];
                    }
                    questionsRequiringRefs.push(question.id);
                    if (question.cloneFragment) {
                        if (cloneFragment === undefined) {
                            cloneFragment = {
                                parentFragmentId: fragmentId,
                                loopQuestionId: question.id,
                                cloneFragmentId: question.cloneFragment
                            };
                        } else {
                            hasMultipleCloneFragmentQuestions = true;
                        }
                    }
                    break;
            }
            if (question.hasOwnProperty('key')) {
                if (questionsHavingUiKeys === undefined) {
                    questionsHavingUiKeys = {};
                }
                questionsHavingUiKeys[question.key] = question.id;
            }
            previousAnswers[question.id] = includePreviousAnswer ? answers[question.id] : undefined;
            if (developerOptions.validations) {

                const { validations = [] } = question;
                // Keep Yup excluded questions on a seperate object for now.
                // We will process them seperately later.
                if (YUP_EXCLUDED_QUESTION_TYPES.includes(question.type)) {
                    if (!yupExcludedQuestions) {
                        yupExcludedQuestions = {};
                    }
                    yupExcludedQuestions[question.id] = {
                        type: question.type,
                        isConnectedQuestion: question.isConnectedQuestion,
                        options: question.options,
                        validations
                    };
                } else {
                    let rules;
                    if (validations.length) {
                        rules = yup.string();
                    }
                    validations.forEach(validation => {
                        switch (validation.type) {
                            case VALIDATION_TYPES.IS_MANDATORY:
                                rules = rules.concat(yup
                                    .string()
                                    .required(validation.errorMsg));
                                break;
                            case VALIDATION_TYPES.IS_PHONE:
                                rules = rules.concat(yup
                                    .string()
                                    .matches(VALIDATION_RULES.PHONE_REG_EXP, validation.errorMsg));
                                break;
                            case VALIDATION_TYPES.IS_DIGIT:
                                rules = rules.concat(yup
                                    .string()
                                    .matches(VALIDATION_RULES.DIGIT_REG_EXP, validation.errorMsg));
                                break;
                            case VALIDATION_TYPES.IS_DECIMAL:
                                rules = rules.concat(yup
                                    .string()
                                    .matches(VALIDATION_RULES.DECIMAL_REG_EXP, validation.errorMsg));
                                break;
                            case VALIDATION_TYPES.IS_DIGIT_OR_DECIMAL:
                                rules = rules.concat(yup
                                    .string()
                                    .matches(VALIDATION_RULES.DIGIT_OR_DECIMAL_REG_EXP, validation.errorMsg));
                                break;
                            case VALIDATION_TYPES.IS_EMAIL:
                                rules = rules.concat(yup
                                    .string()
                                    .matches(VALIDATION_RULES.EMAIL_REG_EXP, validation.errorMsg));
                                break;
                            case VALIDATION_TYPES.EN_ONLY:
                                rules = rules.concat(yup
                                    .string()
                                    .matches(VALIDATION_RULES.EN_ONLY_REG_EXP, validation.errorMsg));
                                break;
                            case VALIDATION_TYPES.PARENT_EQUALS_CHILD_SUM:
                                const { includes = [] } = validation;
                                rules = rules.concat(yup
                                    .string()
                                    .test(
                                        'parentEqualsChildSum',
                                        validation.errorMsg,
                                        function () {
                                            let parentValue = this.parent[question.id];
                                            if (isNaN(parentValue)) {
                                                return false;
                                            }
                                            parentValue = parseFloat(parentValue, 10);
                                            let sumOfChildValues = 0;
                                            for (let i = 0; i < includes.length; i++) {
                                                if (isNaN(this.parent[includes[i]])) {
                                                    return false;
                                                }
                                                sumOfChildValues += parseFloat(this.parent[includes[i]], 10);
                                            }
                                            return parentValue === sumOfChildValues;
                                        }
                                    ));
                                break;
                        }
                    });
                    if (rules) {
                        if (question.isConnectedQuestion) {
                            validationSchema.connectedQuestions[question.id] = rules;
                        } else {
                            validationSchema.defaultQuestions[question.id] = rules;
                        }
                    }
                }
            }
        });
    });
    if (Array.isArray(existingConnectedQuestionsToShow) && existingConnectedQuestionsToShow.length) {
        connectedQuestionsToShow = [...existingConnectedQuestionsToShow];
    }

    const targetRoute = routes[targetFragment.id] || {};
    yield put(Actions.setRenderData({
        next: targetRoute.next,
        prev: targetRoute.prev,
        linkToFragmentQuestion,
        hasMultipleLinkToFragmentQuestions,
        optionsHavingNoNextRoutes,
        optionsHavingConnectedQuestions,
        questionsRequiringRefs,
        connectedQuestionsToShow,
        readOnly,
        fragment: targetFragment,
        previousAnswers,
        validationSchema,
        yupExcludedQuestions,
        cloneFragment,
        hasMultipleCloneFragmentQuestions,
        questionsWithFilterCriteria,
        questionsHavingUiKeys
    }));
    if (updateSurveyData) {
        // Update survey data in Storage (if not in readOnly mode) and reducer
        if (!readOnly) {
            yield spawn(updateSurveyDataInStorage, surveyData);
        }
        yield put(Actions.setSurveyData(surveyData));
    }
}

function* processConnectedQuestions(action) {
    const render = _.cloneDeep(yield select(getRender));
    const templateRoutes = yield select(getTemplateRoutes);
    const { question, value, values, setFieldValue, setFieldTouched } = action.payload.data;
    const { connectedQuestionsToShow = [], optionsHavingConnectedQuestions, fragment } = render;
    const connectedQuestionsToRemove = removeConnectedQuestion(question, values, optionsHavingConnectedQuestions, templateRoutes);
    connectedQuestionsToRemove.forEach(connectedQuestion => {
        setFieldTouched(connectedQuestion, false);
        setFieldValue(connectedQuestion, undefined);
    });
    setFieldValue(question, value);
    // If current option has connected questions find them and add
    let connectedQuestionsToAdd = [];
    let conflictingConnectedQuestions = [];
    if (optionsHavingConnectedQuestions[question].includes(value)) {
        if (!templateRoutes.hasOwnProperty(value)) {
            yield call(errorToast, I18n.t('connected_questions_missing'), 2000);
            return;
        }
        connectedQuestionsToAdd = templateRoutes[value].connect;
        connectedQuestionsToAdd.forEach(connectedQuestion => {
            if (connectedQuestionsToShow.includes(connectedQuestion)) {
                conflictingConnectedQuestions.push(connectedQuestion);
            } else {
                connectedQuestionsToShow.push(connectedQuestion);
            }
        });
    }
    const difference = _.difference(connectedQuestionsToShow, connectedQuestionsToRemove);
    difference.push(...conflictingConnectedQuestions);
    connectedQuestionsToShow.push(...conflictingConnectedQuestions);
    _.remove(connectedQuestionsToRemove, (value) => {
        return conflictingConnectedQuestions.includes(value);
    });
    const { titles = [] } = fragment;
    titles.some(title => {
        const { questions = [] } = title;
        let connectedQuestionsStartIndex = -1;
        let connectedQuestionSegments = _.remove(questions, (question, index) => {
            if (question.isConnectedQuestion &&
                (connectedQuestionsToAdd.includes(question.id) ||
                    connectedQuestionsToRemove.includes(question.id))) {
                if (connectedQuestionsStartIndex === -1) {
                    connectedQuestionsStartIndex = index;
                }
                return true;
            }
        });
        if (connectedQuestionsStartIndex !== -1) {
            const partitions = _.partition(connectedQuestionSegments, (question) => difference.includes(question.id));
            connectedQuestionSegments = _.concat(...partitions);
            questions.splice(connectedQuestionsStartIndex, 0, ...connectedQuestionSegments);
            return true;
        }
        return false;
    });
    yield put(Actions.updateConnectedQuestionsToShow({
        connectedQuestionsToShow: connectedQuestionsToShow.length ? connectedQuestionsToShow : undefined,
        connectedQuestionsToRemove: connectedQuestionsToRemove.length ? connectedQuestionsToRemove : undefined,
        fragment,
        scrollToTop: false
    }));
}

function removeConnectedQuestion(question, values, optionsHavingConnectedQuestions, templateRoutes) {
    const connectedQuestionsToRemove = [];
    if (templateRoutes.hasOwnProperty(values[question])) {
        const connectedQuestions = templateRoutes[values[question]].connect;
        connectedQuestions.forEach(connectedQuestion => {
            connectedQuestionsToRemove.push(connectedQuestion);
            if (optionsHavingConnectedQuestions.hasOwnProperty(connectedQuestion)) {
                connectedQuestionsToRemove.push(...removeConnectedQuestion(connectedQuestion, values, optionsHavingConnectedQuestions, templateRoutes));
            }
        });
    }
    return connectedQuestionsToRemove;
}

function* updateSurveyDataInStorage(surveyData, readOnly) {
    yield call([SurveyDataRepository, 'save'], surveyData, readOnly);
}

function* loadIncompleteSurveys(action) {
    const data = [];
    const { templateTypeId, uiKeys, setIncompleteSurveys } = action.payload.data;
    const items = yield call([SurveyDataRepository, 'findByTemplateTypeIdAndSynced'],
        templateTypeId, false, { descriptor: 'surveyStartedAt', reverse: true });
    if (items) {
        let templates = yield call([Storage, 'getItem'], SURVEY_TEMPLATE_STORE_KEY);
        templates = templates ? JSON.parse(templates) : {};
        for (const surveyData of items) {
            data.push(getListView(surveyData, uiKeys, templates));
        }
    }
    yield delay(10);
    yield put(setIncompleteSurveys(data));
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.customerEnrollment = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

async function transformSurveyDataInApiFormatToListView(surveyData, uiKeys) {
    let templates = await Storage.getItem(SURVEY_TEMPLATE_STORE_KEY);
    templates = templates ? JSON.parse(templates) : {};
    return getListView(surveyData, uiKeys, templates);
}

function getListView(surveyData, uiKeys, templates) {
    const filteredQuestions = [];
    const template = templates[surveyData.templateTypeId][surveyData.version];
    const fragments = template.fragments;
    const dynamicDatas = template.dynamicDatas;
    const { answers } = surveyData;
    fragments.forEach(fragment => {
        const { titles = [] } = fragment;
        titles.forEach(title => {
            const { questions = [] } = title;
            questions.forEach(question => {
                if (question.hasOwnProperty('key') && uiKeys.includes(question.key)) {
                    const filteredQuestion = _.cloneDeep(question);
                    if (answers.hasOwnProperty(filteredQuestion.id)) {
                        if (filteredQuestion.dynamicData) {
                            const dynamicData = dynamicDatas[filteredQuestion.type];
                            if (dynamicData) {
                                filteredQuestion.type = dynamicData.type;
                                filteredQuestion.options = dynamicData.options;
                                filteredQuestion.dynamicData = false;
                            }
                        }
                        filteredQuestions.push(filteredQuestion);
                    }
                }
            });
        });
    });
    const listView = {};
    listView.id = surveyData.id;
    listView.completed = surveyData.completed;
    listView.details = getListViewDetails(answers, filteredQuestions);
    return listView;
}

function getListViewDetails(answers, filteredQuestions) {
    const details = [];
    filteredQuestions.forEach(filteredQuestion => {
        const question = filteredQuestion;
        const item = {};
        item.id = filteredQuestion.id;
        item.key = filteredQuestion.key;
        item.type = question.type;
        item.label = question.shortLabel;
        const answer = answers[question.id];
        item.value = answer;
        const { options = [] } = question;
        switch (item.type) {
            case QUESTION_TYPES.CHECKBOX:
                const pairs = [];
                options.forEach(option => {
                    if (answer.includes(option.id)) {
                        pairs.push({
                            id: option.id,
                            name: option.name
                        });
                    }
                });
                item.value = pairs;
                break;
            case QUESTION_TYPES.OPTION:
            case QUESTION_TYPES.OPTION_WITH_ICON:
            case QUESTION_TYPES.DROPDOWN:
            case QUESTION_TYPES.SEARCHABLE_DROPDOWN:
                const pair = {};
                options.some(option => {
                    if (answer === option.id) {
                        pair.id = option.id;
                        pair.name = option.name;
                    }
                });
                item.value = pair;
                break;
        }
        details.push(item);
    });
    return details;
}

function* removeInprogressData(action) {
    const { templateTypeId, surveyId, setSurveysToBeDeleted } = action.payload.data;
    if (surveyId) {
        yield call([SurveyDataRepository, 'deleteById'], surveyId);
        setSurveysToBeDeleted && (yield put(setSurveysToBeDeleted(surveyId)));
        return;
    }
    const surveysToBeDeleted = yield call([SurveyDataRepository, 'deleteByTemplateTypeIdAndCompleted'], templateTypeId, false);
    setSurveysToBeDeleted && (yield put(setSurveysToBeDeleted(surveysToBeDeleted)));
}

function* syncInprogressData() {
    yield call([syncInprogressDataLock, 'acquireAsync']);
    try {
        const netInfo = yield call([NetInfo, 'fetch']);
        if (!netInfo.isInternetReachable) {
            return;
        }
        const items = yield call([SurveyDataRepository, 'findByWaitingForSync'], true, { descriptor: 'templateTypeId' });
        if (!_.isEmpty(items)) {
            const queued = yield select(getQueued);
            const failed = yield select(getFailed);
            for (const surveyData of items) {
                yield put(Actions.updateProgress({ [surveyData.id]: 0 }));
                if (queued.includes(surveyData.id)) {
                    yield put(Actions.removeFromQueue(surveyData.id));
                }
                if (failed.includes(surveyData.id)) {
                    yield put(Actions.unsetFailed(surveyData.id));
                }
                const { surveyorId, organizationId } = surveyData;
                yield fork(saga.handleAPIRequest, DfgAPI.syncInProgressSurvey, {
                    userId: surveyorId,
                    orgId: organizationId,
                    surveyData,
                    uploadMonitor: (surveyId, progress) => {
                        store.dispatch(Actions.updateProgress({
                            [surveyId]: progress
                        }));
                    }
                });
                const surveyDataSyncApiAction = yield take([ActionTypes.SYNC_INPROGRESS_SURVEY_API_SUCCESS, ActionTypes.SYNC_INPROGRESS_SURVEY_API_FAILED]);
                if (surveyDataSyncApiAction.type === ActionTypes.SYNC_INPROGRESS_SURVEY_API_SUCCESS) {
                    const surveyDataSyncApiResponse = surveyDataSyncApiAction.payload.data;
                    yield call([SurveyDataRepository, 'save'], surveyDataSyncApiResponse);
                    const { additionalInfo } = surveyDataSyncApiResponse;
                    const serviceExecution = _.find(additionalInfo, ['key', 'serviceExecutionId']);
                    const complaintExecution = _.find(additionalInfo, ['key', 'complaintId']);
                    if (serviceExecution) {
                        const customerEnrollment = _.find(additionalInfo, ['key', 'customerEnrollmentId']);
                        yield put(Actions.setServiceExecuted({
                            customerEnrollmentId: customerEnrollment.value,
                            serviceExecutionId: serviceExecution.value
                        }));
                    }
                    if (complaintExecution) {
                        const customerEnrollment = _.find(additionalInfo, ['key', 'customerEnrollmentId']);
                        yield put(Actions.setComplaintExecuted({
                            customerEnrollmentId: customerEnrollment.value,
                            complaintId: complaintExecution.value
                        }));
                    }
                    yield put(Actions.setProcessed(surveyData.id));
                } else if (surveyDataSyncApiAction.type === ActionTypes.SYNC_INPROGRESS_SURVEY_API_FAILED) {
                    yield put(Actions.setFailed(surveyData.id));
                }
                yield put(Actions.removeProgress(surveyData.id));
                yield delay(1000);
            }
        }
    } catch {
        // NOOP
        console.tron.logImportant({ error });
    } finally {
        yield call([syncInprogressDataLock, 'release']);
    }
}

function* loadCompletedSurveys(action) {
    const initializer = yield select(getInitializer);
    const { templateTypeIds, moduleId, uiKeys } = initializer;
    const { reset, filter } = action.payload.data;
    if (reset) {
        yield put(Actions.resetCompletedSurveysPage());
    }
    const userInfo = yield select(getUserInfo);
    const { id: userId } = userInfo;
    const defaultOrganization = getDefaultOrganization(userInfo);
    if (!defaultOrganization) {
        yield call(errorToast, I18n.t('organizations_unavailable'));
        return;
    }
    const completedSureys = yield select(getCompletedSurveys);
    const newPage = completedSureys.page + 1;
    const loadCompletedSurveyRequest = {
        templateTypeIds,
        moduleId,
        langId: (yield select(getLanguage)).langId,
        organizationIds: [defaultOrganization.id],
        userId,
        page: newPage,
        size: 10,
        uiKeys,
        type: 'card'
    }
    if (filter) {
        loadCompletedSurveyRequest.filter = true;
        const filters = (yield select(getCompletedSurveys)).filters || {};
        Object.entries(filters).forEach(([key, value]) => {
            loadCompletedSurveyRequest[key] = value.map(searchText => Buffer.from(searchText).toString('base64'));
        });
    }
    yield call(saga.handleAPIRequest, DfgAPI.fetchCompleteSurveyList, { surveyCompleteListData: loadCompletedSurveyRequest });
}

function* fetchCompletedSurveyFilterDropDownData(action) {
    const initializer = yield select(getInitializer);
    const { templateTypeIds } = initializer;
    const { key, value } = action.payload.data;
    const params = {
        templateTypeIds,
        type: 'filterDropdownData',
        searchKey: key,
        searchValue: value
    }
    yield fork(saga.handleAPIRequest, DfgAPI.fetchFilterDropDownData, params);
    const fetchFilterDropDownDataApiAction = yield take([ActionTypes.FETCH_FILTER_DROPDOWN_DATA_API_SUCCESS, ActionTypes.FETCH_FILTER_DROPDOWN_DATA_API_FAILED]);
    if (fetchFilterDropDownDataApiAction.type === ActionTypes.FETCH_FILTER_DROPDOWN_DATA_API_SUCCESS) {
        const filterDropDownData = getPayloadData(fetchFilterDropDownDataApiAction.payload.data);
        yield put(Actions.setCompletedSurveysFilterDropDownData({ [key]: filterDropDownData }))
    }
}

function* editSyncedSurvey(action) {
    const {
        templateTypeId, surveyId, forceTemplateUpdate,
        modalStateProp, modalStateSelector, toogleModalVisibility, setSurveyDataFetchMessage
    } = action.payload.data;
    yield put(toogleModalVisibility(true));
    const surveyDataApiRequest = {
        langId: (yield select(getLanguage)).langId,
        type: 'edit',
        templateTypeIds: [templateTypeId],
        surveyIds: [surveyId]
    }
    yield fork(saga.handleAPIRequest, DfgAPI.fetchSurveyData, surveyDataApiRequest);
    const surveyDataApiAction = yield take([ActionTypes.SURVEY_DATA_API_SUCCESS, ActionTypes.SURVEY_DATA_API_FAILED]);
    if (surveyDataApiAction.type === ActionTypes.SURVEY_DATA_API_SUCCESS) {
        const surveyData = getPayloadData(surveyDataApiAction.payload.data)[0];
        if (surveyData === undefined) {
            yield put(toogleModalVisibility(false));
            yield put(setSurveyDataFetchMessage('survey_data_download_failed'));
            return false;
        }
        let templates = yield call([Storage, 'getItem'], SURVEY_TEMPLATE_STORE_KEY);
        templates = templates ? JSON.parse(templates) : {};
        if (forceTemplateUpdate) {
            const surveyTemplateApiRequest = {
                answerId: surveyData.id,
                langId: (yield select(getLanguage)).langId
            };
            yield fork(saga.handleAPIRequest, DfgAPI.fetchSurveyTemplateForAnswer, surveyTemplateApiRequest);
            const surveyTemplateApiAction = yield take([ActionTypes.SURVEY_TEMPLATE_API_SUCCESS, ActionTypes.SURVEY_TEMPLATE_API_FAILED]);
            if (surveyTemplateApiAction.type === ActionTypes.SURVEY_TEMPLATE_API_SUCCESS) {
                const surveyTemplateApiResponse = getPayloadData(surveyTemplateApiAction.payload.data);
                if (surveyTemplateApiResponse.version !== surveyData.version) {
                    yield put(toogleModalVisibility(false));
                    yield put(setSurveyDataFetchMessage('invalid_template_version'));
                    return false;
                }
                templates[templateTypeId][surveyTemplateApiResponse.version] = surveyTemplateApiResponse;
                yield call([Storage, 'setItem'], SURVEY_TEMPLATE_STORE_KEY, JSON.stringify(templates));
            } else if (surveyTemplateApiAction.type === ActionTypes.SURVEY_TEMPLATE_API_FAILED) {
                yield put(toogleModalVisibility(false));
                yield put(setSurveyDataFetchMessage('survey_data_download_failed'));
                return false;
            }
        }
        // Check if user has cancelled the operation, if so no need to proceed further
        if (modalStateProp && modalStateSelector) {
            const modalVisible = (yield select(modalStateSelector))[modalStateProp];
            if (!modalVisible) {
                return false;
            }
        }
        // Start post-processing of survey data
        yield call(postProcessSurveyData, surveyData, true);
        yield put(toogleModalVisibility(false));
        return true;
    } else if (surveyDataApiAction.type === ActionTypes.SURVEY_DATA_API_FAILED) {
        yield put(toogleModalVisibility(false));
        yield put(setSurveyDataFetchMessage('survey_data_download_failed'));
    }
    return false;
}

function* postProcessSurveyData(surveyData, readOnly) {
    const processedSurveyData = _.cloneDeep(surveyData);
    delete processedSurveyData.lastVisitedFragment;
    delete processedSurveyData.currentDynamicQuestionFragment;
    processedSurveyData.completed = false;
    yield call(updateSurveyDataInStorage, processedSurveyData, readOnly);
}

function* setDataSource(action) {
    const surveyData = yield select(getSurvey);
    surveyData.dataSources = {
        ...surveyData.dataSources,
        ...action.payload.data
    }
    // Update survey data in Storage (if not in readOnly mode) and reducer
    const { readOnly } = yield select(getInitializer);
    if (!readOnly) {
        yield spawn(updateSurveyDataInStorage, surveyData);
    }
    yield put(Actions.setSurveyData(surveyData));
}

function* isSurveyDataPresentInStorage({ templateTypeId, additionalInfo = [] }) {
    const surveyData = yield call([SurveyDataRepository, 'findByTemplateTypeIdAndAdditionalInfo'], templateTypeId, additionalInfo);
    if (surveyData) {
        return { surveyId: surveyData.id, completed: surveyData.completed };
    }
    return {};
}

function* setFinishSurveyBtn() {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.finishSurveyBtn = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));

}

export default function* dfgSaga() {
    yield all([
        takeLatest(ActionTypes.FETCH_SURVEY_TEMPLATES, handleFetchSurveyTemplates),
        takeLatest(ActionTypes.START_SURVEY, handleStartSurvey),
        takeLatest(ActionTypes.NEXT_BUTTON, handleNextButton),
        takeLatest(ActionTypes.PREVIOUS_BUTTON, handlePreviousButton),
        takeLatest(ActionTypes.PROCESS_CONNECTED_QUESTIONS, processConnectedQuestions),
        takeLatest(ActionTypes.SET_DATASOURCE, setDataSource),
        takeEvery(ActionTypes.SYNC_INPROGRESS_DATA, syncInprogressData),
        takeLatest(ActionTypes.LOAD_COMPLETED_SURVEYS, loadCompletedSurveys),
        takeLatest(ActionTypes.FETCH_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA, fetchCompletedSurveyFilterDropDownData),
        takeLatest(ActionTypes.SET_FINISH_SURVEY_BTN, setFinishSurveyBtn)
    ]);
}

export {
    handleFetchSurveyTemplates,
    loadIncompleteSurveys, removeInprogressData,
    editSyncedSurvey, postProcessSurveyData,
    isSurveyDataPresentInStorage, transformSurveyDataInApiFormatToListView
};
