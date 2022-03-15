import { types } from './actions';
import { types as ActionTypes } from './actions';

const initialState = {
    baseImage: undefined
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_IMAGE:
            return Object.assign({}, state, {
                baseImage: action.payload.data
            });
        case types.DELETE_REPORT_IMAGE:
            return Object.assign({}, state, {
                baseImage: undefined
            });
        default:
            return state;
    }
};