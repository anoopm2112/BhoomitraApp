import _ from 'lodash';
import { types as ActionTypes } from './actions';

const initialState = {
    incompleteSurveys: {
        refreshing: true,
        data: undefined,
        showResumeModal: false,
        progress: {},
        surveysToBeDeleted: []
    },
    pendingQrCodeSurveys: {
        refreshing: true,
        data: undefined
    },
    subscription: {
        enrollmentSubscription: {
            data: [],
            refreshing: false
        },
        enrollmentSubscribed: {
            data: [],
            refreshing: false
        },
    },
    enrollmentInProgressAnimationStatus: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_INCOMPLETE_SURVEYS:
            return Object.assign({}, state, {
                incompleteSurveys: {
                    ...state.incompleteSurveys,
                    refreshing: true
                }
            });
        case ActionTypes.SET_INCOMPLETE_SURVEYS:
            return Object.assign({}, state, {
                incompleteSurveys: {
                    ...state.incompleteSurveys,
                    refreshing: false,
                    data: action.payload.data || []
                }
            });
        case ActionTypes.SET_RESUME_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                incompleteSurveys: {
                    ...state.incompleteSurveys,
                    showResumeModal: action.payload.data
                }
            });
        case ActionTypes.LOAD_PENDING_QR_CODE_SURVEYS:
            return Object.assign({}, state, {
                pendingQrCodeSurveys: {
                    ...state.pendingQrCodeSurveys,
                    refreshing: true
                }
            });
        case ActionTypes.SET_PENDING_QR_CODE_SURVEYS:
            return Object.assign({}, state, {
                pendingQrCodeSurveys: {
                    ...state.pendingQrCodeSurveys,
                    refreshing: false,
                    data: action.payload.data || []
                }
            });
        case ActionTypes.CLEAR_PENDING_QR_CODE_SURVEYS:
            const clearedPendingQrCodeSurveys = action.payload.data;
            return Object.assign({}, state, {
                pendingQrCodeSurveys: {
                    ...state.pendingQrCodeSurveys,
                    data: state.pendingQrCodeSurveys.data.filter(item => !clearedPendingQrCodeSurveys.includes(item.customerEnrollmentId))
                }
            });


        case ActionTypes.SET_SURVEYS_TO_BE_DELETED:
            let surveysToBeDeleted = [...state.incompleteSurveys.surveysToBeDeleted];
            if (Array.isArray(action.payload.data)) {
                surveysToBeDeleted.push(...action.payload.data);
            } else {
                surveysToBeDeleted.push(action.payload.data);
            }
            return Object.assign({}, state, {
                incompleteSurveys: {
                    ...state.incompleteSurveys,
                    surveysToBeDeleted
                }
            });
        case ActionTypes.CLEAR_SURVEYS_TO_BE_DELETED:
            let incompleteSurveysData = _.cloneDeep(state.incompleteSurveys.data);
            _.remove(incompleteSurveysData, (item) => action.payload.data.includes(item.id));
            return Object.assign({}, state, {
                incompleteSurveys: {
                    ...state.incompleteSurveys,
                    data: incompleteSurveysData,
                    surveysToBeDeleted: _.difference(state.incompleteSurveys.surveysToBeDeleted, action.payload.data),
                    progress: _.pickBy(state.incompleteSurveys.progress, (value, key) => !action.payload.data.includes(key))
                }
            });
        case ActionTypes.FETCH_ENROLLMET_SUBSCRIPTIONS_API_REQUEST:
            return Object.assign({}, state, {
                subscription: {
                    ...state.subscription,
                    enrollmentSubscription: {
                        data: [],
                        refreshing: true
                    }
                }
            });
        case ActionTypes.FETCH_ENROLLMET_SUBSCRIPTIONS_API_FAILED:
            return Object.assign({}, state, {
                subscription: {
                    ...state.subscription,
                    enrollmentSubscription: {
                        data: [],
                        refreshing: false
                    }
                }
            });
        case ActionTypes.FETCH_ENROLLMET_SUBSCRIPTIONS_API_SUCCESS:
            return Object.assign({}, state, {
                subscription: {
                    ...state.subscription,
                    enrollmentSubscription: {
                        data: action.payload.data,
                        refreshing: false
                    }
                }
            });
        case ActionTypes.FETCH_ENROLLMET_SUBSCRIBED_API_REQUEST:
            return Object.assign({}, state, {
                subscription: {
                    ...state.subscription,
                    enrollmentSubscribed: {
                        data: [],
                        refreshing: true
                    }
                }
            });
        case ActionTypes.FETCH_ENROLLMET_SUBSCRIBED_API_FAILED:
            return Object.assign({}, state, {
                subscription: {
                    ...state.subscription,
                    enrollmentSubscribed: {
                        data: [],
                        refreshing: false
                    }
                }
            });
        case ActionTypes.FETCH_ENROLLMET_SUBSCRIBED_API_SUCCESS:
            return Object.assign({}, state, {
                subscription: {
                    ...state.subscription,
                    enrollmentSubscribed: {
                        data: action.payload.data,
                        refreshing: false
                    }
                }
            });
        case ActionTypes.ENROLLMENT_INPROGRESS_ANIMATION_STATUS:
            return Object.assign({}, state, {
                enrollmentInProgressAnimationStatus: action.payload.data
            });
        default:
            return state;
    }
};
