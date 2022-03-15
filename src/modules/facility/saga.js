import { all, takeLatest, put, fork, select, call } from 'redux-saga/effects';
import _ from 'lodash';
import * as Actions from './actions';
import * as DashboardActions from '../dashboard/actions';
import * as FacilityAPI from './api';
import { saga, utils, I18n } from '../../common';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import NetInfo from '@react-native-community/netinfo';

const { types: ActionTypes } = Actions;
const { toastUtils: { infoToast } } = utils;

function* fetchNearestMcf(action) {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = { langId: langId.langId,latitude: action.payload.latitude,
        longitude: action.payload.longitude };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, FacilityAPI.fetchNearestMcf, customerNumber, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCustomerDashboardSummary());
    }
}

export default function* facilitySaga() {
    yield all([
        takeLatest(ActionTypes.FETCH_MCF, fetchNearestMcf),
    ]);
}
