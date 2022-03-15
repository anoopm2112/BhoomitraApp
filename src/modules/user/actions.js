import { actions, MODULE_ROUTE_KEYS } from '../../common';
import { ROUTE_KEYS as USER_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate, navigateWithReset } } = actions;

export const types = {
    AUTHENTICATE: 'User/AUTHENTICATE',
    AUTH_REQUEST: 'User/AUTH_REQUEST',
    AUTH_SUCCESS: 'User/AUTH_SUCCESS',
    AUTH_FAILED: 'User/AUTH_FAILED',
    FETCH_USER_INFO_REQUEST: 'User/FETCH_USER_INFO_REQUEST',
    FETCH_USER_INFO_SUCCESS: 'User/FETCH_USER_INFO_SUCCESS',
    FETCH_USER_INFO_FAILED: 'User/FETCH_USER_INFO_FAILED',
    LOGOUT_API_REQUEST: 'User/LOGOUT_API_REQUEST',
    LOGOUT_API_SUCCESS: 'User/LOGOUT_API_SUCCESS',
    LOGOUT_API_FAILED: 'User/LOGOUT_API_FAILED',
    DO_LOGOUT: 'User/DO_LOGOUT',
    DONT_LOGOUT: 'User/DONT_LOGOUT',
    SEND_OTP: 'User/SEND_OTP',
    RESEND_OTP: 'User/RESEND_OTP',
    UPDATE_RESEND_OTP_BUTTON_STATE: 'User/UPDATE_RESEND_OTP_BUTTON_STATE',
    OTP_API_REQUEST: 'User/OTP_API_REQUEST',
    OTP_API_SUCCESS: 'User/OTP_API_SUCCESS',
    OTP_RESEND_API_SUCCESS: 'User/OTP_RESEND_API_SUCCESS',
    OTP_API_FAILED: 'User/OTP_API_FAILED',
    VERIFY_OTP: 'User/VERIFY_OTP',
    OTP_VERIFY_API_REQUEST: 'User/OTP_VERIFY_API_REQUEST',
    OTP_VERIFY_API_SUCCESS: 'User/OTP_VERIFY_API_SUCCESS',
    OTP_VERIFY_API_FAILED: 'User/OTP_VERIFY_API_FAILED',
    RESET_PASSWORD: 'User/ResetPassword',
    RESET_PASSWORD_API_REQUEST: 'User/RESET_PASSWORD_API_REQUEST',
    RESET_PASSWORD_API_SUCCESS: 'User/RESET_PASSWORD_API_SUCCESS',
    RESET_PASSWORD_API_FAILED: 'User/RESET_PASSWORD_API_FAILED',
    UPDATE_PASSWORD: 'User/UPDATE_PASSWORD',
    UPDATE_PASSWORD_API_REQUEST: 'User/UPDATE_PASSWORD_API_REQUEST',
    UPDATE_PASSWORD_API_SUCCESS: 'User/UPDATE_PASSWORD_API_SUCCESS',
    UPDATE_PASSWORD_API_FAILED: 'User/UPDATE_PASSWORD_API_FAILED',
    UPDATE_PROFILE: 'User/UPDATE_PROFILE',
    UPDATE_PROFILE_API_REQUEST: 'User/UPDATE_PROFILE_API_REQUEST',
    UPDATE_PROFILE_API_SUCCESS: 'User/UPDATE_PROFILE_API_SUCCESS',
    UPDATE_PROFILE_API_FAILED: 'User/UPDATE_PROFILE_API_FAILED',
    UPDATED_PROFILE: 'User/UPDATED_PROFILE',
    UPDATE_QRCODE_REGEX: 'User/UPDATE_QRCODE_REGEX',
    PREPARE_ENCRYPTION_KEY: 'User/PREPARE_ENCRYPTION_KEY',
    SET_ENCRYPTION_KEY: 'User/SET_ENCRYPTION_KEY',
    AUTO_UPDATE: 'User/AUTO_UPDATE'
};

export function navigateToLogin() {
    return navigateWithReset(MODULE_ROUTE_KEYS.USER, { screen: USER_ROUTE_KEYS.LOGIN_FORM });
}

export function navigateToForgotPassword() {
    return navigate(USER_ROUTE_KEYS.FORGOT_PASSWORD);
}

export function navigateToOtpVerification(data) {
    return navigate(USER_ROUTE_KEYS.OTP_VERIFICATION, { data });
}

export function navigateToResetPassword(data) {
    return navigate(USER_ROUTE_KEYS.RESET_PASSWORD, { data });
}

export function navigateToDashboard() {
    return navigateWithReset(MODULE_ROUTE_KEYS.DASHBOARD);
}

export function navigateToMyProfile() {
    return navigate(MODULE_ROUTE_KEYS.USER, { screen: USER_ROUTE_KEYS.MY_PROFILE });
}

export function navigateToEditProfile() {
    return navigate(USER_ROUTE_KEYS.EDIT_PROFILE);
}

export function navigateToPassCode(data) {
    return navigateWithReset(MODULE_ROUTE_KEYS.USER, { screen: USER_ROUTE_KEYS.PASSCODE, params: { data } });
}

export function sendOtp(data) {
    return action(types.SEND_OTP, { data });
}

export function resendOtp(data) {
    return action(types.RESEND_OTP, { data });
}

export function doLogout() {
    return action(types.DO_LOGOUT);
}

export function dontLogout() {
    return action(types.DONT_LOGOUT);
}

export function updateResendOtpButtonState(data) {
    return action(types.UPDATE_RESEND_OTP_BUTTON_STATE, { data });
}

export function verifyOtp(data) {
    return action(types.VERIFY_OTP, { data });
}

export function resetPassword(data) {
    return action(types.RESET_PASSWORD, { data });
}

export function updatePassword(data) {
    return action(types.UPDATE_PASSWORD, { data });
}

export function updateProfile(data) {
    return action(types.UPDATE_PROFILE, { data });
}

export function authenticate(data) {
    return action(types.AUTHENTICATE, { data });
}

export function setAuthDataFromPersistantStorage(data) {
    return action(types.AUTH_SUCCESS, { data });
}

export function setUserInfoFromPersistantStorage(data) {
    return action(types.FETCH_USER_INFO_SUCCESS, { data });
}

export function logout(data) {
    return action(actions.types.LOG_OUT, { data });
}

export function setUpdatedProfile(data) {
    return action(types.UPDATED_PROFILE, { data });
}

export function updateQRcodeRegex(data) {
    return action(types.UPDATE_QRCODE_REGEX, { data });
}

export function prepareEncryptionKey(data) {
    return action(types.PREPARE_ENCRYPTION_KEY, { data });
}

export function setEncryptionKey(data) {
    return action(types.SET_ENCRYPTION_KEY, { data });
}

export function autoUpdate() {
    return action(types.AUTO_UPDATE);
}
