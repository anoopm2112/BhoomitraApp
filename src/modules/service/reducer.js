import { types as ActionTypes } from './actions';

const initialState = {
    incompleteServices: {
        refreshing: true,
        data: undefined
    },
    doneServices: {
        refreshing: true,
        data: undefined
    },
    photos: {},
    icons: {},
    serviceBarcode: {
        showResumeModal: false,
        configs: {
            initDone: false,
            customerProfile: undefined,
            customerPhoto: undefined,
            items: {}
        }
    },
    servicItemList: {
        showResumeModal: false,
        position: undefined,
        configs: {
            initDone: false,
            serviceExecutionSurveyDataMap: {}
        }
    },
    specialService: {
        specialService: undefined,
    },
    updatedData: undefined,
    specialServiceRequests: {
        data: [],
        refreshing: false
    },
    serviceHistory: {
        data: [],
        refreshing: false
    },
    servicePayment: {
        syncingInvoices: [],
        payment: {},
        paymentInProgress: false,
        collection: {
            configs: {
                initDone: false,
                customerNumber: undefined,
                collectionTypeId: undefined,
                items: {}
            },
            item: {}
        }
    },
    queued: [],
    progress: {},
    failed: [],
    processed: [],
    customerInvoiceHistory: {
        data: {},
        refreshing: false
    },
    customerPaymentHistory: {
        data: [],
        refreshing: true,
        page: -1,
        size: 1,
        customerPaymentHistoryInvoiceDetails: {}
    },
    customerPaymentHistoryList: {
        data: [],
        refreshing: true,
        page: -1,
        size: 1,
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_INCOMPLETE_SERVICES:
            return Object.assign({}, state, {
                incompleteServices: {
                    ...state.incompleteServices,
                    refreshing: true
                }
            });
        case ActionTypes.SET_INCOMPLETE_SERVICES:
            return Object.assign({}, state, {
                incompleteServices: {
                    ...state.incompleteServices,
                    data: action.payload.data || []
                }
            });
        case ActionTypes.SERVICE_INCOMPLETE_API_SUCCESS:
        case ActionTypes.SERVICE_INCOMPLETE_API_FAILED:
            return Object.assign({}, state, {
                incompleteServices: {
                    ...state.incompleteServices,
                    refreshing: false
                }
            });
        case ActionTypes.LOAD_DONE_SERVICES:
            return Object.assign({}, state, {
                doneServices: {
                    ...state.doneServices,
                    refreshing: true
                }
            });
        case ActionTypes.SET_DONE_SERVICES:
            return Object.assign({}, state, {
                doneServices: {
                    refreshing: false,
                    data: action.payload.data || []
                }
            });
        case ActionTypes.SET_PHOTOS:
            return Object.assign({}, state, {
                photos: {
                    ...state.photos,
                    ...action.payload.data
                }
            });
        case ActionTypes.RESET_PHOTOS:
            return Object.assign({}, state, {
                photos: initialState.photos
            });
        case ActionTypes.SET_SERVICE_ICONS:
            return Object.assign({}, state, {
                icons: action.payload.data
            });
        case ActionTypes.SET_CUSTOMER_PROFILE:
            return Object.assign({}, state, {
                serviceBarcode: {
                    ...state.serviceBarcode,
                    configs: action.payload.data
                }
            });
        case ActionTypes.RESET_CUSTOMER_PROFILE:
            return Object.assign({}, state, {
                serviceBarcode: {
                    ...state.serviceBarcode,
                    configs: initialState.serviceBarcode.configs
                }
            });
        case ActionTypes.SET_SUBSCRIPTION_RESUME_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                serviceBarcode: {
                    ...state.serviceBarcode,
                    showResumeModal: action.payload.data
                }
            });
        case ActionTypes.SET_SERVICING_RESUME_MODAL_VISIBILITY:
            return Object.assign({}, state, {
                servicItemList: {
                    ...state.servicItemList,
                    showResumeModal: action.payload.data
                }
            });
        case ActionTypes.SET_SERVICE_EXECUTION_SURVEY_DATA_MAP:
            return Object.assign({}, state, {
                servicItemList: {
                    ...state.servicItemList,
                    configs: action.payload.data
                }
            });
        case ActionTypes.RESET_SERVICE_EXECUTION_SURVEY_DATA_MAP:
            return Object.assign({}, state, {
                servicItemList: {
                    ...state.servicItemList,
                    configs: initialState.servicItemList.configs
                }
            });
        case ActionTypes.SET_SERVICE_LOCATION:
            return Object.assign({}, state, {
                servicItemList: {
                    ...state.servicItemList,
                    position: action.payload.data
                }
            });
        case ActionTypes.RESET_SERVICE_LOCATION:
            return Object.assign({}, state, {
                servicItemList: {
                    ...state.servicItemList,
                    position: initialState.servicItemList.position
                }
            });
        case ActionTypes.SPECIAL_SERVICE_API_REQUEST:
            return Object.assign({}, state, {
                specialService: {
                    specialService: undefined
                }
            });
        case ActionTypes.SPECIAL_SERVICE_API_SUCCESS:
            return Object.assign({}, state, {
                specialService: {
                    specialService: action.payload.data
                }
            });
        case ActionTypes.SPECIAL_SERVICE_API_FAILED:
            return Object.assign({}, state, {
                specialService: {
                    specialService: undefined
                }
            });
        case ActionTypes.FETCH_SPECIAL_SERVICE_BY_ID_API_SUCCESS:
            return Object.assign({}, state, {
                updatedData: action.payload.data
            });
        case ActionTypes.FETCH_SPECIAL_SERVICE_REQUEST_API_SUCCESS:
            return Object.assign({}, state, {
                specialServiceRequests: {
                    data: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_SPECIAL_SERVICE_REQUEST_API_REQUEST:
            return Object.assign({}, state, {
                specialServiceRequests: {
                    refreshing: true
                }
            });
        case ActionTypes.FETCH_SPECIAL_SERVICE_REQUEST_API_FAILED:
            return Object.assign({}, state, {
                specialServiceRequests: {
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_SERVICE_HISTORY_API_FAILED:
            return Object.assign({}, state, {
                serviceHistory: {
                    data: [],
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_SERVICE_HISTORY_API_REQUEST:
            return Object.assign({}, state, {
                serviceHistory: {
                    data: [],
                    refreshing: true
                }
            });
        case ActionTypes.FETCH_SERVICE_HISTORY_API_SUCCESS:
            return Object.assign({}, state, {
                serviceHistory: {
                    data: action.payload.data,
                    refreshing: false
                }
            });
        case ActionTypes.ADD_TO_QUEUE:
            const addedQueue = [...state.queued, action.payload.data];
            return Object.assign({}, state, {
                queued: addedQueue
            });
        case ActionTypes.REMOVE_FROM_QUEUE:
            const removedQueue = state.queued.filter(id => id !== action.payload.data);
            return Object.assign({}, state, {
                queued: removedQueue
            });
        case ActionTypes.UPDATE_PROGRESS:
            return Object.assign({}, state, {
                progress: {
                    ...state.progress,
                    ...action.payload.data
                }
            });
        case ActionTypes.REMOVE_PROGRESS:
            const progress = {
                ...state.progress
            };
            if (progress.hasOwnProperty(action.payload.data)) {
                delete progress[action.payload.data];
            }
            return Object.assign({}, state, {
                progress
            });
        case ActionTypes.SET_FAILED:
            const setFailed = [...state.failed, action.payload.data];
            return Object.assign({}, state, {
                failed: setFailed
            });
        case ActionTypes.UNSET_FAILED:
            const unsetFailed = state.failed.filter(id => id !== action.payload.data);
            return Object.assign({}, state, {
                failed: unsetFailed
            });
        case ActionTypes.SET_PROCESSED:
            const setProcessed = [...state.processed, action.payload.data];
            return Object.assign({}, state, {
                processed: setProcessed
            });
        case ActionTypes.UNSET_PROCESSED:
            const unsetProcessed = state.processed.filter(id => id !== action.payload.data);
            return Object.assign({}, state, {
                processed: unsetProcessed
            });
        case ActionTypes.SET_SERVICE_PAYMENT_COLLECTION_DATA:
            return Object.assign({}, state, {
                servicePayment: {
                    ...state.servicePayment,
                    collection: {
                        ...state.servicePayment.collection,
                        configs: action.payload.data
                    }
                }
            });
        case ActionTypes.RESET_SERVICE_PAYMENT_COLLECTION_DATA:
            return Object.assign({}, state, {
                servicePayment: {
                    ...state.servicePayment,
                    collection: {
                        ...state.servicePayment.collection,
                        configs: initialState.servicePayment.collection.configs
                    }
                }
            });
        case ActionTypes.SET_SERVICE_PAYMENT_COLLECTION_ITEM:
            return Object.assign({}, state, {
                servicePayment: {
                    ...state.servicePayment,
                    collection: {
                        ...state.servicePayment.collection,
                        item: action.payload.data
                    }
                }
            });
        case ActionTypes.SET_ADVANCE_OUTSTANDING_PAYMENT_DATA:
            return Object.assign({}, state, {
                servicePayment: {
                    ...state.servicePayment,
                    payment: action.payload.data
                }
            });
        case ActionTypes.SET_PAYMENT_IN_PROGRESS:
            return Object.assign({}, state, {
                servicePayment: {
                    ...state.servicePayment,
                    paymentInProgress: action.payload.data
                }
            });
        case ActionTypes.SET_SYNCING_INVOICES:
            return Object.assign({}, state, {
                servicePayment: {
                    ...state.servicePayment,
                    syncingInvoices: action.payload.data
                }
            });
        case ActionTypes.RESET_SYNCING_INVOICES:
            return Object.assign({}, state, {
                servicePayment: {
                    ...state.servicePayment,
                    syncingInvoices: initialState.servicePayment.syncingInvoices
                }
            });
        case ActionTypes.FETCH_CUSTOMER_INVOICE_HISTORY_API_REQUEST:
            return Object.assign({}, state, {
                customerInvoiceHistory: {
                    refreshing: true
                }
            });
        case ActionTypes.FETCH_CUSTOMER_INVOICE_HISTORY_API_SUCCESS:
            return Object.assign({}, state, {
                customerInvoiceHistory: {
                    data: action.payload.data.details,
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_CUSTOMER_INVOICE_HISTORY_API_FAILED:
            return Object.assign({}, state, {
                customerInvoiceHistory: {
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_API_REQUEST:
            return Object.assign({}, state, {
                customerPaymentHistory: {
                    ...state.customerPaymentHistory,
                    refreshing: true
                }
            });
        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_API_SUCCESS:
            const newPage = state.customerPaymentHistory.page + 1;
            const customerPaymentHistoryData = [];
            if (newPage > 0 && state.customerPaymentHistory.data.length) {
                customerPaymentHistoryData.push(...state.customerPaymentHistory.data);
            }
            customerPaymentHistoryData.push(...action.payload.data.content);
            return Object.assign({}, state, {
                customerPaymentHistory: {
                    ...state.customerPaymentHistory,
                    refreshing: false,
                    page: newPage,
                    size: newPage,
                    data: customerPaymentHistoryData
                }
            });
        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_API_FAILED:
            return Object.assign({}, state, {
                customerPaymentHistory: {
                    ...state.customerPaymentHistory,
                    refreshing: false
                }
            });
        case ActionTypes.RESET_PAYMENT_HISTORY_PAGE:
            return Object.assign({}, state, {
                customerPaymentHistory: {
                    ...state.customerPaymentHistory,
                    page: initialState.customerPaymentHistory.page
                },
                customerPaymentHistoryList: {
                    ...state.customerPaymentHistoryList,
                    page: -1,
                    size: 10
                }
            });
        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_SUCCESS:
            return Object.assign({}, state, {
                customerPaymentHistory: {
                    ...state.customerPaymentHistory,
                    customerPaymentHistoryInvoiceDetails: action.payload.data
                }
            });
        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_REQUEST:
            return Object.assign({}, state, {
                customerPaymentHistory: {
                    ...state.customerPaymentHistory,
                    customerPaymentHistoryInvoiceDetails: {}
                }
            });
        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_INVOICE_DETAILS_API_FAILED:
            return Object.assign({}, state, {
                customerPaymentHistory: {
                    ...state.customerPaymentHistory,
                    customerPaymentHistoryInvoiceDetails: {}
                }
            });

        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_SUCCESS:
            const newPageNum = state.customerPaymentHistoryList.page + 1;
            const customerPaymentHistoryListData = [];
            if (newPageNum > 0 && state.customerPaymentHistoryList.data.length) {
                customerPaymentHistoryListData.push(...state.customerPaymentHistoryList.data);
            }
            customerPaymentHistoryListData.push(...action.payload.data.content);
            return Object.assign({}, state, {
                customerPaymentHistoryList: {
                    ...state.customerPaymentHistoryList,
                    refreshing: false,
                    page: newPageNum,
                    size: newPageNum,
                    data: customerPaymentHistoryListData
                }
            });

        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_REQUEST:
            return Object.assign({}, state, {
                customerPaymentHistoryList: {
                    refreshing: false
                }
            });
        case ActionTypes.FETCH_CUSTOMER_PAYMENT_HISTORY_DETAILS_API_FAILED:
            return Object.assign({}, state, {
                customerPaymentHistoryList: {
                    ...state.customerPaymentHistory,
                    refreshing: true
                }
            });
        default:
            return state;
    }
};
