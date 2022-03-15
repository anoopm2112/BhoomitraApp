import { types as ActionTypes } from './actions';

const initialState = {
    lsgiType: {
        type: [],
        refreshing: false
    },
    lsgiName: {
        name: [],
        refreshing: false
    },
    mcfRrfName: {
        mcfRrf: [],
        refreshing: false
    },
    goDownsName: {
        goDowns: [],
        refreshing: false
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_CKC_LSGI_TYPE_API_REQUEST:
            return Object.assign({}, state, {
                lsgiType: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_CKC_LSGI_TYPE_API_SUCCESS:
            return Object.assign({}, state, {
                lsgiType: {
                    type: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_CKC_LSGI_TYPE_API_FAILED:
            return Object.assign({}, state, {
                lsgiType: {
                    refreshing: false
                }
            });
        case ActionTypes.GET_CKC_LSGI_NAME_API_REQUEST:
            return Object.assign({}, state, {
                lsgiName: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_CKC_LSGI_NAME_API_SUCCESS:
            return Object.assign({}, state, {
                lsgiName: {
                    name: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_CKC_LSGI_NAME_API_FAILED:
            return Object.assign({}, state, {
                lsgiName: {
                    refreshing: false
                }
            });
        case ActionTypes.GET_CKC_MCF_RRF_NAME_API_REQUEST:
            return Object.assign({}, state, {
                mcfRrfName: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_CKC_MCF_RRF_NAME_API_SUCCESS:
            return Object.assign({}, state, {
                mcfRrfName: {
                    mcfRrf: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_CKC_MCF_RRF_NAME_API_FAILED:
            return Object.assign({}, state, {
                mcfRrfName: {
                    refreshing: false
                }
            });
        case ActionTypes.GET_CKC_GO_DOWN_API_REQUEST:
            return Object.assign({}, state, {
                goDownsName: {
                    refreshing: true
                }
            });
        case ActionTypes.GET_CKC_GO_DOWN_API_SUCCESS:
            return Object.assign({}, state, {
                goDownsName: {
                    goDowns: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.GET_CKC_GO_DOWN_API_FAILED:
            return Object.assign({}, state, {
                goDownsName: {
                    refreshing: false
                }
            });
        case ActionTypes.RESET_LSGI_NAME:
            return Object.assign({}, state, {
                lsgiName: {
                    name: [],
                    refreshing: false
                },
            });
        case ActionTypes.RESET_MCF_RRF_NAME:
            return Object.assign({}, state, {
                mcfRrfName: {
                    mcfRrf: [],
                    refreshing: false
                },
            });
        default:
            return state;
    }
};
