import { types as ActionTypes } from './actions';

const initialState = {
    showGrantPermissionsModal: false,
    showAllowBlockedPermissionsModal: false,
    recheckPermissions: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_GRANT_PERMISSIONS_MODAL:
            return Object.assign({}, state, {
                showGrantPermissionsModal: action.payload.data
            });
        case ActionTypes.SHOW_ALLOW_BLOCKED_PERMISSIONS_MODAL:
            return Object.assign({}, state, {
                showAllowBlockedPermissionsModal: action.payload.data
            });
        case ActionTypes.RECHECK_PERMISSIONS:
            return Object.assign({}, state, {
                recheckPermissions: action.payload.data
            });
        default:
            return state;
    }
};
