import { types } from './actions';

const initialState = {
    setSupport: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_SUPPORT_DATA:
            return Object.assign({}, state, {
                setSupport: action.payload.data
            });
        default:
            return state;
    }
};