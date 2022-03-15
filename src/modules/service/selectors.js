import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getService = state => state[STATE_REDUCER_KEY];

const incompleteServices = service => service.incompleteServices;
export const getIncompleteServices = flow(getService, incompleteServices);

const doneServices = service => service.doneServices;
export const getDoneServices = flow(getService, doneServices);

const photos = service => service.photos;
export const getPhotos = flow(getService, photos);

const icons = service => service.icons;
export const getIcons = flow(getService, icons);

const serviceBarcode = service => service.serviceBarcode;
export const getServiceBarcode = flow(getService, serviceBarcode);

const servicItemList = service => service.servicItemList;
export const getServiceItemList = flow(getService, servicItemList);

const specialServices = service => service.specialService;
export const getSpecialServices = flow(getService, specialServices);

const updatedData = service => service.updatedData;
export const getUpdatedData = flow(getService, updatedData);

const specialServiceRequests = service => service.specialServiceRequests;
export const getSpecialServiceRequests = flow(getService, specialServiceRequests);

const serviceHistory = service => service.serviceHistory;
export const getServiceHistory = flow(getService, serviceHistory);

const servicePayment = service => service.servicePayment;
export const getServicePayment = flow(getService, servicePayment);

const queued = service => service.queued;
export const getQueued = flow(getService, queued);

const progress = service => service.progress;
export const getProgress = flow(getService, progress);

const failed = service => service.failed;
export const getFailed = flow(getService, failed);

const processed = service => service.processed;
export const getProcessed = flow(getService, processed);

const customerInvoiceHistory = service => service.customerInvoiceHistory;
export const getCustomerInvoiceHistory = flow(getService, customerInvoiceHistory);

const customerPaymentHistory = service => service.customerPaymentHistory;
export const getCustomerPaymentHistory = flow(getService, customerPaymentHistory);

const customerPaymentHistoryList = service => service.customerPaymentHistoryList;
export const getCustomerPaymentHistoryList = flow(getService, customerPaymentHistoryList);

