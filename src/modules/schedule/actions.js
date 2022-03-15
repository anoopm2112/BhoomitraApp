import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as SCHEDULE_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    SET_CANCEL_MODAL_VISIBILITY: 'Schedule/SET_CANCEL_MODAL_VISIBILITY',
    FETCH_SCHEDULES: 'Schedule/FETCH_SCHEDULES',
    FETCH_SCHEDULES_REQUEST: 'Schedule/FETCH_SCHEDULES_REQUEST',
    FETCH_SCHEDULES_SUCCESS: 'Schedule/FETCH_SCHEDULES_SUCCESS',
    FETCH_SCHEDULES_FAILED: 'Schedule/FETCH_SCHEDULES_FAILED',
    RESCHEDULE: 'Schedule/RESCHEDULE',
    RESCHEDULE_REQUEST: 'Schedule/RESCHEDULE_REQUEST',
    RESCHEDULE_SUCCESS: 'Schedule/RESCHEDULE_SUCCESS',
    RESCHEDULE_FAILED: 'Schedule/RESCHEDULE_FAILED',
    DELETE_RESCHEDULE: 'Schedule/DELETE_RESCHEDULE',
    DELETE_RESCHEDULE_REQUEST: 'Schedule/DELETE_RESCHEDULE_REQUEST',
    DELETE_RESCHEDULE_SUCCESS: 'Schedule/DELETE_RESCHEDULE_SUCCESS',
    DELETE_RESCHEDULE_FAILED: 'Schedule/DELETE_RESCHEDULE_FAILED',
    CUSTOMER_SCHEDULE: 'Schedule/CUSTOMER_SCHEDULE'
}

export function navigateTo(route, screen) {
    return navigate(route, { screen });
}

export function navigateToScheduleList() {
    return navigate(MODULE_ROUTE_KEYS.SCHEDULE, { screen: SCHEDULE_ROUTE_KEYS.SCHEDULELIST });
}

export function toggleSheduleConfirmationModalVisibility(data) {
    return action(types.SET_CANCEL_MODAL_VISIBILITY, { data });
}

export function customerSchedule() {
    return action(types.CUSTOMER_SCHEDULE);
}

export function fetchSchedules() {
    return action(types.FETCH_SCHEDULES);
}

export function reschedule(data) {
    return action(types.RESCHEDULE, { data });
}

export function deleteSchedule(data) {
    return action(types.DELETE_RESCHEDULE, { data });
}