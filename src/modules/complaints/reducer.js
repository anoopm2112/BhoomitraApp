import { types as ActionTypes } from './actions';
import { types as ServiceActionTypes } from '../service/actions';

const initialState = {
    incompleteComplaints: {
        refreshing: true,
        data: undefined
    },
    doneComplaints: {
        refreshing: true,
        data: undefined,
        complaintDoneList: undefined
    },
    newComplaint: {
        image: undefined
    },
    complaints: {
        data: [],
        refreshing: false,
        schedule: [],
        enableSchedule: false
    },
    allComplaints: {
        data: [],
        refreshing: false,
    },
    photos: {},
    icons: {},
    complaintItemList: {
        showResumeModal: false,
        position: undefined,
        configs: {
            initDone: false,
            complaintExecutionSurveyDataMap: {}
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ServiceActionTypes.LOAD_INCOMPLETE_SERVICES:
            return Object.assign({}, state, {
                incompleteComplaints: {
                    ...state.incompleteComplaints,
                    refreshing: true
                }
            });
        case ActionTypes.SET_INCOMPLETE_COMPLAINTS:
            return Object.assign({}, state, {
                incompleteComplaints: {
                    refreshing: false,
                    data: action.payload.data || []
                }
            });
        case ActionTypes.LOAD_DONE_COMPLAINTS:
            return Object.assign({}, state, {
                doneComplaints: {
                    ...state.doneComplaints,
                    refreshing: true
                }
            });
        case ActionTypes.SET_DONE_COMPLAINTS:
            return Object.assign({}, state, {
                doneComplaints: {
                    refreshing: false,
                    data: action.payload.data || [],
                    complaintDoneList: action.payload.complaintDoneList || []
                }
            });
        case ActionTypes.NEW_COMPLAINT_IMAGE:
            return Object.assign({}, state, {
                newComplaint: {
                    image: action.payload.data
                }
            });
        case ActionTypes.DELETE_COMPLAINT_IMAGE:
            return Object.assign({}, state, {
                newComplaint: {
                    image: undefined
                }
            });
        case ActionTypes.FETCH_COMPLAINTS_REQUEST:
            return Object.assign({}, state, {
                complaints: {
                    refreshing: true,
                    enableSchedule: false
                }
            });
        case ActionTypes.FETCH_COMPLAINTS_SUCCESS:
            return Object.assign({}, state, {
                complaints: {
                    data: action.payload.data,
                    refreshing: false,
                    enableSchedule: false
                }
            });
        case ActionTypes.FETCH_COMPLAINTS_FAILED:
            return Object.assign({}, state, {
                complaints: {
                    refreshing: false,
                    enableSchedule: false
                }
            });
        case ActionTypes.SCHEDULE:
            return Object.assign({}, state, {
                complaints: {
                    ...state.complaints,
                    schedule: [],
                    enableSchedule: false
                }
            });
        case ActionTypes.SCHEDULE_REQUEST:
            return Object.assign({}, state, {
                complaints: {
                    ...state.complaints,
                    enableSchedule: false
                }
            });
        case ActionTypes.SCHEDULE_SUCCESS:
            return Object.assign({}, state, {
                complaints: {
                    ...state.complaints,
                    schedule: action.payload.data,
                    enableSchedule: true
                }
            });
        case ActionTypes.SCHEDULE_FAILED:
            return Object.assign({}, state, {
                complaints: {
                    ...state.complaints,
                    schedule: [],
                    enableSchedule: false
                }
            });
        case ActionTypes.ADD_COMPLAINT_SUCCESS:
            return Object.assign({}, state, {
                newComplaint: {
                    image: undefined
                }
            });
        case ActionTypes.GET_ALL_COMPLAINTS_REQUEST:
            return Object.assign({}, state, {
                allComplaints: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_ALL_COMPLAINTS_SUCCESS:
            return Object.assign({}, state, {
                allComplaints: {
                    data: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_ALL_COMPLAINTS_FAILED:
            return Object.assign({}, state, {
                allComplaints: {
                    refreshing: false
                }
            });
        case ActionTypes.SET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP:
            return Object.assign({}, state, {
                complaintItemList: {
                    ...state.complaintItemList,
                    configs: action.payload.data
                }
            });
        case ActionTypes.RESET_COMPLAINT_EXECUTION_SURVEY_DATA_MAP:
            return Object.assign({}, state, {
                complaintItemList: {
                    ...state.complaintItemList,
                    configs: initialState.complaintItemList.configs
                }
            });
        case ServiceActionTypes.SERVICE_INCOMPLETE_API_SUCCESS:
        case ServiceActionTypes.SERVICE_INCOMPLETE_API_FAILED:
            return Object.assign({}, state, {
                incompleteComplaints: {
                    ...state.incompleteComplaints,
                    refreshing: false
                }
            });
        case ActionTypes.SET_COMPLAINTING_RESUME_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                complaintItemList: {
                    ...state.complaintItemList,
                    showResumeModal: action.payload.data
                }
            });
        case ServiceActionTypes.SET_SERVICE_LOCATION:
            return Object.assign({}, state, {
                complaintItemList: {
                    ...state.complaintItemList,
                    position: action.payload.data
                }
            });
        case ServiceActionTypes.RESET_SERVICE_LOCATION:
            return Object.assign({}, state, {
                complaintItemList: {
                    ...state.complaintItemList,
                    position: initialState.complaintItemList.position
                }
            });
        case ActionTypes.SET_COMPLAINT_ICONS:
            return Object.assign({}, state, {
                icons: action.payload.data
            });
        case ActionTypes.SET_COMPLAINT_PHOTOS:
            return Object.assign({}, state, {
                photos: {
                    ...state.photos,
                    ...action.payload.data
                }
            });
        case ActionTypes.RESET_COMPLAINT_PHOTOS:
            return Object.assign({}, state, {
                photos: initialState.photos
            });
        default:
            return state;
    }
};