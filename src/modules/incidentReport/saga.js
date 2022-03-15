import { all, takeLatest, delay, put, fork, select, take, call } from 'redux-saga/effects';
import * as Actions from './actions';
import * as IncidentReportAPI from './api';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import { saga, I18n, utils, constants } from '../../common';
import * as DashboardActions from '../dashboard/actions';
import NetInfo from '@react-native-community/netinfo';
import { deleteComplaintImage } from '../complaints/actions';
import Storage from '../../common/storages';
import { APP_TOUR_STORE_KEY } from '../dashboard/constants';
import moment from "moment";

const { DATE_FORMAT, API_DATE_TIME_FORMAT } = constants;
const { toastUtils: { infoToast, successToast } } = utils;
const { types: ActionTypes } = Actions;

function* addIncidentReport(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const userInfo = yield select(getUserInfo);
        const { id: userId } = userInfo;
        const { additionalInfo: { customerNumber } } = userInfo;
        const { comment, formattedAddress, userLocation, image = '', selectedIncidentItem } = action.payload.data;
        let location = '';
        location = {
            longitude: userLocation.longitude,
            latitude: userLocation.latitude,
            formattedAddress: formattedAddress
        };
        let photo = '';
        if (image !== undefined) {
            photo = image;
        }
        if (selectedIncidentItem !== '' && selectedIncidentItem !== undefined) {
            yield call(infoToast, I18n.t('incident_request_updating'));
            let params = {
                incidentConfigId: selectedIncidentItem?.id,
                location: location,
                photo: photo,
                comment: comment,
                customerNumber: customerNumber,
                reportedBy: userId,
                reportedAt: moment.utc().format(API_DATE_TIME_FORMAT)
            }
            yield fork(saga.handleAPIRequest, IncidentReportAPI.addNewIncidentReport, params);
            const addIncidentReportRequestAction = yield take([ActionTypes.ADD_NEW_INCIDENTREPORT_API_SUCCESS]);
            if (addIncidentReportRequestAction.type === ActionTypes.ADD_NEW_INCIDENTREPORT_API_SUCCESS) {
                yield call(successToast, I18n.t('incident_updated_successfully'));
                yield delay(1000);
                yield put(DashboardActions.navigateToIncidentReport());
                yield put(deleteComplaintImage());
            }
        } else {
            yield call(infoToast, I18n.t('select_atleast_one_incident_type'), 1);
        }
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* fetchIncidentReportList() {
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        type: 'card',
        langId: langId.langId,
        page: 1,
        size: 10
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, IncidentReportAPI.fetchIncidentList, params);
        yield put(DashboardActions.navigateToIncidentReport());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCustomerDashboardSummary());
    }
}

function* fetchIncidentReports() {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.addIncidentReport = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        type: 'dropdown',
        langId: langId.langId
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, IncidentReportAPI.fetchIncidentReport, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(DashboardActions.navigateToCustomerDashboardSummary());
    }
}

export default function* incidentReportSaga() {
    yield all([
        takeLatest(ActionTypes.ADD_INCIDENTREPORT, addIncidentReport),
        takeLatest(ActionTypes.FETCH_INCIDENTREPORT_LIST, fetchIncidentReportList),
        takeLatest(ActionTypes.FETCH_INCIDENTREPORTS, fetchIncidentReports)
    ]);
}
