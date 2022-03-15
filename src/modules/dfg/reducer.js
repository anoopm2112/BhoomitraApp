import _ from 'lodash';
import { types as ActionTypes } from './actions';
import { LIST_VIEW_KEYS } from '../enrollment/constants';

const filterDropDownData = {};
Object.keys(LIST_VIEW_KEYS).forEach(key => {
    filterDropDownData[key] = [];
});

const initialState = {
    initializer: undefined,
    surveyTemplateFetchStatus: {
        message: undefined,
        updateInProgress: false
    },
    surveyDataPeriodicSyncId: undefined,
    template: undefined,
    survey: undefined,
    render: {
        next: undefined,
        prev: undefined,
        scrollToTop: true,
        linkToFragmentQuestion: undefined,
        hasMultipleLinkToFragmentQuestions: false,
        optionsHavingNoNextRoutes: undefined,
        optionsHavingConnectedQuestions: undefined,
        questionsRequiringRefs: undefined,
        connectedQuestionsToShow: undefined,
        connectedQuestionsToRemove: undefined,
        infoMessage: undefined,
        errorMessage: undefined,
        readOnly: undefined,
        fragment: undefined,
        cloneFragment: undefined,
        hasMultipleCloneFragmentQuestions: false,
        previousAnswers: {},
        validationSchema: {
            defaultQuestions: {},
            connectedQuestions: {}
        },
        yupExcludedQuestions: undefined,
        questionsWithFilterCriteria: undefined,
        questionsHavingUiKeys: undefined
    },
    queued: [],
    progress: {},
    failed: [],
    processed: [],
    completedSurveys: {
        refreshing: true,
        page: -1,
        data: [],
        showDownloadingSurveyDataModal: false,
        infoMessage: undefined,
        showFilterModal: false,
        filterDropDownData,
        filters: {},
        filterDropdownRefresh: [],
        startServiceEnrollmentDataModal: false,
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.INITIALIZE_DYNAMIC_FORM:
        case ActionTypes.INITIALIZE_SURVEY_DONE:
            return Object.assign({}, state, {
                initializer: {
                    ...action.payload.data
                }
            });
        case ActionTypes.SET_SURVEY_TEMPLATE_MESSAGE:
            return Object.assign({}, state, {
                surveyTemplateFetchStatus: {
                    ...state.surveyTemplateFetchStatus,
                    message: action.payload.data
                }
            });
        case ActionTypes.SET_SURVEY_DATA_PERIODIC_SYNC_ID:
            return Object.assign({}, state, {
                surveyDataPeriodicSyncId: action.payload.data
            });
        case ActionTypes.TOGGLE_SURVEY_TEMPLATE_UPDATE_IN_PROGRESS:
            return Object.assign({}, state, {
                surveyTemplateFetchStatus: {
                    ...state.surveyTemplateFetchStatus,
                    updateInProgress: action.payload.data
                }
            });
        case ActionTypes.RESET_SURVEY:
            return Object.assign({}, state, {
                initializer: initialState.initializer,
                template: initialState.template,
                survey: initialState.survey,
                render: initialState.render
            });
        case ActionTypes.SET_TEMPLATE_DATA:
            return Object.assign({}, state, {
                template: {
                    ...action.payload.data
                }
            });
        case ActionTypes.SET_SURVEY_DATA:
            return Object.assign({}, state, {
                survey: {
                    ...action.payload.data
                }
            });
        case ActionTypes.SET_RENDER_DATA:
            return Object.assign({}, state, {
                render: {
                    ...initialState.render,
                    ...action.payload.data
                }
            });
        case ActionTypes.UPDATE_CONNECTED_QUESTIONS_TO_SHOW:
            return Object.assign({}, state, {
                render: {
                    ...state.render,
                    ...action.payload.data
                }
            });
        case ActionTypes.CLEAR_CONNECTED_QUESTIONS_TO_SHOW:
            let connectedQuestionsToShow = _.difference(state.render.connectedQuestionsToShow,
                state.render.connectedQuestionsToRemove);
            return Object.assign({}, state, {
                render: {
                    ...state.render,
                    connectedQuestionsToShow,
                    connectedQuestionsToRemove: undefined
                }
            });
        case ActionTypes.SET_INFO_MESSAGE:
            return Object.assign({}, state, {
                render: {
                    ...state.render,
                    infoMessage: action.payload.data
                }
            });
        case ActionTypes.SET_ERROR_MESSAGE:
            return Object.assign({}, state, {
                render: {
                    ...state.render,
                    errorMessage: action.payload.data
                }
            });
        case ActionTypes.CLEAR_MESSAGES:
            return Object.assign({}, state, {
                render: {
                    ...state.render,
                    infoMessage: state.render.infoMessage ? initialState.render.infoMessage : state.render.infoMessage,
                    errorMessage: state.render.errorMessage ? initialState.render.errorMessage : state.render.errorMessage
                }
            });
        case ActionTypes.ADD_TO_QUEUE:
            const addedQueue = [...state.queued, action.payload.data];
            return Object.assign({}, state, {
                queued: addedQueue
            });
        case ActionTypes.REMOVE_FROM_QUEUE:
            const removedQueue = state.queued.filter(surveyId => surveyId !== action.payload.data);
            return Object.assign({}, state, {
                queued: removedQueue
            });
        case ActionTypes.UPDATE_PROGRESS:
            return Object.assign({}, state, {
                progress: {
                    ...state.progress,
                    ...action.payload.data
                }
            });
        case ActionTypes.REMOVE_PROGRESS:
            const progress = _.cloneDeep(state.progress);
            if (progress.hasOwnProperty(action.payload.data)) {
                delete progress[action.payload.data];
            }
            return Object.assign({}, state, {
                progress
            });
        case ActionTypes.SET_FAILED:
            const setFailed = [...state.failed, action.payload.data];
            return Object.assign({}, state, {
                failed: setFailed
            });
        case ActionTypes.UNSET_FAILED:
            const unsetFailed = state.failed.filter(surveyId => surveyId !== action.payload.data);
            return Object.assign({}, state, {
                failed: unsetFailed
            });
        case ActionTypes.SET_PROCESSED:
            const setProcessed = [...state.processed, action.payload.data];
            return Object.assign({}, state, {
                processed: setProcessed
            });
        case ActionTypes.UNSET_PROCESSED:
            const unsetProcessed = state.processed.filter(surveyId => surveyId !== action.payload.data);
            return Object.assign({}, state, {
                processed: unsetProcessed
            });
        case ActionTypes.LOAD_COMPLETE_SURVEY_LIST_API_REQUEST:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    refreshing: true
                }
            });
        case ActionTypes.LOAD_COMPLETE_SURVEY_LIST_API_SUCCESS:
            const newPage = state.completedSurveys.page + 1;
            const completedSurveysData = [];
            if (newPage > 0 && state.completedSurveys.data.length) {
                completedSurveysData.push(...state.completedSurveys.data);
            }
            completedSurveysData.push(...action.payload.data);
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    refreshing: false,
                    page: newPage,
                    data: completedSurveysData
                }
            });
        case ActionTypes.LOAD_COMPLETE_SURVEY_LIST_API_FAILED:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    refreshing: false
                }
            });
        case ActionTypes.RESET_COMPLETED_SURVEYS_PAGE:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    page: initialState.completedSurveys.page
                }
            });
        case ActionTypes.TOGGLE_DOWNLOADING_SURVEY_DATA_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    showDownloadingSurveyDataModal: action.payload.data
                }
            });
        case ActionTypes.SET_SURVEY_DATA_FETCH_MESSAGE:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    infoMessage: action.payload.data
                }
            });
        case ActionTypes.CLEAR_SURVEY_DATA_FETCH_MESSAGE:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    infoMessage: initialState.completedSurveys.infoMessage
                }
            });
        case ActionTypes.FILTER_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    showFilterModal: action.payload.data
                }
            });
        case ActionTypes.SET_COMPLETED_SURVEY_FILTER:
            let filters = { ...state.completedSurveys.filters };
            let currentFilter = action.payload.data;
            let searchKey = Object.keys(currentFilter)[0];
            let searchTexts = currentFilter[searchKey];
            if (_.isEmpty(searchTexts)) {
                delete filters[searchKey];
            } else {
                filters[searchKey] = searchTexts;
            }
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    filters
                }
            });
        case ActionTypes.SET_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    filterDropDownData: {
                        ...state.completedSurveys.filterDropDownData,
                        ...action.payload.data,
                    },
                    filterDropdownRefresh: _.filter(state.completedSurveys.filterDropdownRefresh, (item) => item !== Object.keys(action.payload.data)[0])
                }
            });
        case ActionTypes.CLEAR_COMPLETED_SURVEY_FILTER:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    filters: {},
                    filterDropDownData: filterDropDownData
                }
            });
        case ActionTypes.FETCH_COMPLETED_SURVEY_FILTER_DROPDOWN_DATA:
            let filterDropdownRefresh = state.completedSurveys.filterDropdownRefresh;
            if (!filterDropdownRefresh.includes(action.payload.data.key)) {
                filterDropdownRefresh = [...filterDropdownRefresh]
                filterDropdownRefresh.push(action.payload.data.key);
            }
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    filterDropdownRefresh
                }
            });
        case ActionTypes.TOGGLE_START_SERVICE_ENROLLMENT_DATA_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                completedSurveys: {
                    ...state.completedSurveys,
                    startServiceEnrollmentDataModal: action.payload.data
                }
            });
        case ActionTypes.RESET_COMPLETED_SURVEY:
            return Object.assign({}, state, {
                completedSurveys: initialState.completedSurveys
            });
        case ActionTypes.SURVEY_TEMPLATE_API_REQUEST:
            return Object.assign({}, state, {
                surveyTemplateFetchStatus: {
                    ...state.surveyTemplateFetchStatus,
                    updateInProgress: true
                }
            });
        case ActionTypes.SURVEY_TEMPLATE_API_SUCCESS:
            return Object.assign({}, state, {
                surveyTemplateFetchStatus: {
                    ...state.surveyTemplateFetchStatus,
                    updateInProgress: false
                }
            });
        case ActionTypes.SURVEY_TEMPLATE_API_FAILED:
            return Object.assign({}, state, {
                surveyTemplateFetchStatus: {
                    ...state.surveyTemplateFetchStatus,
                    updateInProgress: false
                }
            });
        default:
            return state;
    }
};
