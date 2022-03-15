import { types as ActionTypes } from './actions';

const initialState = {

};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LANGUAGE_SELECT:
            return Object.assign({}, state, {
                ...action.payload.data.language
            });
        default:
            return state;
    }
};
