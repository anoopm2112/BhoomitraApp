import { all, takeLatest, call, spawn, put, select, fork, take, delay } from 'redux-saga/effects';
import _ from 'lodash';
import { saga, I18n, actions as CommonActions, constants } from '../../common';
import { Actions } from '../dfg/common/actions';
import * as DfgAPI from '../dfg/api';
import * as EnrollmentAPI from './api';
import * as dfgSaga from '../dfg/saga';
import * as EnrollmentActions from './actions';
import * as ServiceActions from '../service/actions';
import * as SplashActions from '../splash/actions';
import * as DfgActions from '../dfg/actions';
import { getUserInfo, getLanguage } from '../dfg/common/selectors';
import Storage from '../dfg/common/storage';
import { METADATA_STORE_KEY, SURVEY_TEMPLATE_STORE_KEY } from '../dfg/common/constants';
import { APP_TOUR_STORE_KEY } from '../dashboard/constants';
import * as DashboardActions from '../dashboard/actions';
import { store } from '../dfg/common/store';
import { getCompletedSurveys } from './selectors';
import { TEMPLATE_TYPES, TEMPLATE_TYPE_IDS, RESIDENCE_CATEGORIES } from '../dfg/constants';
import { LIST_VIEW_KEYS } from './constants';
import { getDefaultOrganization, getPayloadData, infoToast, successToast, errorToast } from '../dfg/common/utils';
import { mergeCustomerProfile } from '../../common/utils/serviceUtil';
import { reactivateScanner } from '../../common/components/QRCodeScanner';
import { SurveyDataRepository, CustomerProfileRepository, QrCodeListRepository } from '../../common/realm/repositories';
import NetInfo from '../dfg/common/NetInfo';
import moment from 'moment';

const { DATE_FORMAT, API_DATE_TIME_FORMAT } = constants;
const { navigation: { navigateBack } } = CommonActions;
const { types: DfgActionTypes } = Actions;

const {
    types: ActionTypes,
    setIncompleteSurveys,
    setSurveysToBeDeleted,
    setResumeModalVisibility,
    postQRCodeScanning,
    setPendingQrCodeSurveys,
} = EnrollmentActions;

const {
    initializeDynamicForm,
    navigateToDynamicFormView
} = DfgActions;

const {
    navigateToEnrollmentTopBar,
    initializeQRCodeScanner,
    navigateToQRCodeScannerView
} = DashboardActions;

function* startEnrollmentSurvey(action) {
    const { surveyId, secureEdit } = action.payload.data || {};
    const initializer = {
        templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.CUSTOMER_ENROLLMENT],
        surveyFinishedAction: function* surveyFinishedAction(surveyData) {
            const listView = yield call([dfgSaga, 'transformSurveyDataInApiFormatToListView'], surveyData, Object.keys(LIST_VIEW_KEYS));
            listView.customerEnrollmentId = listView.id;
            delete listView.id;
            delete listView.completed;
            const existingProfile = yield call([CustomerProfileRepository, 'findByCustomerEnrollmentId'], listView.customerEnrollmentId);
            if (existingProfile) {
                const newProfile = buildCustomerProfile(listView.customerEnrollmentId, surveyData.dataSources, listView.details, existingProfile);
                yield call(mergeCustomerProfile, existingProfile, newProfile, false);
                yield call([CustomerProfileRepository, 'save'], existingProfile);
            }
            const listViewExists = yield call([QrCodeListRepository, 'existsByCustomerEnrollmentId'], listView.customerEnrollmentId);
            if (listViewExists || !secureEdit) {
                yield call([QrCodeListRepository, 'save'], listView);
            }
            if (secureEdit) {
                yield put(ServiceActions.navigateToServiceBarcode({ qrCode: existingProfile.qrCode }));
            } else {
                yield put(navigateToEnrollmentTopBar());
            }
        }
    };
    if (surveyId) {
        initializer.surveyDataKey = surveyId;
        initializer.setResumeModalVisibility = (data) => {
            return secureEdit ? ServiceActions.setSubscriptionResumeModalVisibility(data) : setResumeModalVisibility(data);
        }
    }
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.customerEnrollment = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    yield put(initializeDynamicForm(initializer));
    yield put(navigateToDynamicFormView());
}

function* loadIncompleteSurveys() {
    const payload = {
        data: {
            templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.CUSTOMER_ENROLLMENT],
            uiKeys: Object.keys(LIST_VIEW_KEYS),
            setIncompleteSurveys: (data) => setIncompleteSurveys(data)
        }
    };
    yield spawn(dfgSaga.loadIncompleteSurveys, { payload });
}

function* removeInprogressData(action) {
    const payload = {
        data: {
            templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.CUSTOMER_ENROLLMENT],
            surveyId: action.payload.data,
            setSurveysToBeDeleted: (surveyIds) => setSurveysToBeDeleted(surveyIds)
        }
    };
    yield spawn(dfgSaga.removeInprogressData, { payload });
}

function* loadPendingQrCodeSurveys() {
    const templateTypeId = TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.QR_CODE_ENROLLMENT];
    let qrList = yield call([QrCodeListRepository, 'findAll']);
    qrList = qrList ? _.reverse(qrList) : [];
    for (const item of qrList) {
        const additionalInfo = [{ key: 'customerEnrollmentId', value: item.customerEnrollmentId }]
        const { surveyId: qrCodeEnrollmentId, completed = false } = yield call(dfgSaga.isSurveyDataPresentInStorage, { templateTypeId, additionalInfo });
        item.qrCodeEnrollmentId = qrCodeEnrollmentId;
        item.completed = completed;
    };
    yield put(setPendingQrCodeSurveys(qrList));
}

function* startQrCodeEnrollment(action) {
    const { customerEnrollmentId, qrCodeEnrollmentId, details, secureEdit } = action.payload.data;
    let matchFound = false;
    let qrCodeChanged = false;
    let newQrCode = undefined;
    let existingQrCode = undefined;
    let existingProfile = undefined;
    const templateTypeId = TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.QR_CODE_ENROLLMENT];
    const initializer = {
        templateTypeId,
        customValidations: {
            ENROLLMENT_CUSTOMER_QR_CODE: function* runQrCodeValidation(scannedQrCode) {
                existingProfile = CustomerProfileRepository.findByCustomerEnrollmentId(customerEnrollmentId);
                if (existingProfile) {
                    if (existingProfile.qrCode !== scannedQrCode) {
                        // Existing QR code of customer has changed. Make sure that
                        // new QR code is not already in use.
                        const isValid = yield call(isValidQrCode, scannedQrCode);
                        if (!isValid) {
                            return false;
                        }
                        qrCodeChanged = true;
                        newQrCode = scannedQrCode;
                    }
                    matchFound = true;
                    existingQrCode = existingProfile.qrCode;
                } else {
                    const customerPropertyName = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_NAME']);
                    if (customerPropertyName === undefined) {
                        errorToast(I18n.t('customer_property_name_missing'), 2000);
                        return false;
                    }
                }
                if (!matchFound) {
                    // Make sure that new QR code is not already in use.
                    const isValid = yield call(isValidQrCode, scannedQrCode);
                    if (!isValid) {
                        return false;
                    }
                    newQrCode = scannedQrCode;
                }
                return true;
            }
        },
        surveyFinishedAction: function* surveyFinishedAction() {
            if (!matchFound) {
                const dataSources = yield call([SurveyDataRepository, 'findDataSourcesById'], customerEnrollmentId);
                const newProfile = buildCustomerProfile(customerEnrollmentId, dataSources, details);
                newProfile.qrCode = newQrCode;
                yield call([CustomerProfileRepository, 'save'], newProfile);
            } else if (matchFound && qrCodeChanged) {
                existingProfile.qrCode = newQrCode;
                yield call([CustomerProfileRepository, 'save'], existingProfile);
                yield call([CustomerProfileRepository, 'deleteByQrCode'], existingQrCode);
            }
            if (secureEdit) {
                yield put(ServiceActions.navigateToServiceBarcode({ qrCode: qrCodeChanged ? newQrCode : existingQrCode }));
            } else {
                yield put(navigateToEnrollmentTopBar());
            }
        }
    };
    if (qrCodeEnrollmentId) {
        initializer.surveyDataKey = qrCodeEnrollmentId;
        initializer.skipResume = true;
    } else {
        initializer.additionalInfo = {
            customerEnrollmentId
        }
    }
    yield put(initializeDynamicForm(initializer));
    yield put(navigateToDynamicFormView());
}

function* isValidQrCode(scannedQrCode) {
    const userInfo = yield select(getUserInfo);
    const defaultOrganization = getDefaultOrganization(userInfo);
    const { qrCodeValidationRegex } = defaultOrganization;
    let regMatch = null;
    let qrCodeExists = CustomerProfileRepository.existsByQrCode(scannedQrCode);
    if (!qrCodeExists) {
        const netInfo = yield call([NetInfo, 'fetch']);
        if (netInfo.isInternetReachable) {
            yield fork(saga.handleAPIRequest, EnrollmentAPI.checkQrCodeExists, scannedQrCode);
            const checkQrCodeExistsApiAction = yield take([ActionTypes.CHECK_QR_CODE_EXISTS_API_SUCCESS, ActionTypes.CHECK_QR_CODE_EXISTS_API_FAILED]);
            if (checkQrCodeExistsApiAction.type === ActionTypes.CHECK_QR_CODE_EXISTS_API_SUCCESS) {
                qrCodeExists = checkQrCodeExistsApiAction.payload.data;
            }
        }
        let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
        metadata = metadata ? JSON.parse(metadata) : {};
        if (metadata.appTour !== undefined) {
            metadata.appTour.finishSurvey = false;
        }
        yield put(DashboardActions.setAppTourData(metadata));
        yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    }
    if (qrCodeExists) {
        let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
        metadata = metadata ? JSON.parse(metadata) : {};
        if (metadata.appTour !== undefined) {
            metadata.appTour.qrScannerModal = true;
        }
        yield put(DashboardActions.setAppTourData(metadata));
        yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
        errorToast(I18n.t('qrcode_already_exists'), 2000);
        yield delay(1500);
        reactivateScanner();
        return false;
    }
    if (qrCodeValidationRegex === null || qrCodeValidationRegex === '') {
        errorToast(I18n.t('no_qr_code'), 2000);
        yield delay(1500);
        reactivateScanner();
        return false;
    } else {
        regMatch = scannedQrCode.match(new RegExp(qrCodeValidationRegex));
        if (regMatch === null) {
            errorToast(I18n.t('invalid_qr_code'), 2000);
            yield delay(1500);
            reactivateScanner();
            return false;
        }
    }
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.customerEnrollment = false;
        metadata.appTour.qrCodeTab = false;

    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    return true;
}

function buildCustomerProfile(customerEnrollmentId, dataSources, listViewDetails, existingProfile = {}) {
    const customerProfile = {};
    customerProfile.qrCode = existingProfile.qrCode;
    customerProfile.photoId = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_IMAGE']) || {}).id;
    customerProfile.customerNumber = existingProfile.customerNumber ? existingProfile.customerNumber : null;
    customerProfile.customerEnrollmentId = customerEnrollmentId;
    customerProfile.residenceCategoryId = dataSources['buildingType'] === 1 ? RESIDENCE_CATEGORIES.RESIDENTIAL : RESIDENCE_CATEGORIES.NON_RESIDENTIAL;
    customerProfile.name = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_TENANT_NAME']) || {}).value;
    if (customerProfile.name === undefined) {
        customerProfile.name = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_OWNER_NAME']) || { value: null }).value;
    }
    const wardWithId = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_WARD']) || { value: {} }).value;
    if (!_.isEmpty(wardWithId)) {
        const wardSplitUp = wardWithId.name.split('-');
        customerProfile.wardId = wardWithId.id;
        customerProfile.ward = wardSplitUp[1];
        customerProfile.wardNumber = parseInt(wardSplitUp[0]);
    } else {
        customerProfile.wardId = null;
        customerProfile.ward = null;
        customerProfile.wardNumber = null;
    }
    customerProfile.address = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_ADDRESS']) || { value: null }).value;;
    if (existingProfile.lsgi) {
        customerProfile.lsgi = existingProfile.lsgi;
    } else {
        const state = store.getState();
        const userInfo = getUserInfo(state);
        const defaultOrganization = getDefaultOrganization(userInfo) || { name: null };
        customerProfile.lsgi = defaultOrganization.name;
    }
    customerProfile.propertyName = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_NAME']) || {}).value;
    customerProfile.phone = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_TENANT_PHONE_NUMBER']) || {}).value;
    if (customerProfile.phone === undefined) {
        customerProfile.phone = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_OWNER_PHONE_NUMBER']) || { value: null }).value;
    }
    customerProfile.location = (_.find(listViewDetails, ['key', 'ENROLLMENT_CUSTOMER_LOCATION']) || { value: { formattedAddress: null } }).value;
    customerProfile.payments = existingProfile.payments ? existingProfile.payments : [];
    customerProfile.services = existingProfile.services ? existingProfile.services : {};
    customerProfile.complaints = existingProfile.complaints ? existingProfile.complaints : {};
    return customerProfile;
}

function* clearPendingQrCodeSurveys(action) {
    const clearedPendingQrCodeSurveys = action.payload.data;
    yield call([QrCodeListRepository, 'deleteByCustomerEnrollmentIdIn'], clearedPendingQrCodeSurveys);
}

function* editSyncedSurvey(action) {
    const surveyId = action.payload.data;
    const payload = {
        data: {
            templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.CUSTOMER_ENROLLMENT],
            surveyId,
            forceTemplateUpdate: false,
            modalStateProp: 'showDownloadingSurveyDataModal',
            modalStateSelector: (state) => getCompletedSurveys(state),
            toogleModalVisibility: (data) => toogleDownloadingSurveyDataModalVisibility(data),
            setSurveyDataFetchMessage: (data) => setSurveyDataFetchMessage(data)
        }
    };
    const result = yield call(dfgSaga.editSyncedSurvey, { payload });
    if (result) {
        const initializer = {
            templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.CUSTOMER_ENROLLMENT],
            surveyDataKey: surveyId,
            readOnly: true,
            setResumeModalVisibility: (data) => setResumeModalVisibility(data),
            surveyFinishedAction: function* surveyFinishedAction() {
                yield put(navigateToEnrollmentDone());
            }
        };
        yield put(initializeDynamicForm(initializer));
        yield put(navigateToDynamicFormView());
    }
}

function* startServiceEnrollment(action) {
    const { id, additionalInfo = [], dataSources = {} } = action.payload.data;
    // DFG Initializer
    const initializer = {
        templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_ENROLLMENT_RESIDENTIAL],
        surveyFinishedAction: function* surveyFinishedAction() {
            yield put(navigateToEnrollmentTopBar());
        }
    };
    let templateId = undefined;
    let version = undefined;
    let surveyDataKey = undefined;
    let surveyDataAlreadyExists = false;
    const items = yield call([SurveyDataRepository, 'findByTemplateTypeId'], TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_ENROLLMENT_RESIDENTIAL]);
    if (items) {
        items.some(surveyData => {
            const { additionalInfo = [] } = surveyData;
            const customerEnrollmentInfo = _.find(additionalInfo, { 'key': 'customerEnrollmentId' }) || {};
            if (customerEnrollmentInfo.value === id) {
                surveyDataAlreadyExists = true;
                templateId = surveyData.templateId;
                version = surveyData.version;
                surveyDataKey = surveyData.id;
                return true;
            }
            return false;
        });
    }
    if (surveyDataAlreadyExists || _.isEmpty(additionalInfo)) {
        yield put(toogleStartServiceEnrollmentDataModalVisibility(true));
        if (surveyDataAlreadyExists) {
            initializer.surveyDataKey = surveyDataKey;
            initializer.setResumeModalVisibility = (data) => setResumeModalVisibility(data);
        } else {
            // Set additionalInfo here
            initializer.additionalInfo = {
                customerEnrollmentId: id
            };
            // Getting template Id from metadata
            let metadata = yield call([Storage, 'getItem'], METADATA_STORE_KEY);
            metadata = metadata ? JSON.parse(metadata) : {};
            templateId = metadata[TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_ENROLLMENT_RESIDENTIAL]].templateId;
            version = metadata[TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_ENROLLMENT_RESIDENTIAL]].version;
        }
        const userInfo = yield select(getUserInfo);
        const { id: userId } = userInfo;
        const defaultOrganization = getDefaultOrganization(userInfo);
        if (!defaultOrganization) {
            yield put(toogleStartServiceEnrollmentDataModalVisibility(false));
            yield put(setSurveyDataFetchMessage('organizations_unavailable'));
            return;
        }
        // Request params
        const serviceEnrollmentRequest = {
            templateId,
            userId,
            orgId: defaultOrganization.id,
            ...dataSources
        };
        // API call for fetch Survey Template
        yield fork(saga.handleAPIRequest, DfgAPI.fetchSurveyTemplate, serviceEnrollmentRequest);
        const surveyTemplateApiAction = yield take([DfgActionTypes.SURVEY_TEMPLATE_API_SUCCESS, DfgActionTypes.SURVEY_TEMPLATE_API_FAILED]);
        if (surveyTemplateApiAction.type === DfgActionTypes.SURVEY_TEMPLATE_API_FAILED) {
            yield put(toogleStartServiceEnrollmentDataModalVisibility(false));
            yield put(setSurveyDataFetchMessage('survey_data_download_failed'));
            return;
        }
        // Fetch template
        const surveyTemplateApiResponse = getPayloadData(surveyTemplateApiAction.payload.data);
        // Get and set template to Storage node
        let templates = yield call([Storage, 'getItem'], SURVEY_TEMPLATE_STORE_KEY);
        templates = templates ? JSON.parse(templates) : {};
        templates[version] = surveyTemplateApiResponse;
        yield call([Storage, 'setItem'], SURVEY_TEMPLATE_STORE_KEY, JSON.stringify(templates));
        // Check if user has cancelled the operation, if so no need to proceed further
        const modalVisible = (yield select(getCompletedSurveys))['startServiceEnrollmentDataModal'];
        if (!modalVisible) {
            return;
        }
        yield put(toogleStartServiceEnrollmentDataModalVisibility(false));
        // Render DFG
        yield put(initializeDynamicForm(initializer));
        yield put(navigateToDynamicFormView());
    } else {
        const serviceEnrollmentInfo = _.find(additionalInfo, { 'key': 'serviceEnrollmentId' });
        if (serviceEnrollmentInfo) {
            const surveyId = serviceEnrollmentInfo.value;
            const payload = {
                data: {
                    templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_ENROLLMENT_RESIDENTIAL],
                    surveyId,
                    forceTemplateUpdate: true,
                    modalStateProp: 'startServiceEnrollmentDataModal',
                    modalStateSelector: (state) => getCompletedSurveys(state),
                    toogleModalVisibility: (data) => toogleStartServiceEnrollmentDataModalVisibility(data),
                    setSurveyDataFetchMessage: (data) => setSurveyDataFetchMessage(data)
                }
            };
            const result = yield call(dfgSaga.editSyncedSurvey, { payload });
            if (result) {
                initializer.surveyDataKey = surveyId;
                initializer.setResumeModalVisibility = (data) => setResumeModalVisibility(data);
                // Render DFG
                yield put(initializeDynamicForm(initializer));
                yield put(navigateToDynamicFormView());
            }
        }
    }
}

function* startQRCodeScanning(action) {
    const { surveyId } = action.payload.data;
    const initializer = {
        params: {
            surveyId
        },
        scanFinishedAction: (data) => postQRCodeScanning(data)
    }
    yield put(initializeQRCodeScanner(initializer));
    yield put(navigateToQRCodeScannerView());
}

function* handlePostQRCodeScanning(action) {
    const { params: { surveyId: customerEnrollmentId } = {}, qrcode } = action.payload.data;
    yield call(infoToast, I18n.t('updating_customer_qrcode'), 0);
    yield fork(saga.handleAPIRequest, EnrollmentAPI.updateCustomer, { customerEnrollmentId, qrcode });
    const updateCustomerApiAction = yield take([ActionTypes.UPDATE_CUSTOMER_API_SUCCESS, ActionTypes.UPDATE_CUSTOMER_API_FAILED]);
    if (updateCustomerApiAction.type === ActionTypes.UPDATE_CUSTOMER_API_SUCCESS) {
        yield call(successToast, I18n.t('customer_qrcode_updated'));
    }
    yield put(navigateBack());
}

function* fetchSubscription() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    let params = { langId: langId.langId };
    yield call(saga.handleAPIRequest, EnrollmentAPI.fetchSubscriptionServices, customerNumber, params);
}

function* fetchSubscribed() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    let params = { langId: langId.langId };
    yield call(saga.handleAPIRequest, EnrollmentAPI.fetchSubscribedServices, customerNumber, params);
}

function* subscriptions() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(EnrollmentActions.navigateToSubscription());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* optInOptOrOut(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const data = action.payload.data;
        const userInfo = yield select(getUserInfo);
        const { id, organizations, additionalInfo: { customerNumber, residenceCategory: { id: residenceCategoryId } } } = userInfo;
        let hasOptInButton = _.has(action.payload.data, 'showOptInButton');
        let hasOptOutButton = _.has(action.payload.data, 'showOptOutButton');
        let optInButton;
        let optOutButton;
        let serviceWorkerId = null;
        let swSupervisorId = null;
        if (hasOptInButton) {
            optInButton = action.payload.data.showOptInButton;
        }
        if (hasOptOutButton) {
            optOutButton = action.payload.data.showOptOutButton;
            serviceWorkerId = data.serviceWorkerId;
            swSupervisorId = data.swSupervisorId;
        }
        let params = {
            userId: id,
            serviceConfigId: data.serviceConfig.id,
            serviceProviderId: data.serviceProvider?.id,
            serviceWorkerId: serviceWorkerId,
            swSupervisorId: swSupervisorId,
            organizationId: organizations[0].id,
            serviceProviderServiceConfigId: data.serviceProviderServiceConfigId,
            residenceCategoryId: residenceCategoryId,
            serviceTypeId: data.serviceType.id,
            requestedAt: moment.utc().format(API_DATE_TIME_FORMAT)
        };
        if (optInButton === true) {
            yield call(infoToast, I18n.t('subscription_request_placing'));
            yield fork(saga.handleAPIRequest, EnrollmentAPI.optInOptOrOutSubscription, customerNumber, params);
            yield take(ActionTypes.UPDATE_SUBSCRIPTIONS_API_SUCCESS);
            yield call(successToast, I18n.t('subscription_request_placed'));
            yield put(EnrollmentActions.fetchSubscription());
        } else if (optOutButton === true) {
            yield call(infoToast, I18n.t('subscribe_request_placing'));
            yield fork(saga.handleAPIRequest, EnrollmentAPI.optInOptOrOutSubscribed, customerNumber, params);
            yield take(ActionTypes.UPDATE_SUBSCRIBED_API_SUCCESS);
            yield call(successToast, I18n.t('subscribe_request_placed'));
            yield put(EnrollmentActions.fetchSubscribed());
        } else {
            yield call(errorToast, I18n.t('unknown_error'), 0);
        }
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* resetQrEnrollmentTourData(action) {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.qrEnrollment = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

function* resetQrEnrollmentTabTourData(action) {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.qrCodeTab = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

export default function* enrollmentSaga() {
    yield all([
        takeLatest(ActionTypes.START_ENROLLMENT_SURVEY, startEnrollmentSurvey),
        takeLatest(ActionTypes.LOAD_INCOMPLETE_SURVEYS, loadIncompleteSurveys),
        takeLatest(ActionTypes.REMOVE_INPROGRESS_DATA, removeInprogressData),
        takeLatest(ActionTypes.LOAD_PENDING_QR_CODE_SURVEYS, loadPendingQrCodeSurveys),
        takeLatest(ActionTypes.START_QR_CODE_ENROLLMENT, startQrCodeEnrollment),
        takeLatest(ActionTypes.CLEAR_PENDING_QR_CODE_SURVEYS, clearPendingQrCodeSurveys),
        takeLatest(ActionTypes.EDIT_SYNCED_SURVEY, editSyncedSurvey),
        takeLatest(ActionTypes.START_SERVICE_ENROLMENT, startServiceEnrollment),
        takeLatest(ActionTypes.START_QRCODE_SCANNING, startQRCodeScanning),
        takeLatest(ActionTypes.POST_QRCODE_SCANNING, handlePostQRCodeScanning),
        takeLatest(ActionTypes.ENROLLMET_SUBSCRIPTIONS, fetchSubscription),
        takeLatest(ActionTypes.ENROLLMET_SUBSCRIBED, fetchSubscribed),
        takeLatest(ActionTypes.OPT_IN_OUT, optInOptOrOut),
        takeLatest(ActionTypes.SUBSCRIPTIONS, subscriptions),
        takeLatest(ActionTypes.RESET_QR_ENROLLMENT_TOUR, resetQrEnrollmentTourData),
        takeLatest(ActionTypes.RESET_QR_ENROLLMENT_TAB_TOUR, resetQrEnrollmentTabTourData),
    ]);
}
