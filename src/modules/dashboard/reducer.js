import { actions as CommonActions } from '../../common';
const { types: CommonActionsTypes } = CommonActions;
import { types as ActionTypes } from './actions';

const initialState = {
    count: {
        surveyTotal: 0,
        servicePending: 0,
        complaintPending: 0
    },
    sideBar: {
        currentRoute: undefined,
        logoutModal: {
            enabled: false,
            message: undefined
        }
    },
    qrcode: {
        initializer: {
            params: undefined,
            scanFinishedAction: undefined
        }
    },
    notification: {
        refreshing: true,
        data: []
    },
    qus_UI_key: {
        data: undefined
    },
    playstoreAppData: {
        data: undefined,
        updateApp: false
    },
    needsUpdate: false,
    tourData: {},
    qrScannerModal: true,
    drawerStatus: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CommonActionsTypes.ROUTE_CHANGED:
            return Object.assign({}, state, {
                sideBar: {
                    ...state.sideBar,
                    currentRoute: action.payload.name
                }
            });
        case ActionTypes.INITIALIZE_QRCODE_SCANNER:
            return Object.assign({}, state, {
                qrcode: {
                    initializer: action.payload.data
                }
            });
        case ActionTypes.LOAD_NOTIFICATION:
            return Object.assign({}, state, {
                notification: {
                    ...state.notification,
                    refreshing: true
                }
            });
        case ActionTypes.SET_NOTIFICATION:
            return Object.assign({}, state, {
                notification: {
                    refreshing: false,
                    data: action.payload.data || []
                }
            });
        case ActionTypes.TOGGLE_LOGOUT_MODAL:
            return Object.assign({}, state, {
                sideBar: {
                    ...state.sideBar,
                    logoutModal: action.payload.data
                }
            });
        case ActionTypes.LOAD_QUS_UI_KEY:
            return Object.assign({}, state, {
                qus_UI_key: {
                    ...state.qus_UI_key
                }
            });
        case ActionTypes.SET_QUS_UI_KEY:
            return Object.assign({}, state, {
                qus_UI_key: {
                    data: action.payload.data || []
                }
            });
        case ActionTypes.UPDATE_COUNT:
            return Object.assign({}, state, {
                count: {
                    ...state.count,
                    ...action.payload.data
                }
            });
        case ActionTypes.NOTIFICATION_API_FAILED:
            return Object.assign({}, state, {
                notification: {
                    refreshing: false,
                    data: []
                }
            });
        case ActionTypes.SET_PLAYSTORE_APP_VERSION_DATA:
            return Object.assign({}, state, {
                playstoreAppData: {
                    updateApp: action.payload.data
                }
            });
        case ActionTypes.CHECK_APP_UPDATE:
            return Object.assign({}, state, {
                needsUpdate: action.payload.data
            });
        case ActionTypes.SET_APP_TOUR_DATA:
            return Object.assign({}, state, {
                tourData: action.payload.data
            });
        case ActionTypes.SET_SCAN_QR_CODE_MODAL:
            return Object.assign({}, state, {
                qrScannerModal: false
            });
        case ActionTypes.DRAWER_STATUS:
            return Object.assign({}, state, {
                drawerStatus: action.payload.data
            });
        default:
            return state;
    }
};
