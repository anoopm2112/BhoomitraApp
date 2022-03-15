import { types as ActionTypes } from './actions';

const initialState = {
    incidentReportList: {
        data: [],
        refreshing: false
    },
    incidentReportData: {
        data: [],
        refreshing: false
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_INCIDENTREPORT_LIST_API_REQUEST:
            return Object.assign({}, state, {
                incidentReportList: {
                    refreshing: true
                }
            });
        case ActionTypes.FETCH_INCIDENTREPORT_LIST_API_SUCCESS:
            return Object.assign({}, state, {
                incidentReportList: {
                    data: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_INCIDENTREPORT_LIST_API_FAILED:
            return Object.assign({}, state, {
                incidentReportList: {
                    refreshing: false
                }
            });
            case ActionTypes.FETCH_INCIDENTREPORT_API_REQUEST:
            return Object.assign({}, state, {
                incidentReportData: {
                    refreshing: true
                }
            });
        case ActionTypes.FETCH_INCIDENTREPORT_API_SUCCESS:
            return Object.assign({}, state, {
                incidentReportData: {
                    data: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_INCIDENTREPORT_API_FAILED:
            return Object.assign({}, state, {
                incidentReportData: {
                    refreshing: false
                }
            });
        default:
            return state;
    }
}