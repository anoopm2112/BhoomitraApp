import { api } from '../../common';
import { types as ActionTypes } from './actions';

const { restAPI } = api;

export function updateUserLanguage({ userId, langId }) {
    let payload = {
        types: [ActionTypes.UPDATE_USER_LANGUAGE_API_REQUEST, ActionTypes.UPDATE_USER_LANGUAGE_API_SUCCESS, ActionTypes.UPDATE_USER_LANGUAGE_API_FAILED]
    };
    return {
        endpoint: `user/users/${userId}/languages/${langId}`,
        api: restAPI.put,
        payload,
        showErrorToast: false
    }
}

export function customerNotificationList({ customerNumber, langId }) {
    let payload = {
        types: [ActionTypes.NOTIFICATION_API_REQUEST, ActionTypes.NOTIFICATION_API_SUCCESS, ActionTypes.NOTIFICATION_API_FAILED],
        params: {
            langId
        }
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/notifications`,
        api: restAPI.get,
        payload
    }
}

export function notificationList({ userId, langId }) {
    let payload = {
        types: [ActionTypes.NOTIFICATION_API_REQUEST, ActionTypes.NOTIFICATION_API_SUCCESS, ActionTypes.NOTIFICATION_API_FAILED],
        params: {
            langId
        }
    };
    return {
        endpoint: `user/users/${userId}/notifications`,
        api: restAPI.get,
        payload
    }
}

export function questionUIKeys() {
    let payload = {
        types: [ActionTypes.QUS_UI_KEY_API_REQUEST, ActionTypes.QUS_UI_KEY_API_SUCCESS, ActionTypes.QUS_UI_KEY_API_FAILED]
    };
    return {
        endpoint: 'admin/question-ui-keys',
        api: restAPI.get,
        payload
    };
}

export function getSurveyTotalCount({ userId, templateTypeId }) {
    let payload = {
        types: [ActionTypes.SURVEY_ENROLLMENT_TOTAL_COUNT_API_REQUEST, ActionTypes.SURVEY_ENROLLMENT_TOTAL_COUNT_API_SUCCESS, ActionTypes.SURVEY_ENROLLMENT_TOTAL_COUNT_API_FAILED],
        params: {
            templateTypeId
        }
    };
    return {
        endpoint: `dfg/templates/users/${userId}/answer-count`,
        api: restAPI.get,
        payload
    }
}

export function setUnreadMsgToRead(notificationRequest) {
    let payload = {
        types: [ActionTypes.READ_NOTIFICATION_API_REQUEST, ActionTypes.READ_NOTIFICATION_API_SUCCESS, ActionTypes.READ_NOTIFICATION_API_FAILED],
        body: notificationRequest
    };
    return {
        endpoint: `user/notifications`,
        api: restAPI.put,
        payload
    }
}

export function qrUpdateInProfile(organizationId) {
    let payload = {
        types: [ActionTypes.QRCODE_UPDATE_IN_PROFILE_API_REQUEST, ActionTypes.QRCODE_UPDATE_IN_PROFILE_API_SUCCESS, ActionTypes.QRCODE_UPDATE_IN_PROFILE_API_FAILED],
    };
    return {
        endpoint: `qrcode/organizations/${organizationId}/regexes`,
        api: restAPI.get,
        payload,
        showErrorToast: false
    }
}
