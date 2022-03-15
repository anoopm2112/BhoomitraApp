import { all, takeLatest, takeEvery, delay, put, take, fork, call, select } from 'redux-saga/effects';
import AwaitLock from 'await-lock';
import moment from 'moment';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import * as ServiceActions from './actions';
import * as DfgActions from '../dfg/actions';
import * as DashboardActions from '../dashboard/actions';
import * as ComplaintsActions from '../complaints/actions';
import { saga, utils, I18n, constants, locks } from '../../common';
import * as ServiceAPI from './api';
import * as ComplaintAPI from '../complaints/api';
import * as dfgSaga from '../dfg/saga';
import { getSideBarData } from '../dashboard/selectors';
import { getLanguage, getUserInfo } from '../dfg/common/selectors';
import { store } from '../dfg/common/store';
import {
    getIcons, getIncompleteServices,
    getPhotos, getServiceBarcode,
    getServiceItemList, getServicePayment,
    getQueued, getFailed, getProcessed, getCustomerPaymentHistory, getCustomerPaymentHistoryList
} from './selectors';
import { loadIncompleteServicesLock, customerProfileLock } from '../../common/locks';
import NetInfo from "@react-native-community/netinfo";
import {
    SurveyDataRepository, CustomerProfileRepository,
    PaymentConfigRepository, ServiceRepository,
    InvoiceRepository
} from '../../common/realm/repositories';
import { TEMPLATE_TYPES, TEMPLATE_TYPE_IDS, RESIDENCE_CATEGORIES, DOOR_STATUS } from '../dfg/constants';
import {
    ROUTE_KEYS as SERVICE_ROUTE_KEYS,
    COLLECTION_TYPE, RATE_TYPE, INVOICE_INTERVAL, PAYMENT_STATUS,
    PAYMENT_MODE, PAYMENT_TRANSACTION_STATUS, PAYMENT_TYPE
} from './constants';
import {
    ROUTE_KEYS as DASHBOARD_ROUTE_KEYS,
    APP_TOUR_STORE_KEY
} from '../dashboard/constants';
import { ROUTE_KEYS as COMPLAINT_ROUTE_KEYS } from '../complaints/constants';
import Storage from '../../common/storages';

const { API_DATE_TIME_FORMAT, DATE_FORMAT } = constants;
const {
    toastUtils: { infoToast, errorToast, successToast },
    serviceUtils: { mergeCustomerProfile },
    userUtils: { hasGtRole }
} = utils;
const { syncPaymentDataLock } = locks;

const {
    types: ActionTypes,
    setIncompleteServices,
    setDoneServices,
    setPhotos,
    navigateToServiceBarcode,
    navigateToServiceItemList,
    navigateToSpecialService,
    setServiceIcons,
    setSubscriptionResumeModalVisibility,
    setServicingResumeModalVisibility,
    setServiceExecutionSurveyDataMap,
    setCustomerProfile,
    setServicePaymentCollectionData,
    resetServicePaymentCollectionData,
    setServicePaymentCollectionItem,
    setAdvanceOutstandingPaymentData,
    setPaymentInProgress,
    updateProgress,
    addToQueue,
    removeFromQueue,
    unsetFailed,
    setProcessed,
    unsetProcessed,
    setFailed,
    removeProgress,
    setSyncingInvoices,
    resetSyncingInvoices,
    navigateToInvoiceCollectionList,
    navigateToPaymentHistory
} = ServiceActions;

const {
    initializeDynamicForm,
    navigateToDynamicFormView
} = DfgActions;

const {
    updateCount,
    navigateToCustomerDashboardSummary
} = DashboardActions;

const {
    setIncompleteComplaints
} = ComplaintsActions;

function* loadIncompleteServices() {
    yield call([loadIncompleteServicesLock, 'acquireAsync']);
    try {
        let customerProfiles = yield call([CustomerProfileRepository, 'findAll']);
        let apiSucceeded = true;
        const netInfo = yield call([NetInfo, 'fetch']);
        if (netInfo.isInternetReachable) {
            yield call(loadCustomerInvoices);
            const userInfo = yield select(getUserInfo);
            const { id: userId } = userInfo;
            const serviceDataRequest = {
                serviceExecutionDate: moment.utc().format(API_DATE_TIME_FORMAT),
                langId: (yield select(getLanguage)).langId,
                userId
            };
            if (!_.isEmpty(customerProfiles)) {
                const excludedServiceExecutionIds = [];
                const excludedComplaintIds = [];
                customerProfiles.forEach(customerProfile => {
                    const { services, complaints } = customerProfile;
                    if (services != null) {
                        Object.values(services).forEach(groupedServices => {
                            excludedServiceExecutionIds.push(..._.map(groupedServices, 'serviceExecutionId'));
                        });
                    }
                    if (complaints != null) {
                        Object.values(complaints).forEach(groupedComplaints => {
                            excludedComplaintIds.push(..._.map(groupedComplaints, 'complaintId'));
                        });
                    }
                });
                if (excludedServiceExecutionIds.length > 0) {
                    serviceDataRequest.excludedServiceExecutionIds = excludedServiceExecutionIds;
                }
                if (excludedComplaintIds.length > 0) {
                    serviceDataRequest.excludedComplaintIds = excludedComplaintIds;
                }
                yield fork(saga.handleAPIRequest, ServiceAPI.loadIncompleteServiceList, serviceDataRequest);
                const loadServiceListSuccessAction = yield take([ActionTypes.SERVICE_INCOMPLETE_API_SUCCESS, ActionTypes.SERVICE_INCOMPLETE_API_FAILED]);
                if (loadServiceListSuccessAction.type === ActionTypes.SERVICE_INCOMPLETE_API_SUCCESS) {
                    const loadServiceListSuccessActionResponse = loadServiceListSuccessAction.payload.data;
                    if (!_.isEmpty(loadServiceListSuccessActionResponse)) {
                        const downloadedServiceExecutionIds = [];
                        const downloadedComplaintIds = [];
                        for (const newProfile of loadServiceListSuccessActionResponse) {
                            const { services, complaints } = newProfile;
                            if (services != null) {
                                Object.values(services).forEach(groupedServices => {
                                    downloadedServiceExecutionIds.push(..._.map(groupedServices, 'serviceExecutionId'));
                                });
                            }
                            if (complaints != null) {
                                Object.values(complaints).forEach(groupedComplaints => {
                                    downloadedComplaintIds.push(..._.map(groupedComplaints, 'complaintId'));
                                });
                            }
                            const existingProfile = yield call([CustomerProfileRepository, 'findByQrCode'], newProfile.qrCode);
                            if (existingProfile) {
                                yield call(mergeCustomerProfile, existingProfile, newProfile, true, true);
                                yield call([CustomerProfileRepository, 'save'], existingProfile);
                            } else {
                                yield call([SurveyDataRepository, 'saveCustomerProfileSurveyData'], newProfile.surveyData);
                                delete newProfile.surveyData;
                                yield call([CustomerProfileRepository, 'save'], newProfile);
                            }
                            const existingItemIndex = _.findIndex(customerProfiles, ['qrCode', newProfile.qrCode]);
                            if (existingItemIndex > -1) {
                                customerProfiles.splice(existingItemIndex, 1, existingProfile);
                            } else {
                                customerProfiles.push(newProfile);
                            }
                        }
                        yield call(saga.handleAPIRequest, ServiceAPI.markServiceExecutionRecordsDownloadedFlag, { serviceExecutionIds: downloadedServiceExecutionIds });
                        yield call(saga.handleAPIRequest, ComplaintAPI.markComplaintRecordsDownloadedFlag, { complaintIds: downloadedComplaintIds });
                        yield call(fetchPaymentConfig);
                    }
                } else {
                    apiSucceeded = false;
                }
            } else {
                yield fork(saga.handleAPIRequest, ServiceAPI.loadIncompleteServiceList, serviceDataRequest);
                const loadServiceListSuccessAction = yield take([ActionTypes.SERVICE_INCOMPLETE_API_SUCCESS, ActionTypes.SERVICE_INCOMPLETE_API_FAILED]);
                if (loadServiceListSuccessAction.type === ActionTypes.SERVICE_INCOMPLETE_API_SUCCESS) {
                    customerProfiles = loadServiceListSuccessAction.payload.data;
                    if (!_.isEmpty(customerProfiles)) {
                        const accumulator = [];
                        const downloadedServiceExecutionIds = [];
                        const downloadedComplaintIds = [];
                        _.forEach(customerProfiles, (customerProfile) => {
                            accumulator.push(customerProfile.surveyData);
                            delete customerProfile.surveyData;
                            const { services, complaints } = customerProfile;
                            if (services != null) {
                                Object.values(services).forEach(groupedServices => {
                                    downloadedServiceExecutionIds.push(..._.map(groupedServices, 'serviceExecutionId'));
                                });
                            }
                            if (complaints != null) {
                                Object.values(complaints).forEach(groupedComplaints => {
                                    downloadedComplaintIds.push(..._.map(groupedComplaints, 'complaintId'));
                                });
                            }
                        });
                        yield call([SurveyDataRepository, 'saveCustomerProfileSurveyData'], accumulator);
                        yield call([CustomerProfileRepository, 'saveAll'], customerProfiles);
                        yield call(saga.handleAPIRequest, ServiceAPI.markServiceExecutionRecordsDownloadedFlag, { serviceExecutionIds: downloadedServiceExecutionIds });
                        yield call(saga.handleAPIRequest, ComplaintAPI.markComplaintRecordsDownloadedFlag, { complaintIds: downloadedComplaintIds });
                        yield call(fetchPaymentConfig);
                    }
                } else {
                    apiSucceeded = false;
                }
            }
        }
        const sideBarData = yield select(getSideBarData);
        const { currentRoute } = sideBarData;
        // Post process customerProfiles (if it is not empty) to create list of cards
        if (currentRoute === SERVICE_ROUTE_KEYS.SERVICEINPROGRESS && !_.isEmpty(customerProfiles)) {
            const processedData = customerProfiles.flatMap((customerProfile) => {
                const { services } = customerProfile;
                if (services) {
                    const sortedServices = _(services)
                        .toPairs()
                        .orderBy((pair) => moment(pair[0], DATE_FORMAT), ['desc'])
                        .fromPairs()
                        .value();
                    return Object.keys(sortedServices).map(serviceExecutionDate => {
                        const card = _.cloneDeep(customerProfile);
                        card.serviceExecutionDate = serviceExecutionDate;
                        card.services = sortedServices[serviceExecutionDate];
                        return card;
                    });
                } else return [];
            });
            yield put(setIncompleteServices(processedData));
            let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
            metadata = metadata ? JSON.parse(metadata) : {};
            if (metadata.appTour !== undefined) {
                metadata.appTour.scanQrCodeService = false;
            }
            yield put(DashboardActions.setAppTourData(metadata));
            yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
        } else if (currentRoute === COMPLAINT_ROUTE_KEYS.COMPLAINTSINPROGRESS && !_.isEmpty(customerProfiles)) {
            const processedData = customerProfiles.flatMap((customerProfile) => {
                const { complaints } = customerProfile;
                if (complaints) {
                    const sortedComplaints = _(complaints)
                        .toPairs()
                        .orderBy((pair) => moment(pair[0], DATE_FORMAT), ['desc'])
                        .fromPairs()
                        .value();
                    return Object.keys(sortedComplaints).map(complaintExecutionDate => {
                        const card = _.cloneDeep(customerProfile);
                        card.complaintExecutionDate = complaintExecutionDate;
                        card.complaints = sortedComplaints[complaintExecutionDate];
                        return card;
                    });
                } else return [];
            });
            yield put(setIncompleteComplaints(processedData));
        } else if (currentRoute === DASHBOARD_ROUTE_KEYS.SUMMARY) {
            const servicePending = yield call([CustomerProfileRepository, 'getServicePendingCount']);
            const complaintPending = yield call([CustomerProfileRepository, 'getComplaintPendingCount']);
            yield put(updateCount({ servicePending, complaintPending }));
        }
        return apiSucceeded;
    } catch {
        // NOOP
    } finally {
        loadIncompleteServicesLock.release();
    }

}

function* loadCustomerInvoices() {
    const userInfo = yield select(getUserInfo);
    const { id: serviceWorkerId } = userInfo;
    const invoicePaymentStatusIds = [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.PARTIALLY_PAID];
    const excludedInvoiceIds = yield call([InvoiceRepository, 'findAllInvoiceIds']);
    yield fork(saga.handleAPIRequest, ServiceAPI.fetchCustomerInvoices, { serviceWorkerId, invoicePaymentStatusIds, excludedInvoiceIds });
    const fetchCustomerInvoicesAction = yield take([ActionTypes.FETCH_CUSTOMER_INVOICES_API_SUCCESS, ActionTypes.FETCH_CUSTOMER_INVOICES_API_FAILED]);
    if (fetchCustomerInvoicesAction.type === ActionTypes.FETCH_CUSTOMER_INVOICES_API_SUCCESS) {
        const fetchCustomerInvoicesActionPayload = fetchCustomerInvoicesAction.payload.data;
        const invoices = Object.values(fetchCustomerInvoicesActionPayload.details).flat();
        if (_.isEmpty(invoices)) {
            return;
        }
        if ((yield call([CustomerProfileRepository, 'isEmpty']))) {
            yield call([InvoiceRepository, 'saveAll'], invoices);
        } else {
            for (const invoice of invoices) {
                const { customerNumber, netPayable, summary: { paymentConfigId, serviceConfigId } } = invoice;
                if ((yield call([CustomerProfileRepository, 'findPaymentsByCustomerNumberAndPaymentConfigIdAndServiceConfigId'], customerNumber, paymentConfigId, serviceConfigId))) {
                    yield call([CustomerProfileRepository, 'applyOutstandingOffset'], customerNumber, paymentConfigId, serviceConfigId, netPayable);
                }
                yield call([InvoiceRepository, 'save'], invoice);
            }
        }
    }
}

function* fetchPaymentConfig() {
    const userInfo = yield select(getUserInfo);
    const accessAllowed = yield call(hasGtRole, userInfo);
    if (!accessAllowed) {
        return;
    }
    const { organizations: [organization] } = userInfo;
    if (organization) {
        const { serviceProviders: [serviceProvider] } = organization;
        if (serviceProvider) {
            const paymentConfigRequest = {
                serviceProviderId: serviceProvider.id,
                langId: (yield select(getLanguage)).langId
            };
            yield fork(saga.handleAPIRequest, ServiceAPI.fetchPaymentConfig, paymentConfigRequest);
            const fetchPaymentConfigAction = yield take([ActionTypes.PAYMENT_CONFIG_API_SUCCESS, ActionTypes.PAYMENT_CONFIG_API_FAILED]);
            if (fetchPaymentConfigAction.type === ActionTypes.PAYMENT_CONFIG_API_SUCCESS) {
                const fetchPaymentConfigActionResponse = fetchPaymentConfigAction.payload.data;
                yield call([PaymentConfigRepository, 'saveAll'], fetchPaymentConfigActionResponse);
            }
        }
    }
}

function* loadDoneServices() {
    yield delay(10);
    let data = [];
    yield put(setDoneServices(data));
}

function* fetchServices() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = { langId: langId.langId };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, ServiceAPI.fetchSpecialServiceRequests, customerNumber, params);
        yield put(navigateToSpecialService());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
        yield put(navigateToCustomerDashboardSummary());
    }
}

function* specialServices() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(navigateToSpecialService());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* fetchServiceIcons(action) {
    let apiSucceeded = true;
    const { forceUpdate } = action.payload.data || {};
    if (!forceUpdate) {
        const icons = yield select(getIcons);
        if (!_.isEmpty(icons)) {
            return apiSucceeded;
        }
        const savedIcons = yield call([ServiceRepository, 'findAll']);
        if (!_.isEmpty(savedIcons)) {
            yield put(setServiceIcons(transformServiceIconsData(savedIcons)));
            return apiSucceeded;
        }
    }
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const serviceIconApiRequest = {
            type: 'dropdown',
            langId: (yield select(getLanguage)).langId
        };
        yield fork(saga.handleAPIRequest, ServiceAPI.loadServiceIcons, serviceIconApiRequest);
        const loadServiceIconsSuccessAction = yield take([ActionTypes.FETCH_SERVICE_ICONS_API_SUCCESS, ActionTypes.FETCH_SERVICE_ICONS_API_FAILED]);
        if (loadServiceIconsSuccessAction.type === ActionTypes.FETCH_SERVICE_ICONS_API_SUCCESS) {
            let loadServiceIconsSuccessActionResponse = loadServiceIconsSuccessAction.payload.data || [];
            if (!_.isEmpty(loadServiceIconsSuccessActionResponse)) {
                yield call([ServiceRepository, 'saveAll'], loadServiceIconsSuccessActionResponse);
                yield put(setServiceIcons(transformServiceIconsData(loadServiceIconsSuccessActionResponse)));
            }
        } else {
            apiSucceeded = false;
        }
    }
    return apiSucceeded;
}

function transformServiceIconsData(data) {
    const transformedData = _.reduce(data, (result, value, key) => {
        result[value.id] = {
            id: value.id,
            name: value.name,
            icon: value.icon
        }
        return result;
    }, {});
    return transformedData;
}

function* startMobileServiceEnrollment(action) {
    const { qrCode, customerProfile } = action.payload.data;
    const { customerEnrollmentId, residenceCategoryId } = customerProfile;
    const templateType = residenceCategoryId === RESIDENCE_CATEGORIES.RESIDENTIAL ? TEMPLATE_TYPES.SERVICE_ENROLLMENT_RESIDENTIAL :
        residenceCategoryId === RESIDENCE_CATEGORIES.NON_RESIDENTIAL ? TEMPLATE_TYPES.SERVICE_ENROLLMENT_NON_RESIDENTIAL : undefined;
    if (templateType === undefined) {
        yield call(errorToast, I18n.t('residence_category_unavailable'));
        return;
    }
    const templateTypeId = TEMPLATE_TYPE_IDS[templateType];
    const initializer = {
        templateTypeId,
        surveyFinishedAction: function* surveyFinishedAction() {
            yield put(navigateToServiceBarcode({ qrCode }));
        }
    };
    const { configs: { items: { serviceEnrollmentId } } } = yield select(getServiceBarcode);
    const surveyId = serviceEnrollmentId;
    if (surveyId) {
        initializer.surveyDataKey = surveyId;
        initializer.setResumeModalVisibility = (data) => setSubscriptionResumeModalVisibility(data);
    } else {
        initializer.additionalInfo = {
            customerEnrollmentId
        }
    }
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.enrollCustomerService = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    yield put(initializeDynamicForm(initializer));
    yield put(navigateToDynamicFormView());
}

function* startServiceExecution(action) {
    const { customerProfile, item } = action.payload.data;
    const { position = {}, configs: { serviceExecutionSurveyDataMap } } = yield select(getServiceItemList);
    const { customerEnrollmentId, customerNumber } = customerProfile;
    const { id: serviceConfigId, templateTypeId, version, serviceExecutionId, serviceExecutionDate, paymentConfigId } = item;
    const paymentConfig = yield call([PaymentConfigRepository, 'findById'], paymentConfigId);
    if (!paymentConfig) {
        yield call(errorToast, I18n.t('payment_config_missing'));
        return;
    }
    const { coords: { latitude, longitude } = {} } = position;
    let invoice;
    let invoiceUpdated = false;
    let quantity = 0;
    const initializer = {
        templateTypeId,
        version,
        customValidations: {
            SERVICE_WASTE_WEIGHT: function* validateQuantity(value) {
                quantity = parseFloat(value);
                invoice = yield call([InvoiceRepository, 'findByServiceExecutionId'], serviceExecutionId);
                if (invoice) {
                    const { totalPayable: oldTotalPayable, totalPaid, summary, metadata } = invoice;
                    const { collectionTypeId, rateTypeId, fixedAmount, perUnitAmount, slabs } = summary;
                    if (collectionTypeId === COLLECTION_TYPE.COLLECTION) {
                        const newTotalPayable = computeCollectionTotalPayable(quantity, rateTypeId, fixedAmount, perUnitAmount, slabs);
                        if (newTotalPayable !== oldTotalPayable && totalPaid > 0) {
                            yield call(errorToast, I18n.t('cannot_change_quantity'));
                            quantity = 0;
                            return false;
                        }
                        const outstandingOffset = newTotalPayable - oldTotalPayable;
                        if (outstandingOffset > 0) {
                            // Here outstandingOffset is positive. 
                            // Therefore, the offset would actually increase outstanding amount
                            yield call([CustomerProfileRepository, 'applyOutstandingOffset'], customerNumber, paymentConfigId, serviceConfigId, outstandingOffset);
                        } else if (outstandingOffset < 0) {
                            const payment = yield call([CustomerProfileRepository, 'findPaymentsByCustomerNumberAndPaymentConfigIdAndServiceConfigId'], customerNumber, paymentConfigId, serviceConfigId);
                            const { outstanding } = payment;
                            if (outstanding >= Math.abs(outstandingOffset)) {
                                // Here outstandingOffset is negative. 
                                // Therefore, the offset would actually decrease outstanding amount
                                yield call([CustomerProfileRepository, 'applyOutstandingOffset'], customerNumber, paymentConfigId, serviceConfigId, outstandingOffset);
                            } else {
                                // In this case there is no sufficient funds available in outstanding amount.
                                // Therefore set outstanding amount to 0 by subtracting the same amount as offset
                                yield call([CustomerProfileRepository, 'applyOutstandingOffset'], customerNumber, paymentConfigId, serviceConfigId, -outstanding);
                                // Calculate advance offset and update advance amount
                                const advanceOffset = Math.abs(outstandingOffset) - outstanding;
                                yield call([CustomerProfileRepository, 'applyAdvanceOffset'], customerNumber, paymentConfigId, serviceConfigId, advanceOffset);
                            }
                        }
                        invoice.totalPayable = newTotalPayable;
                        invoice.netPayable = invoice.netPayable + outstandingOffset;
                        metadata.quantity = quantity;
                        metadata.waitingForSync = true;
                        yield call([InvoiceRepository, 'save'], invoice);
                        invoiceUpdated = true;
                    }
                }
                return true;
            }
        },
        surveyFinishedAction: function* surveyFinishedAction(surveyData) {
            const { dataSources } = surveyData;
            const doorStatus = dataSources['doorStatus'];
            if (doorStatus === DOOR_STATUS.IS_OPEN && invoice === undefined) {
                const { specialService, collectionType: { id: collectionTypeId }, rateType: { id: rateTypeId }, fixedAmount, perUnitAmount, slabs } = paymentConfig;
                if (collectionTypeId === COLLECTION_TYPE.COLLECTION) {
                    const totalPayable = computeCollectionTotalPayable(quantity, rateTypeId, fixedAmount, perUnitAmount, slabs);
                    if (specialService) {
                        yield call([CustomerProfileRepository, 'createSpecialServicePaymentIfNotPresent'], customerNumber, paymentConfigId, serviceConfigId);
                    }
                    yield call([CustomerProfileRepository, 'applyOutstandingOffset'], customerNumber, paymentConfigId, serviceConfigId, totalPayable);
                    const payment = yield call([CustomerProfileRepository, 'findPaymentsByCustomerNumberAndPaymentConfigIdAndServiceConfigId'], customerNumber, paymentConfigId, serviceConfigId);
                    const { advance, outstanding } = payment;
                    const invoiceDate = moment().startOf('day').toDate();
                    invoice = {
                        invoiceNumber: uuidv4(),
                        customerNumber,
                        invoiceIntervalId: INVOICE_INTERVAL.DATE,
                        invoiceDate,
                        invoicePeriod: moment(invoiceDate).format('MMM YYYY'),
                        dueDate: invoiceDate,
                        totalPayable,
                        netPayable: totalPayable,
                        outstandingAfterInvoiceGeneration: outstanding,
                        advanceAfterInvoiceGeneration: advance,
                        invoicePaymentStatusId: PAYMENT_STATUS.UNPAID,
                        summary: {
                            paymentConfigId,
                            serviceConfigId,
                            serviceExecutionId,
                            collectionTypeId,
                            rateTypeId,
                            fixedAmount,
                            perUnitAmount,
                            slabs
                        },
                        metadata: {
                            serviceExecutionDate: moment(serviceExecutionDate, DATE_FORMAT).startOf('day').toDate(),
                            quantity,
                            waitingForSync: true
                        }
                    };
                    yield call([InvoiceRepository, 'save'], invoice);
                    invoiceUpdated = true;
                }
            }
            if (invoiceUpdated) {
                yield call(prepareInvoiceForSyncing, invoice);
            }
            yield put(navigateToServiceItemList({ customerProfile }));
        }
    };
    const surveyId = serviceExecutionSurveyDataMap[serviceExecutionId];
    if (surveyId) {
        initializer.surveyDataKey = surveyId;
        initializer.setResumeModalVisibility = (data) => setServicingResumeModalVisibility(data);
    } else {
        initializer.additionalInfo = {
            customerEnrollmentId,
            serviceExecutionId,
            serviceCompletionDate: moment.utc().format(API_DATE_TIME_FORMAT)
        }
        if (latitude && longitude) {
            initializer.additionalInfo['location'] = JSON.stringify({ latitude, longitude });
        }
    }
    yield put(initializeDynamicForm(initializer));
    yield put(navigateToDynamicFormView());
}

function computeCollectionTotalPayable(quantity, rateTypeId, fixedAmount, perUnitAmount, slabs) {
    let totalPayable = 0;
    switch (rateTypeId) {
        case RATE_TYPE.FIXED_RATE:
            totalPayable = fixedAmount;
            break;
        case RATE_TYPE.SLAB_RATE:
            const slab = _.find(slabs, (item) => {
                return item.startVal <= quantity && quantity <= item.endVal;
            });
            if (slab) {
                // totalPayable = slab.pricePerUnit * quantity;
                totalPayable = slab.pricePerUnit;
            }
            break;
        case RATE_TYPE.PER_UNIT_RATE:
            totalPayable = perUnitAmount * quantity;
            break;
    }
    return totalPayable;
}

function* prepareInvoiceForSyncing(invoice) {
    const processed = yield select(getProcessed);
    const queued = yield select(getQueued);
    const { invoiceNumber } = invoice;
    if (processed.includes(invoiceNumber)) {
        yield put(unsetProcessed(invoiceNumber));
    }
    if (!queued.includes(invoiceNumber)) {
        yield put(addToQueue(invoiceNumber));
    }
    yield put(ServiceActions.syncPaymentData());
}

function* generateServiceExecutionSurveyDataMap(action) {
    const customerProfile = action.payload.data;
    const serviceExecutionSurveyDataMap = {};
    const { customerEnrollmentId, services = {} } = customerProfile;
    for (const serviceExecutionDate in services) {
        const groupedServices = services[serviceExecutionDate];
        for (const service of groupedServices) {
            const { templateTypeId } = service;
            const additionalInfo = [
                { key: 'customerEnrollmentId', value: customerEnrollmentId },
                { key: 'serviceExecutionId', value: service.serviceExecutionId }
            ];
            const { surveyId } = yield call(dfgSaga.isSurveyDataPresentInStorage, { templateTypeId, additionalInfo });
            if (surveyId) {
                serviceExecutionSurveyDataMap[service.serviceExecutionId] = surveyId;
            }
        };
    }
    yield put(setServiceExecutionSurveyDataMap({ initDone: true, serviceExecutionSurveyDataMap }));
}

function* newServiceRequest(action) {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.addSpecialService = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const langId = yield select(getLanguage);
        let params = { langId: langId.langId };
        const userInfo = yield select(getUserInfo);
        const { organizations, additionalInfo: { customerNumber } } = userInfo;
        const organizationId = organizations[0].id;
        yield fork(saga.handleAPIRequest, ServiceAPI.getSpecialService, params, organizationId, customerNumber);
        yield take(ActionTypes.SPECIAL_SERVICE_API_SUCCESS);
        yield put(ServiceActions.navigateToNewServiceRequest(action));
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* updateServiceRequest(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const userInfo = yield select(getUserInfo);
        const { id: userId } = userInfo;
        const { organizations, additionalInfo: { customerNumber, residenceCategory: { id: residenceCategoryId } } } = userInfo;
        if (action.payload.data.comment !== '' && action.payload.data.selectedService !== undefined && action.payload.data.newSheduleDate !== '' && action.payload.data.newRequestedDate !== '') {
            const requestedDate = moment(action.payload.data.newSheduleDate).format();
            let params = {
                userId: userId,
                serviceConfigId: action.payload.data.selectedService?.serviceConfigId,
                requestedDate: requestedDate,
                serviceProviderId: action.payload.data.selectedService.serviceProviderId,//dropdown data
                serviceWorkerId: action.payload.data.selectedService.serviceWorkerId,
                swSupervisorId: action.payload.data.selectedService.swSupervisorId,
                organizationId: organizations[0].id,
                serviceProviderServiceConfigId: action.payload.data.selectedService?.id,
                residenceCategoryId: residenceCategoryId,
                serviceTypeId: action.payload.data.selectedService?.serviceTypeId,
                comment: action.payload.data.comment,
                requestedAt: moment.utc().format(API_DATE_TIME_FORMAT)
            };
            if (action.payload.data.specialServiceRequestId !== undefined) {
                yield call(infoToast, I18n.t('service_request_updating'));
                yield fork(saga.handleAPIRequest, ServiceAPI.updateServiceRequestById, action.payload.data.specialServiceRequestId, customerNumber, params);
                const updateServiceRequestAction = yield take([ActionTypes.UPDATE_SERVICE_REQUEST_BY_ID_API_SUCCESS, ActionTypes.UPDATE_SERVICE_REQUEST_BY_ID_API_FAILED]);
                if (updateServiceRequestAction.type === ActionTypes.UPDATE_SERVICE_REQUEST_BY_ID_API_SUCCESS) {
                    yield call(successToast, I18n.t('service_request_updated_successfully'));
                    yield delay(1000);
                    yield put(ServiceActions.fetchServices());
                }
            } else {
                yield call(infoToast, I18n.t('service_request_updating'));
                yield fork(saga.handleAPIRequest, ServiceAPI.updateServiceRequest, customerNumber, params);
                const updateServiceRequestAction = yield take([ActionTypes.UPDATE_SERVICE_REQUEST_API_SUCCESS, ActionTypes.UPDATE_SERVICE_REQUEST_API_FAILED]);
                if (updateServiceRequestAction.type === ActionTypes.UPDATE_SERVICE_REQUEST_API_SUCCESS) {
                    yield call(successToast, I18n.t('service_request_updated_successfully'));
                    yield delay(1000);
                    yield put(ServiceActions.fetchServices());
                }
            }
        } else {
            yield call(infoToast, I18n.t('enter_valid_datas'), 1);
        }
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* getSpecialServiceById(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const specialServiceRequestId = action.payload.data;
        const langId = yield select(getLanguage);
        let params = { langId: langId.langId };
        const userInfo = yield select(getUserInfo);
        const { additionalInfo: { customerNumber } } = userInfo;
        yield fork(saga.handleAPIRequest, ServiceAPI.getSpecialServiceById, customerNumber, specialServiceRequestId, params);
        yield take(ActionTypes.FETCH_SPECIAL_SERVICE_BY_ID_API_SUCCESS);
        yield call(newServiceRequest, action);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* deleteSpecialServiceRequest(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        const userInfo = yield select(getUserInfo);
        const { additionalInfo: { customerNumber } } = userInfo;
        yield call(infoToast, I18n.t('cancel_special_service_request'));
        yield fork(saga.handleAPIRequest, ServiceAPI.deleteSpecialServiceRequest, customerNumber, action.payload.data);
        yield call(successToast, I18n.t('special_service_successfully_cancelled'));
        yield take(ActionTypes.DELETE_SPECIAL_SERVICE_REQUEST_SUCCESS);
        yield put(ServiceActions.fetchServices());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* fetchServiceHistory() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const langId = yield select(getLanguage);
    let params = { langId: langId.langId };
    yield fork(saga.handleAPIRequest, ServiceAPI.fetchServiceHistory, customerNumber, params);
}

function* serviceHistory() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(ServiceActions.navigateToServiceHistory());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'), 0);
    }
}

function* loadCustomerProfile(action) {
    const { qrCode } = action.payload.data;
    const customerProfile = yield call([CustomerProfileRepository, 'findByQrCode'], qrCode);
    const { customerEnrollmentId, residenceCategoryId, photoId } = customerProfile;
    const customerPhoto = yield call([SurveyDataRepository, 'findPhotoById'], customerEnrollmentId, photoId);
    const items = {};
    items.customerEnrollmentId = customerEnrollmentId;
    const additionalInfo = [{ key: 'customerEnrollmentId', value: customerEnrollmentId }];
    const { surveyId: qrCodeEnrollmentId } = yield call(dfgSaga.isSurveyDataPresentInStorage,
        { templateTypeId: TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.QR_CODE_ENROLLMENT], additionalInfo });
    items.qrCodeEnrollmentId = qrCodeEnrollmentId;
    const serviceEnrollmentTemplateType = residenceCategoryId === RESIDENCE_CATEGORIES.RESIDENTIAL ? TEMPLATE_TYPES.SERVICE_ENROLLMENT_RESIDENTIAL :
        residenceCategoryId === RESIDENCE_CATEGORIES.NON_RESIDENTIAL ? TEMPLATE_TYPES.SERVICE_ENROLLMENT_NON_RESIDENTIAL : undefined;
    if (serviceEnrollmentTemplateType) {
        const { surveyId: serviceEnrollmentId } = yield call(dfgSaga.isSurveyDataPresentInStorage,
            { templateTypeId: TEMPLATE_TYPE_IDS[serviceEnrollmentTemplateType], additionalInfo });
        items.serviceEnrollmentId = serviceEnrollmentId;
    }
    yield put(setCustomerProfile({ initDone: true, customerProfile, customerPhoto, items }));
}

function* loadPhotos(action) {
    const { partialRefresh } = action.payload.data || {};
    const { data = [] } = yield select(getIncompleteServices);
    const photos = yield select(getPhotos);
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
        yield put(setPhotos(output));
    }
}

function* setServiceExecuted(action) {
    const { customerEnrollmentId, serviceExecutionId } = action.payload.data;
    customerProfileLock[customerEnrollmentId] = customerProfileLock[customerEnrollmentId] || new AwaitLock();
    yield call([customerProfileLock[customerEnrollmentId], 'acquireAsync']);
    const customerProfile = yield call([CustomerProfileRepository, 'findByCustomerEnrollmentId'], customerEnrollmentId);
    const { services } = customerProfile;
    for (const serviceExecutionDate in services) {
        const groupedServices = services[serviceExecutionDate];
        const targetIndex = _.findIndex(groupedServices, ['serviceExecutionId', serviceExecutionId]);
        if (targetIndex > -1) {
            groupedServices.splice(targetIndex, 1);
            if (groupedServices.length < 1) {
                delete services[serviceExecutionDate];
            }
            yield call([CustomerProfileRepository, 'save'], customerProfile);
            const sideBarData = yield select(getSideBarData);
            const { currentRoute } = sideBarData;
            if (currentRoute === SERVICE_ROUTE_KEYS.SERVICEINPROGRESS) {
                yield call(loadIncompleteServices);
            } else if (currentRoute === DASHBOARD_ROUTE_KEYS.SUMMARY) {
                const servicePending = yield call([CustomerProfileRepository, 'getServicePendingCount']);
                yield put(updateCount({ servicePending }));
            }
            break;
        }
    }
    yield call([customerProfileLock[customerEnrollmentId], 'release']);
    if (!customerProfileLock[customerEnrollmentId].acquired) {
        delete customerProfileLock[customerEnrollmentId];
    }
}

function* scanQrCodePendingServiceTourData(params) {
    let metadata = yield call([Storage, 'getItem'], APP_TOUR_STORE_KEY);
    metadata = metadata ? JSON.parse(metadata) : {};
    if (metadata.appTour !== undefined) {
        metadata.appTour.scanQrCodePendingService = false;
    }
    yield put(DashboardActions.setAppTourData(metadata));
    yield call([Storage, 'setItem'], APP_TOUR_STORE_KEY, JSON.stringify(metadata));
}

function* generateServicePaymentCollectionData(action) {
    let items = {};
    const { customerNumber, collectionTypeId } = action.payload.data;
    const descriptor = collectionTypeId === COLLECTION_TYPE.COLLECTION ? 'metadata.serviceExecutionDate' : 'invoicePeriod';
    const invoices = yield call([InvoiceRepository, 'findByCustomerNumberAndCollectionTypeId'], customerNumber, collectionTypeId, { descriptor, reverse: true });
    if (!_.isEmpty(invoices)) {
        items = _.groupBy(invoices, (item) => collectionTypeId === COLLECTION_TYPE.COLLECTION ?
            moment(item.metadata.serviceExecutionDate).format(DATE_FORMAT) :
            item.invoicePeriod + ' (' + moment(item.summary.subscribedFrom).format(DATE_FORMAT) + ' - ' + moment(item.summary.subscribedTo).format(DATE_FORMAT) + ')');
    }
    yield put(setServicePaymentCollectionData({ initDone: true, customerNumber, collectionTypeId, items }));
}

function* populateAdvanceOutstandingPaymentData(action) {
    const item = action.payload.data;
    const { customerNumber, summary: { paymentConfigId, serviceConfigId } } = item;
    const payment = yield call([CustomerProfileRepository, 'findPaymentsByCustomerNumberAndPaymentConfigIdAndServiceConfigId'], customerNumber, paymentConfigId, serviceConfigId);
    if (payment) {
        yield put(setAdvanceOutstandingPaymentData(payment));
    }
}

function* updatePaymentCollection(action) {
    yield put(setPaymentInProgress(true));
    yield delay(1000);
    const { values } = action.payload.data;
    const servicePayment = yield select(getServicePayment);
    let { payment, collection: { item: { invoiceNumber } } } = servicePayment;
    let item = yield call([InvoiceRepository, 'findByInvoiceNumber'], invoiceNumber);
    let output = yield call(processPayment, values, null, payment, item);
    payment = output.payment;
    item = output.item;
    if (payment.advance > 0) {
        const autoSettlementTransactionId = output.transactionId;
        const { customerNumber, summary: { paymentConfigId } } = item;
        const invoices = yield call([InvoiceRepository, 'findByCustomerNumberAndInvoicePaymentStatusIdAndPaymentConfigId'],
            customerNumber, PAYMENT_STATUS.PARTIALLY_PAID, paymentConfigId,
            { descriptor: 'invoiceDate', reverse: false });
        if (!_.isEmpty(invoices)) {
            for (const invoice of invoices) {
                output = yield call(processPayment, null, autoSettlementTransactionId, payment, invoice);
                payment = output.payment;
                if (payment.advance === 0) {
                    break;
                }
            }
        }
    }
    yield put(setAdvanceOutstandingPaymentData(payment));
    yield put(setServicePaymentCollectionItem(item));
    yield put(setPaymentInProgress(false));
    yield call(successToast, I18n.t('payment_details_updated_successfully'));
}

function* processPayment(values, autoSettlementTransactionId, payment, item) {
    const userInfo = yield select(getUserInfo);
    const { id: paidBy } = userInfo;
    let netPayable, totalPaid, outstandingAfterLastPayment, advanceAfterLastPayment,
        invoicePaymentStatusId, invoicePaymentLastTransactionStatusId, totalPaidAfterPayment,
        outstandingAfterPayment, advanceAfterPayment, invoicePaymentTypeId,
        invoicePaymentTransactionStatusId, advance, balance;
    const totalPaidBeforePayment = item.totalPaid;
    const outstandingBeforePayment = payment.outstanding;
    const advanceBeforePayment = payment.advance;
    const transactionId = uuidv4();
    const amount = autoSettlementTransactionId ? 0 :
        _.isEmpty(values.amount) ? 0 :
            parseFloat(values.amount);
    const extraAmount = autoSettlementTransactionId ? null :
        _.isEmpty(values.extraAmount) ? null :
            parseFloat(values.extraAmount);
    let outstandingOffset, advanceOffset;
    if (amount >= item.netPayable) {
        balance = 0;
        outstandingOffset = -item.netPayable;
        advanceOffset = amount - item.netPayable;
        totalPaidAfterPayment = totalPaidBeforePayment + amount;
    } else {
        balance = item.netPayable - amount;
        if (balance <= advanceBeforePayment) {
            advance = balance;
        } else {
            advance = advanceBeforePayment;
        }
        balance = balance - advance;
        outstandingOffset = -(amount + advance);
        advanceOffset = -advance;
        totalPaidAfterPayment = totalPaidBeforePayment + amount + advance;
    }
    const { customerNumber, summary: { paymentConfigId, serviceConfigId } } = item;
    if (outstandingOffset) {
        yield call([CustomerProfileRepository, 'applyOutstandingOffset'], customerNumber, paymentConfigId, serviceConfigId, outstandingOffset);
    }
    if (advanceOffset) {
        yield call([CustomerProfileRepository, 'applyAdvanceOffset'], customerNumber, paymentConfigId, serviceConfigId, advanceOffset);
    }
    payment = yield call([CustomerProfileRepository, 'findPaymentsByCustomerNumberAndPaymentConfigIdAndServiceConfigId'], customerNumber, paymentConfigId, serviceConfigId);
    netPayable = balance;
    totalPaid = totalPaidAfterPayment;
    outstandingAfterLastPayment = payment.outstanding;
    advanceAfterLastPayment = payment.advance;
    invoicePaymentStatusId = netPayable ? PAYMENT_STATUS.PARTIALLY_PAID : PAYMENT_STATUS.PAID;
    if (autoSettlementTransactionId || values.paymentMode === PAYMENT_MODE.OFFLINE) {
        invoicePaymentTypeId = PAYMENT_TYPE.SW_OFFLINE;
        invoicePaymentTransactionStatusId = PAYMENT_TRANSACTION_STATUS.PAYMENT_SUCCESS;
        invoicePaymentLastTransactionStatusId = PAYMENT_TRANSACTION_STATUS.PAYMENT_SUCCESS;
    } else {
        invoicePaymentTypeId = PAYMENT_TYPE.SW_ONLINE;
        // TODO: Set invoicePaymentTransactionStatusId and
        // invoicePaymentLastTransactionStatusId once the
        // payment gateway integration is completed
    }
    outstandingAfterPayment = outstandingAfterLastPayment;
    advanceAfterPayment = advanceAfterLastPayment;
    item.netPayable = netPayable;
    item.totalPaid = totalPaid;
    item.outstandingAfterLastPayment = outstandingAfterLastPayment;
    item.advanceAfterLastPayment = advanceAfterLastPayment;
    item.invoicePaymentStatusId = invoicePaymentStatusId;
    item.invoicePaymentLastTransactionStatusId = invoicePaymentLastTransactionStatusId;
    item.extraAmount = extraAmount;
    item.paymentHistory.push({
        transactedAt: moment.utc().format(API_DATE_TIME_FORMAT),
        amount,
        totalPaidBeforePayment,
        totalPaidAfterPayment,
        outstandingBeforePayment,
        outstandingAfterPayment,
        advanceBeforePayment,
        advanceAfterPayment,
        isAccounted: true,
        paidBy,
        invoicePaymentTypeId,
        invoicePaymentTransactionStatusId,
        status: 1,
        transactionId,
        advance,
        autoSettled: autoSettlementTransactionId ? true : false,
        autoSettlementTransactionId,
        balance
    });
    item.metadata.waitingForSync = true;
    item = yield call([InvoiceRepository, 'save'], item);
    yield call(prepareInvoiceForSyncing, item);
    return { payment, item, transactionId };
}

function* syncPaymentData() {
    yield call([syncPaymentDataLock, 'acquireAsync']);
    try {
        const netInfo = yield call([NetInfo, 'fetch']);
        if (!netInfo.isInternetReachable) {
            return;
        }
        let isApiSuccess = false;
        const invoiceNumbers = yield call([InvoiceRepository, 'findInvoiceNumberByWaitingForSync'], true);
        if (_.isNil(invoiceNumbers)) {
            return;
        }
        yield put(setSyncingInvoices(invoiceNumbers));
        const items = yield call([InvoiceRepository, 'findByInvoiceNumberIn'],
            invoiceNumbers, [["customerNumber", false], ["summary.paymentConfigId", false]]);
        const queued = yield select(getQueued);
        const failed = yield select(getFailed);
        for (const paymentData of items) {
            const {
                invoiceNumber,
                summary: {
                    id: summaryId, paymentConfigId,
                    serviceConfigId
                },
                paymentHistory
            } = paymentData;
            yield put(updateProgress({ [invoiceNumber]: 0 }));
            if (queued.includes(invoiceNumber)) {
                yield put(removeFromQueue(invoiceNumber));
            }
            if (failed.includes(invoiceNumber)) {
                yield put(unsetFailed(invoiceNumber));
            }
            if (!_.isNull(summaryId)) {
                paymentData.summary = {
                    id: summaryId,
                    paymentConfigId,
                    serviceConfigId
                }
            }
            _.remove(paymentHistory, (item) => !_.isNull(item.id));
            yield fork(saga.handleAPIRequest, ServiceAPI.syncPaymentData,
                paymentData,
                invoiceNumber,
                (invoiceNumber, progress) => {
                    store.dispatch(updateProgress({
                        [invoiceNumber]: progress
                    }));
                }
            );
            const paymentDataSyncApiAction = yield take([ActionTypes.SYNC_PAYMENT_DATA_API_SUCCESS, ActionTypes.SYNC_PAYMENT_DATA_API_FAILED]);
            if (paymentDataSyncApiAction.type === ActionTypes.SYNC_PAYMENT_DATA_API_SUCCESS) {
                if (!isApiSuccess) {
                    isApiSuccess = true;
                }
                const paymentDataSyncApiResponse = paymentDataSyncApiAction.payload.data;
                yield call([InvoiceRepository, 'updateInvoiceIds'], paymentDataSyncApiResponse, invoiceNumber);
                yield put(setProcessed(invoiceNumber));
            } else if (paymentDataSyncApiAction.type === ActionTypes.SYNC_PAYMENT_DATA_API_FAILED) {
                yield put(setFailed(invoiceNumber));
            }
            yield put(removeProgress(invoiceNumber));
            yield delay(1000);
        }
        if (isApiSuccess) {
            const servicePayment = yield select(getServicePayment);
            const { collection: { configs: { customerNumber, collectionTypeId } } } = servicePayment;
            if (customerNumber) {
                yield call(generateServicePaymentCollectionData, { payload: { data: { customerNumber, collectionTypeId } } });
            }
        }
        yield put(resetSyncingInvoices());
    } catch (error) {
        // NOOP
        console.tron.logImportant({ error });
    } finally {
        yield call([syncPaymentDataLock, 'release']);
    }
}

function* deleteInvoice(action) {
    const { customerNumber, invoiceNumber, collectionTypeId } = action.payload.data;
    yield put(resetServicePaymentCollectionData());
    yield delay(1000);
    yield call([InvoiceRepository, 'deleteByInvoiceNumber'], invoiceNumber);
    yield call(generateServicePaymentCollectionData, { payload: { data: { customerNumber, collectionTypeId } } });
    yield call(successToast, I18n.t('invoice_deleted_successfully'));
}

function* getCustomerInvoiceHistory() {
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const netInfo = yield call([NetInfo, 'fetch']);
    let params = {
        customerNumbers: [customerNumber],
        invoicePaymentStatusIds: [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.PARTIALLY_PAID, PAYMENT_STATUS.PAID]
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, ServiceAPI.getCustomerInvoiceHistory, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'));
    }
}

function* fetchCustomerPaymentHistory(action) {
    const { reset } = action.payload.data;
    if (reset) {
        yield put(ServiceActions.resetPaymentHistoryPage());
    }
    const userInfo = yield select(getUserInfo);
    const { additionalInfo: { customerNumber } } = userInfo;
    const netInfo = yield call([NetInfo, 'fetch']);
    const completedSureys = yield select(getCustomerPaymentHistory);
    const newPage = completedSureys.page + 1;
    let params = {
        customerNumbers: customerNumber,
        page: newPage,
        size: 10,
    };
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, ServiceAPI.getCustomerPaymentHistory, params);
    } else {
        yield call(infoToast, I18n.t('network_unavailable'));
    }
}


function* invoiceHistory() {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield put(navigateToInvoiceCollectionList());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'));
    }
}

function* paymentHistory(action) {
    const customerPaymentHistoryList = yield select(getCustomerPaymentHistoryList);
    const newPage = customerPaymentHistoryList.page + 1;
    let params = {
        page: newPage,
        size: 10,
    };
    const { invoiceNumber, reset } = action.payload.data;
    if (reset) {
        yield put(ServiceActions.resetPaymentHistoryPage());
    }
    yield fork(saga.handleAPIRequest, ServiceAPI.getCustomerPaymentHistoryInvoicesDetails, invoiceNumber, params);
}


function* fetchCustomerPaymentHistoryDetails(action) {
    const netInfo = yield call([NetInfo, 'fetch']);
    if (netInfo.isInternetReachable) {
        yield fork(saga.handleAPIRequest, ServiceAPI.getCustomerPaymentHistoryDetails, action.payload.data.invoiceNumber);
        yield call(paymentHistory, action);
        yield put(ServiceActions.paymentHistory());
    } else {
        yield call(infoToast, I18n.t('network_unavailable'));
    }
}

export default function* serviceSaga() {
    yield all([
        takeLatest(ActionTypes.LOAD_INCOMPLETE_SERVICES, loadIncompleteServices),
        takeLatest(ActionTypes.LOAD_DONE_SERVICES, loadDoneServices),
        takeLatest(ActionTypes.LOAD_PHOTOS, loadPhotos),
        takeLatest(ActionTypes.FETCH_SERVICES, fetchServices),
        takeLatest(ActionTypes.FETCH_SERVICE_ICONS, fetchServiceIcons),
        takeLatest(ActionTypes.START_MOBILE_SERVICE_ENROLLMENT, startMobileServiceEnrollment),
        takeLatest(ActionTypes.GENERATE_SERVICE_EXECUTION_SURVEY_DATA_MAP, generateServiceExecutionSurveyDataMap),
        takeLatest(ActionTypes.START_SERVICE_EXECUTION, startServiceExecution),
        takeLatest(ActionTypes.NEW_SPECIAL_SERVICE_REQUEST, newServiceRequest),
        takeLatest(ActionTypes.UPDATE_SERVICE_REQUEST, updateServiceRequest),
        takeLatest(ActionTypes.FETCH_SPECIAL_SERVICE_BY_ID, getSpecialServiceById),
        takeLatest(ActionTypes.DELETE_SPECIAL_SERVICE_REQUEST, deleteSpecialServiceRequest),
        takeLatest(ActionTypes.FETCH_SERVICE_HISTORY, fetchServiceHistory),
        takeLatest(ActionTypes.SERVICE_HISTORY, serviceHistory),
        takeLatest(ActionTypes.SPECIAL_SERVICES, specialServices),
        takeLatest(ActionTypes.LOAD_CUSTOMER_PROFILE, loadCustomerProfile),
        takeEvery(DfgActions.types.SET_SERVICE_EXECUTED, setServiceExecuted),
        takeLatest(ActionTypes.SCAN_QR_CODE_PENDING_SERVICE_TOUR, scanQrCodePendingServiceTourData),
        takeLatest(ActionTypes.GENERATE_SERVICE_PAYMENT_COLLECTION_DATA, generateServicePaymentCollectionData),
        takeLatest(ActionTypes.POPULATE_ADVANCE_OUTSTANDING_PAYMENT_DATA, populateAdvanceOutstandingPaymentData),
        takeLatest(ActionTypes.UPDATE_PAYMENT_COLLECTION, updatePaymentCollection),
        takeEvery(ActionTypes.SYNC_PAYMENT_DATA, syncPaymentData),
        takeLatest(ActionTypes.DELETE_INVOICE, deleteInvoice),
        takeLatest(ActionTypes.FETCH_CUSTOMER_INVOICE_HISTORY, getCustomerInvoiceHistory),
        takeLatest(ActionTypes.INVOICE_HISTORY, invoiceHistory),
        takeLatest(ActionTypes.PAYMENT_HISTORY, paymentHistory),
        takeLatest(ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY, fetchCustomerPaymentHistory),
        takeLatest(ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS, fetchCustomerPaymentHistoryDetails),
    ]);
}

export {
    loadIncompleteServices, fetchServiceIcons, fetchPaymentConfig
};
