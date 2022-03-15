import { all, takeLatest, delay, put, fork, select, take, call, takeEvery } from 'redux-saga/effects';
import AwaitLock from 'await-lock';
import { saga, utils, I18n, constants } from '../../common';
import Storage from '../../common/storages';
import * as Actions from './actions';
import * as ComplaintAPI from './api';
import * as DashboardActions from '../dashboard/actions';
import * as DfgActions from '../dfg/actions';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import NetInfo from '@react-native-community/netinfo';
import {
    APP_TOUR_STORE_KEY
} from '../dashboard/constants';
import { getSideBarData } from '../dashboard/selectors';
import * as dfgSaga from '../dfg/saga';
import { SurveyDataRepository, ComplaintRepository, CustomerProfileRepository } from '../../common/realm/repositories';
import {
    getComplaintItemList, getComplaintIcons, getIncompleteComplaints,
    getComplaintPhotos
} from './selectors';
import _ from 'lodash';
import moment from 'moment';
import { customerProfileLock } from '../../common/locks';
import { ROUTE_KEYS as DASHBOARD_ROUTE_KEYS } from '../dashboard/constants';
import { ROUTE_KEYS as COMPLAINT_ROUTE_KEYS } from './constants';
import * as ServiceActions from '../service/actions';

const { DATE_FORMAT, API_DATE_TIME_FORMAT } = constants;

const {
    types: ActionTypes,
    navigateToCustomerComplaints,
    navigateToNewComplaint,
    newComplaintImage,
    navigateToComplaintItemList,
    setComplaintExecutionSurveyDataMap,
    setComplaintingResumeModalVisibility,
    setComplaintIcons,
    setComplaintPhotos
} = Actions;
const {
    navigateToCustomerDashboardSummary,
    updateCount
} = DashboardActions;

const {
    initializeDynamicForm,
    navigateToDynamicFormView,
} = DfgActions;

const {
    loadIncompleteServices
} = ServiceActions;

const { toastUtils: { infoToast, successToast } } = utils;

function* loadDoneComplaints(action) {
    let data = [];
    let complaintDoneList = [];
    yield delay(10);
    yield put(Actions.setDoneComplaints(data, complaintDoneList));
}

function* customerComplaints() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(navigateToCustomerComplaints());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* newComplaint(action) {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.addComplaint = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(navigateToNewComplaint(action));
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* fetchComplaints() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = { langId: langId.langId };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, ComplaintAPI.fetchComplaints, customerNumber, params);
        // yield put(navigateToNewComplaint());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(navigateToCustomerDashboardSummary());
    }
}

function* fetchSchedule(action) {
    if (action.payload.data !== undefined) {
        const { id, organizationServiceProviderServiceConfigId, serviceConfigId } = action.payload.data;
        const userInfo = yield select(getUserInfo);
        const { additionalInfo: { customerNumber } } = userInfo;
        const langId = yield select(getLanguage);
        const netInfo = yield call([NetInfo, 'fetch']);
        let params = {
            ospscId: organizationServiceProviderServiceConfigId,
            serviceConfigId: serviceConfigId,
            langId: langId.langId,
        };
        if (netInfo.isInternetReachable) {
            if (serviceConfigId !== null) {
                yield fork(saga.handleAPIRequest, ComplaintAPI.fetchSchedule, customerNumber, id, params);
            }
        } else {
            yield call(infoToast, I18n.t('network_unavailable'), 0);
            yield put(navigateToCustomerDashboardSummary());
        }
    }
}

function* addComplaint(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const userInfo = yield select(getUserInfo);
        const { id: userId } = userInfo;
        const { organizations, additionalInfo: { customerNumber, residenceCategory: { id: residenceCategoryId } } } = userInfo;
        const { selectedComplaintItem, userLocation, formattedAddress, selectedScheduleItem, image = '' } = action.payload.data;
        let reportedScheduleCustomerId = '';
        let reportedScheduleId = '';
        if (selectedScheduleItem !== '' && selectedScheduleItem !== undefined) {
            reportedScheduleCustomerId = selectedScheduleItem.scheduleCustomerId;
            reportedScheduleId = selectedScheduleItem.scheduleId;
        }
        let location = '';
        if (userLocation !== undefined && userLocation !== '') {
            location = {
                longitude: userLocation.coords.longitude,
                latitude: userLocation.coords.latitude,
                formattedAddress: formattedAddress
            };
        } else {
            location = {};
        }
        let photo = '';
        if (image !== undefined) {
            photo = image;
        }
        if (selectedComplaintItem !== '' && selectedComplaintItem !== undefined) {
            yield call(infoToast, I18n.t('complaint_request_updating'));
            let params = {
                userId: userId,
                serviceConfigId: selectedComplaintItem?.serviceConfigId,
                complaintConfigId: selectedComplaintItem?.id,
                serviceProviderId: selectedComplaintItem?.serviceProviderId,
                serviceWorkerId: selectedComplaintItem?.serviceWorkerId,
                swSupervisorId: selectedComplaintItem?.swSupervisorId,
                organizationId: organizations[0].id,
                serviceProviderServiceConfigId: selectedComplaintItem?.organizationServiceProviderServiceConfigId,
                residenceCategoryId: residenceCategoryId,
                comment: action.payload.data.comment,
                location: location,
                reportedScheduleCustomerId: reportedScheduleCustomerId,
                reportedScheduleId: reportedScheduleId,
                reportedDate: moment.utc().format(API_DATE_TIME_FORMAT),
                photo: photo
            };
            yield fork(saga.handleAPIRequest, ComplaintAPI.addComplaint, customerNumber, params);
            const updateServiceRequestAction = yield take([ActionTypes.ADD_COMPLAINT_SUCCESS, ActionTypes.ADD_COMPLAINT_FAILED]);
            if (updateServiceRequestAction.type === ActionTypes.ADD_COMPLAINT_SUCCESS) {
                yield call(successToast, I18n.t('complaint_updated_successfully'));
                yield delay(1000);
                // yield put(Actions.getAllComplaints());
                yield put(navigateToCustomerComplaints());
            }
        } else {
            yield call(infoToast, I18n.t('select_atleast_one_complaint_type'), 1);
        }
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* getAllComplaints() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = { langId: langId.langId };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, ComplaintAPI.getAllComplaints, customerNumber, params);
        // yield put(navigateToCustomerComplaints());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(navigateToCustomerDashboardSummary());
    }
}

function* startComplaintExecution(action) {
    const { customerProfile, item } = action.payload.data;
    const { templateTypeId, version, complaintId, moduleId } = item;
    const { position = {}, configs: { complaintExecutionSurveyDataMap } } = yield select(getComplaintItemList);
    const { customerEnrollmentId } = customerProfile;
    const { coords: { latitude, longitude } = {} } = position;
    const initializer = {
        templateTypeId,
        version,
        surveyFinishedAction: function* surveyFinishedAction() {
            yield put(navigateToComplaintItemList({ customerProfile }));
        }
    };
    const surveyId = complaintExecutionSurveyDataMap[complaintId];
    if (surveyId) {
        initializer.surveyDataKey = surveyId;
        initializer.setResumeModalVisibility = (data) => setComplaintingResumeModalVisibility(data);
    } else {
        initializer.additionalInfo = {
            customerEnrollmentId,
            complaintId,
            complaintResolvedAt: moment.utc().format(API_DATE_TIME_FORMAT),
            moduleId
        }
        if (latitude && longitude) {
            initializer.additionalInfo['location'] = JSON.stringify({ latitude, longitude });
        }
    }
    yield put(initializeDynamicForm(initializer));
    yield put(navigateToDynamicFormView());
}

function* generateComplaintExecutionSurveyDataMap(action) {
    const customerProfile = action.payload.data;
    const complaintExecutionSurveyDataMap = {};
    const { customerEnrollmentId, complaints = {} } = customerProfile;
    for (const complaintExecutionDate in complaints) {
        const groupedComplaints = complaints[complaintExecutionDate];
        for (const complaint of groupedComplaints) {
            const { templateTypeId } = complaint;
            const additionalInfo = [
                { key: 'customerEnrollmentId', value: customerEnrollmentId },
                { key: 'complaintId', value: complaint.complaintId }
            ];
            const { surveyId } = yield call(dfgSaga.isSurveyDataPresentInStorage, { templateTypeId, additionalInfo });
            if (surveyId) {
                complaintExecutionSurveyDataMap[complaint.complaintId] = surveyId;
            }
        }
    }
    yield put(setComplaintExecutionSurveyDataMap({ initDone: true, complaintExecutionSurveyDataMap }));
}

function* fetchComplaintIcons(action) {
    let apiSucceeded = true;
    const { forceUpdate } = action.payload.data || {};
    if (!forceUpdate) {
        const icons = yield select(getComplaintIcons);
        if (!_.isEmpty(icons)) {
            return apiSucceeded;
        }
        const savedIcons = yield call([ComplaintRepository, 'findAll']);
        if (!_.isEmpty(savedIcons)) {
            yield put(setComplaintIcons(transformComplaintIconsData(savedIcons)));
            return apiSucceeded;
        }
    }
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const complaintIconApiRequest = {
            type: 'dropdown',
            langId: (yield select(getLanguage)).langId
        };
        yield fork(saga.handleAPIRequest, ComplaintAPI.loadComplaintIcons, complaintIconApiRequest);
        const loadComplaintIconsSuccessAction = yield take([ActionTypes.FETCH_COMPLAINT_ICONS_API_SUCCESS, ActionTypes.FETCH_COMPLAINT_ICONS_API_FAILED]);
        if (loadComplaintIconsSuccessAction.type === ActionTypes.FETCH_COMPLAINT_ICONS_API_SUCCESS) {
            let loadComplaintIconsSuccessActionResponse = loadComplaintIconsSuccessAction.payload.data || [];
            if (!_.isEmpty(loadComplaintIconsSuccessActionResponse)) {
                yield call([ComplaintRepository, 'saveAll'], loadComplaintIconsSuccessActionResponse);
                yield put(setComplaintIcons(transformComplaintIconsData(loadComplaintIconsSuccessActionResponse)));
            }
        } else {
            apiSucceeded = false;
        }
    }
    return apiSucceeded;
}

function transformComplaintIconsData(data) {
    const transformedData = _.reduce(data, (result, value, key) => {
        result[value.id] = {
            name: value.name,
            icon: value.icon
        }
        return result;
    }, {});
    return transformedData;
}

function* loadComplaintPhotos(action) {
    const { partialRefresh } = action.payload.data || {};
    const { data = [] } = yield select(getIncompleteComplaints);
    const photos = yield select(getComplaintPhotos);
    const input = {};
    for (const card of data) {
        if (partialRefresh) {
            if (!photos.hasOwnProperty(card.customerEnrollmentId)) {
                input[card.customerEnrollmentId] = card.photoId;
            }
        } else {
            input[card.customerEnrollmentId] = card.photoId;
        }
    }
    const output = yield call([SurveyDataRepository, 'findPhotosOf'], input);
    if (!_.isEmpty(output)) {
        yield put(setComplaintPhotos(output));
    }
}

function* setComplaintExecuted(action) {
    const { customerEnrollmentId, complaintId } = action.payload.data;
    customerProfileLock[customerEnrollmentId] = customerProfileLock[customerEnrollmentId] || new AwaitLock();
    yield call([customerProfileLock[customerEnrollmentId], 'acquireAsync']);
    const customerProfile = yield call([CustomerProfileRepository, 'findByCustomerEnrollmentId'], customerEnrollmentId);
    const { complaints } = customerProfile;
    for (const complaintExecutionDate in complaints) {
        const groupedComplaints = complaints[complaintExecutionDate];
        const targetIndex = _.findIndex(groupedComplaints, ['complaintId', complaintId]);
        if (targetIndex > -1) {
            groupedComplaints.splice(targetIndex, 1);
            if (groupedComplaints.length < 1) {
                delete complaints[complaintExecutionDate];
            }
            yield call([CustomerProfileRepository, 'save'], customerProfile);
            const sideBarData = yield select(getSideBarData);
            const { currentRoute } = sideBarData;
            if (currentRoute === COMPLAINT_ROUTE_KEYS.COMPLAINTSINPROGRESS) {
                yield call(loadIncompleteServices());
            } else if (currentRoute === DASHBOARD_ROUTE_KEYS.SUMMARY) {
                const complaintPending = yield call([CustomerProfileRepository, 'getComplaintPendingCount']);
                yield put(updateCount({ complaintPending }));
            }
        }
    }
    yield call([customerProfileLock[customerEnrollmentId], 'release']);
    if (!customerProfileLock[customerEnrollmentId].acquired) {
        delete customerProfileLock[customerEnrollmentId];
    }
}

function* deleteComplaint(action) {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    let complaintId = action.payload.data;
    yield fork(saga.handleAPIRequest, ComplaintAPI.deleteComplaint, customerNumber, complaintId);
    const successAction = yield take(ActionTypes.DELETE_COMPLAINT_API_SUCCESS);
    if (successAction.type === ActionTypes.DELETE_COMPLAINT_API_SUCCESS) {
        yield call(successToast, I18n.t('complaint_deleted_successfully'));
    }
    yield call(getAllComplaints);
}

export default function* complaintSaga() {
    yield all([
        takeLatest(ActionTypes.LOAD_DONE_COMPLAINTS, loadDoneComplaints),
        takeLatest(ActionTypes.CUSTOMER_COMPLAINT, customerComplaints),
        takeLatest(ActionTypes.NEW_COMPLAINT, newComplaint),
        takeLatest(ActionTypes.FETCH_COMPLAINTS, fetchComplaints),
        takeLatest(ActionTypes.SCHEDULE, fetchSchedule),
        takeLatest(ActionTypes.ADD_COMPLAINT, addComplaint),
        takeLatest(ActionTypes.GET_ALL_COMPLAINTS, getAllComplaints),
        takeLatest(ActionTypes.START_COMPLAINT_EXECUTION, startComplaintExecution),
        takeLatest(ActionTypes.GENERATE_COMPLAINT_EXECUTION_SURVEY_DATA_MAP, generateComplaintExecutionSurveyDataMap),
        takeLatest(ActionTypes.FETCH_COMPLAINT_ICONS, fetchComplaintIcons),
        takeLatest(ActionTypes.LOAD_COMPLAINT_PHOTOS, loadComplaintPhotos),
        takeEvery(DfgActions.types.SET_COMPLAINT_EXECUTED, setComplaintExecuted),
        takeLatest(ActionTypes.DELETE_COMPLAINT, deleteComplaint),
    ]);
}

export {
    fetchComplaintIcons
}