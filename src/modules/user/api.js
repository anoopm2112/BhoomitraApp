import { api, constants } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

const { AUTH_SERVER_ENDPOINT, CLIENT_ID } = constants;

export function authenticate({ username, password }) {
    let payload = {
        body: { grant_type: 'password', username, password, client_id: CLIENT_ID, scope: 'offline_access' },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        types: [ActionTypes.AUTH_REQUEST, ActionTypes.AUTH_SUCCESS, ActionTypes.AUTH_FAILED],
        isAuthCall: true
    };
    return {
        endpoint: AUTH_SERVER_ENDPOINT,
        api: restAPI.post,
        payload,
    };
}

export function getUserInfo() {
    let payload = {
        types: [ActionTypes.FETCH_USER_INFO_REQUEST, ActionTypes.FETCH_USER_INFO_SUCCESS, ActionTypes.FETCH_USER_INFO_FAILED]
    };
    return {
        endpoint: 'user/profile',
        api: restAPI.get,
        payload,
    };
}

export function logout() {
    let payload = {
        types: [ActionTypes.LOGOUT_API_REQUEST, ActionTypes.LOGOUT_API_SUCCESS, ActionTypes.LOGOUT_API_FAILED],
    };
    return {
        endpoint: 'user/logout',
        api: restAPI.get,
        payload,
    };
}

export function sendOrResendOtp({ mobile, isResend }) {
    let successAction = isResend ? ActionTypes.OTP_RESEND_API_SUCCESS : ActionTypes.OTP_API_SUCCESS;
    let payload = {
        params: { mobile },
        types: [ActionTypes.OTP_API_REQUEST, successAction, ActionTypes.OTP_API_FAILED]
    };
    let endpoint = isResend ? 'user/otp/resend' : 'user/otp';
    return {
        endpoint,
        api: restAPI.get,
        payload
    };
}

export function verifyOtp({ mobile, otp }) {
    let payload = {
        params: { mobile, otp },
        types: [ActionTypes.OTP_VERIFY_API_REQUEST, ActionTypes.OTP_VERIFY_API_SUCCESS, ActionTypes.OTP_VERIFY_API_FAILED]
    };
    return {
        endpoint: 'user/otp/verify',
        api: restAPI.get,
        payload
    };
}

export function resetPassword({ password, requestId }) {
    let payload = {
        body: {
            password,
            requestId
        },
        types: [ActionTypes.RESET_PASSWORD_API_REQUEST, ActionTypes.RESET_PASSWORD_API_SUCCESS, ActionTypes.RESET_PASSWORD_API_FAILED]
    };
    return {
        endpoint: 'user/reset-password',
        api: restAPI.put,
        payload
    };
}

export function updatePassword({ id, oldPassword, newPassword }) {
    let payload = {
        body: { oldPassword, password: newPassword },
        types: [ActionTypes.UPDATE_PASSWORD_API_REQUEST, ActionTypes.UPDATE_PASSWORD_API_SUCCESS, ActionTypes.UPDATE_PASSWORD_API_FAILED]
    };
    return {
        endpoint: `user/profile/password`,
        api: restAPI.put,
        payload
    };
}

export function updateProfile({ id, username, firstName, middleName, lastName, userTypeId }) {
    let payload = {
        body: {
            username,
            firstName,
            middleName,
            lastName,
            userTypeId
        },
        types: [ActionTypes.UPDATE_PROFILE_API_REQUEST, ActionTypes.UPDATE_PROFILE_API_SUCCESS, ActionTypes.UPDATE_PROFILE_API_FAILED]
    };
    return {
        endpoint: `user/users/${id}`,
        api: restAPI.put,
        payload
    };
}