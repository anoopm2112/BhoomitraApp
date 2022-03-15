import { api } from '../../common';
import * as Actions from './actions';

const { types: ActionTypes } = Actions;
const { restAPI } = api;

export function fetchSchedules(customerNumber, params) {
    let payload = {
        types: [ActionTypes.FETCH_SCHEDULES_REQUEST, ActionTypes.FETCH_SCHEDULES_SUCCESS, ActionTypes.FETCH_SCHEDULES_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/schedules`,
        api: restAPI.get,
        payload
    };
}

export function deleteSchedule(customerNumber, scheduleId) {
    let payload = {
        types: [ActionTypes.DELETE_RESCHEDULE_REQUEST, ActionTypes.DELETE_RESCHEDULE_SUCCESS, ActionTypes.DELETE_RESCHEDULE_FAILED],
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/schedules/${scheduleId}`,
        api: restAPI.del,
        payload
    };
}

export function reschedule(customerNumber, scheduleId, params) {
    let payload = {
        body: params,
        types: [ActionTypes.RESCHEDULE_REQUEST, ActionTypes.RESCHEDULE_SUCCESS, ActionTypes.RESCHEDULE_FAILED],
    };
    console.log('payload',payload);
    return {
        endpoint: `schedule/customers/${customerNumber}/schedules/${scheduleId}`,
        api: restAPI.put,
        payload
    };
}