import moment from 'moment';
import _ from 'lodash';
import { types as ActionTypes } from './actions';
import { actions as CommonActions } from '../../common';
import { formatPermission } from '../../common/utils/permissionUtil';

export const initialState = {
  authData: {},
  info: {},
  login: {
    isAuthenticating: false
  },
  forgotPassword: {
    requestInProgress: false
  },
  otpVerify: {
    shouldResend: false,
    requestedAt: undefined,
    progress: 0,
    requestInProgress: false
  },
  resetPassword: {
    requestInProgress: false
  },
  updatePassword: {
    requestInProgress: false
  },
  updateProfile: {
    requestInProgress: false
  },
  userRoles: {},
  encryptionKey: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_REQUEST:
    case ActionTypes.FETCH_USER_INFO_REQUEST:
      return Object.assign({}, state, {
        login: {
          isAuthenticating: true
        }
      });
    case ActionTypes.AUTH_SUCCESS:
    case CommonActions.types.REFRESH_TOKEN_API_SUCCESS:
      return Object.assign({}, state, {
        authData: {
          ...action.payload.data
        },
      });
    case ActionTypes.FETCH_USER_INFO_SUCCESS:
    case ActionTypes.UPDATE_QRCODE_REGEX:
      return Object.assign({}, state, {
        login: {
          isAuthenticating: false
        },
        info: {
          ...action.payload.data
        },
        userRoles: formatPermission(_.get(action.payload.data, 'roles', []))
      });
    case ActionTypes.AUTH_FAILED:
    case ActionTypes.FETCH_USER_INFO_FAILED:
      return Object.assign({}, state, {
        login: {
          isAuthenticating: false
        }
      });
    case ActionTypes.OTP_API_REQUEST:
      return Object.assign({}, state, {
        forgotPassword: {
          requestInProgress: true
        }
      });
    case ActionTypes.OTP_API_SUCCESS:
    case ActionTypes.OTP_RESEND_API_SUCCESS:
      return Object.assign({}, state, {
        forgotPassword: {
          requestInProgress: false
        },
        otpVerify: {
          ...state.otpVerify,
          shouldResend: false,
          requestedAt: moment(),
          progress: 0
        }
      });
    case ActionTypes.OTP_API_FAILED:
      return Object.assign({}, state, {
        forgotPassword: {
          requestInProgress: false
        }
      });
    case ActionTypes.OTP_VERIFY_API_REQUEST:
      return Object.assign({}, state, {
        otpVerify: {
          ...state.otpVerify,
          requestInProgress: true
        }
      });
    case ActionTypes.OTP_VERIFY_API_SUCCESS:
      return Object.assign({}, state, {
        otpVerify: {
          ...state.otpVerify,
          requestInProgress: false
        }
      });
    case ActionTypes.OTP_VERIFY_API_FAILED:
      return Object.assign({}, state, {
        otpVerify: {
          ...state.otpVerify,
          requestInProgress: false
        }
      });
    case ActionTypes.UPDATE_RESEND_OTP_BUTTON_STATE:
      return Object.assign({}, state, {
        otpVerify: {
          ...state.otpVerify,
          ...action.payload.data
        }
      });
    case ActionTypes.RESET_PASSWORD_API_REQUEST:
      return Object.assign({}, state, {
        resetPassword: {
          requestInProgress: true
        }
      });
    case ActionTypes.RESET_PASSWORD_API_SUCCESS:
      return Object.assign({}, state, {
        resetPassword: {
          requestInProgress: false
        }
      });
    case ActionTypes.RESET_PASSWORD_API_FAILED:
      return Object.assign({}, state, {
        resetPassword: {
          requestInProgress: false
        }
      });
    case ActionTypes.UPDATE_PASSWORD_API_REQUEST:
      return Object.assign({}, state, {
        updatePassword: {
          requestInProgress: true
        }
      });
    case ActionTypes.UPDATE_PASSWORD_API_SUCCESS:
      return Object.assign({}, state, {
        updatePassword: {
          requestInProgress: false
        }
      });
    case ActionTypes.UPDATE_PASSWORD_API_FAILED:
      return Object.assign({}, state, {
        updatePassword: {
          requestInProgress: false
        }
      });
    case ActionTypes.UPDATE_PROFILE_API_REQUEST:
      return Object.assign({}, state, {
        updateProfile: {
          requestInProgress: true
        }
      });
    case ActionTypes.UPDATE_PROFILE_API_SUCCESS:
    case ActionTypes.UPDATE_PROFILE_API_FAILED:
      return Object.assign({}, state, {
        updateProfile: {
          requestInProgress: false
        }
      });
    case ActionTypes.UPDATED_PROFILE:
      return Object.assign({}, state, {
        info: {
          ...action.payload.data
        }
      });
    case ActionTypes.SET_ENCRYPTION_KEY:
      return Object.assign({}, state, {
        encryptionKey: action.payload.data
      });
    default:
      return state;
  }
};
