import { types as ActionTypes } from './actions';

const initialState = {
    scheduleList: {
        confirmationModalVisibility: false,
        schedules: {
            data: [],
            refreshing: false
        }
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_CANCEL_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                scheduleList: {
                    confirmationModalVisibility: action.payload.data
                }
            });
        case ActionTypes.FETCH_SCHEDULES_REQUEST:
            return Object.assign({}, state, {
                scheduleList: {
                    schedules: {
                        data: [],
                        refreshing: true
                    }
                }
            });
        case ActionTypes.FETCH_SCHEDULES_SUCCESS:
            return Object.assign({}, state, {
                scheduleList: {
                    ...state.scheduleList,
                    schedules: {
                        data: action.payload.data,
                        refreshing: false
                    } 
                }
            });
        case ActionTypes.FETCH_SCHEDULES_FAILED:
            return Object.assign({}, state, {
                scheduleList: {
                    schedules: {
                        data: [],
                        refreshing: false
                    } 
                }
            });
        default:
            return state;
    }
};