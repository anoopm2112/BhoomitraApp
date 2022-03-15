import { types as ActionTypes } from './actions';

const initialState = {
    tourData: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_APP_TOUR_DATA:
            return Object.assign({}, state, {
                tourData: action.payload.data
            });
        default:
            return state;
    }
};
