import { all, takeLatest, call, select, spawn, take, put, race } from 'redux-saga/effects';
import Storage from '../../common/storages';
import { I18n, utils } from '../../common';
import * as Actions from './actions';
import * as DashBoardActions from '../dashboard/actions';
import * as SplashActions from '../splash/actions';
import * as SettingsActions from '../settings/actions';
import { LANGUAGE_STORE_KEY } from './constants';
import { getUserInfo } from '../user/selectors';
import { USER_INFO_STORE_KEY } from '../user/constants';

const { userUtils } = utils;
const { types: ActionTypes } = Actions;
const { types: DashboardActionTypes } = DashBoardActions;

function* updateLocale(action) {
    const { language, restart, reinitialize } = action.payload.data;
    I18n.locale = language.locale;
    if (restart) {
        yield call([Storage, 'setItem'], LANGUAGE_STORE_KEY, JSON.stringify(language));
        const userId = (yield select(getUserInfo)).id;
        const langId = language.langId;
        yield put(DashBoardActions.updateUserLanguage({ userId, langId }));
        const { success, failed } = yield race({
            success: take(DashboardActionTypes.UPDATE_USER_LANGUAGE_API_SUCCESS),
            failed: take(DashboardActionTypes.UPDATE_USER_LANGUAGE_API_FAILED)
        });
        let userInfo = yield call([Storage, 'getItem'], USER_INFO_STORE_KEY);
        userInfo = userInfo ? JSON.parse(userInfo) : null;
        if (userUtils.hasGtRole(userInfo) || userUtils.hasSurveyorRole(userInfo)) {
            yield put(DashBoardActions.navigateToDashboardSummary());
        } else if (userUtils.hasMcfUserRole(userInfo)) {
            yield put(DashBoardActions.navigateToMcfDashboardSummary());
        } else if (userUtils.hasRrfUserRole(userInfo)) {
            yield put(DashBoardActions.navigateToRrfDashboardSummary());
        } else if (userUtils.hasCkcUserRole(userInfo)) {
            yield put(DashBoardActions.navigateToCkcDashboardSummary());
        } else if (userUtils.hasSupervisorRole(userInfo)) {
            yield put(DashBoardActions.navigateToSupervisorDashboardSummary());
        } else {
            yield put(DashBoardActions.navigateToCustomerDashboardSummary());
        }
        yield put(SettingsActions.forceUpdate());
    } else if (reinitialize) {
        yield call([Storage, 'setItem'], LANGUAGE_STORE_KEY, JSON.stringify(language));
        // Re-initialize here
        yield put(SplashActions.initialize());
    }
}

export default function* languageSaga() {
    yield all([
        takeLatest(ActionTypes.LANGUAGE_SELECT, updateLocale)
    ]);
}
