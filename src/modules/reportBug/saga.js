import { all, takeLatest, put, fork, take, call, select, delay } from 'redux-saga/effects';
import * as Actions from './actions';
import { utils, I18n, saga } from '../../common';
import * as BugReportAPI from './api';
import { getUserInfo } from '../dfg/common/selectors';
import { navigation } from '../../common/actions';

const { types: ActionTypes } = Actions;
const { toastUtils: { infoToast, successToast, hideToast } } = utils;
const { navigateBack } = navigation;

function* saveBugReport(action) {
    yield call(infoToast, I18n.t('bug_report_request_updating'));
    yield delay(1000);
    const { image, comment } = action.payload.data;
    const userInfo = yield select(getUserInfo);
    const { id: userId } = userInfo;
    let params = {
        screenshot: image,
        comment: comment,
        reportedBy: userId,
    }
    yield fork(saga.handleAPIRequest, BugReportAPI.saveBugReport, params);
    const bugReportRequestAction = yield take([ActionTypes.SAVE_BUGREPORT_API_SUCCESS, ActionTypes.SAVE_BUGREPORT_API_FAILED]);
    if (bugReportRequestAction.type === ActionTypes.SAVE_BUGREPORT_API_SUCCESS) {
        yield call(successToast, I18n.t('bug_reported_successfully'));
        yield put(Actions.deleteReportImage());
        yield put(navigateBack());
    } else if (bugReportRequestAction.type === ActionTypes.SAVE_BUGREPORT_API_FAILED) {
        yield put(Actions.deleteReportImage());
    }
}

export default function* reportBugSaga() {
    yield all([
        takeLatest(ActionTypes.SAVE_BUG_REPORT, saveBugReport),
    ]);
}