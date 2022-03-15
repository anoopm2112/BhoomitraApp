import { all, takeLatest, delay, put, fork, take, select, call } from 'redux-saga/effects';
import _ from 'lodash';
import * as Actions from './actions';
import * as DashboardActions from '../dashboard/actions';
import * as ScheduleAPI from './api';
import { saga, utils, I18n } from '../../common';
// import { getUserInfo } from './../user/selectors';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import NetInfo from "@react-native-community/netinfo";

const { types: ActionTypes } = Actions;
const { toastUtils: { infoToast, successToast, hideToast }, userUtils } = utils;

function* fetchSchedules() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = { langId: langId.langId };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, ScheduleAPI.fetchSchedules, customerNumber, params);
        yield put(Actions.navigateToScheduleList());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCustomerDashboardSummary());
    }
}

function* customerSchedule() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(Actions.navigateToScheduleList());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* reschedule(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const { scheduleId, date: { dateString } } = action.payload.data;
        let params = {
            rescheduledate: dateString
        };
        const userInfo = yield select(getUserInfo);
        const { additionalInfo: { customerNumber } } = userInfo;
        yield call(infoToast, I18n.t('schedule_rescheduling'));
        yield fork(saga.handleAPIRequest, ScheduleAPI.reschedule, customerNumber, scheduleId, params);
        yield take(ActionTypes.RESCHEDULE_SUCCESS);
        yield call(successToast, I18n.t('service_rescheduled'));
        yield put(Actions.fetchSchedules());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* deleteSchedule(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const userInfo = yield select(getUserInfo);
        const { additionalInfo: { customerNumber } } = userInfo;
        yield call(infoToast, I18n.t('schedule_cancel'), 0);
        yield fork(saga.handleAPIRequest, ScheduleAPI.deleteSchedule, customerNumber, action.payload.data);
        yield take(ActionTypes.DELETE_RESCHEDULE_SUCCESS);
        yield call(successToast, I18n.t('schedule_successfully_cancelled'));
        yield put(Actions.fetchSchedules());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

export default function* scheduleSaga() {
    yield all([
        takeLatest(ActionTypes.FETCH_SCHEDULES, fetchSchedules),
        takeLatest(ActionTypes.RESCHEDULE, reschedule),
        takeLatest(ActionTypes.DELETE_RESCHEDULE, deleteSchedule),
        takeLatest(ActionTypes.CUSTOMER_SCHEDULE, customerSchedule),
    ]);
}
