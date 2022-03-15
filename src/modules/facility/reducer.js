import { types as ActionTypes } from './actions';

const initialState = {
    nearestMcf: undefined
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_MCF_API_REQUEST:
            return Object.assign({}, state, {
                nearestMcf: undefined
            });
        case ActionTypes.FETCH_MCF_API_FAILED:
            return Object.assign({}, state, {
                nearestMcf: undefined
            });
        case ActionTypes.FETCH_MCF_API_SUCCESS:
            return Object.assign({}, state, {
                nearestMcf:  action.payload.data
            });
        default:
            return state;
    }
};