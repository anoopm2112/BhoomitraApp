export const STATE_REDUCER_KEY = 'service';

export const COLLECTION_TYPE = {
    SUBSCRIPTION: 1,
    COLLECTION: 2
};

export const RATE_TYPE = {
    FIXED_RATE: 1,
    SLAB_RATE: 2,
    PER_UNIT_RATE: 3
};

export const PAYMENT_MODE = {
    ONLINE: 1,
    OFFLINE: 2
};

export const INVOICE_INTERVAL = {
    MONTHLY: 1,
    DATE: 2
};

export const PAYMENT_STATUS = {
    UNPAID: 1,
    PARTIALLY_PAID: 2,
    PAID: 3
};

export const PAYMENT_TRANSACTION_STATUS = {
    PAYMENT_SUCCESS: 1,
    PAYMENT_ON_HOLD: 2,
    PAYMENT_FAILED: 3
};

export const PAYMENT_TYPE = {
    SW_OFFLINE: 1,
    SW_ONLINE: 2,
    CUSTOMER_ONLINE: 3
};

export const ROUTE_KEYS = {
    SERVICEINPROGRESS: 'ServiceInProgress',
    SERVICEDONE: 'ServiceDone',
    SERVICEBARCODE: 'ServiceBarcode',
    SERVICELIST: 'ServiceList',
    COMPLAINTLIST: 'ComplaintList',
    SERVICEREQUESTLIST: 'ServiceRequestList',
    SERVICENEWREQUEST: 'ServiceNewRequest',
    SERVICEHISTORY: 'ServiceHistory',
    SERVICEPAYMENT: 'ServicePayment',
    PAYMENTCOLLECTIONLIST: 'PaymentCollectionList',
    PAYMENTCOLLECTION: 'PaymentCollection',
    INVOICEHISTORYCOLLECTIONLIST: 'InvoiceHistoryCollectionList',
    INVOICEHISTORYSUBSCRIPTIONLIST: 'InvoiceHistorySubscriptionList',
    INVOICEHISTORYCOLLECTIONDETAILS: 'InvoiceHistoryCollectionDetails',
    INVOICEHISTORYSUBSCRIPTIONDETAILS: 'InvoiceHistorySubscriptionDetails',
    PAYMENTHISTORY: 'PaymentHistoryList',
    PAYMENTHISTORYSUBSCRIPTION: 'PaymentHistorySubscriptionList',
    PAYMNETHISTORYDETAILS: 'PaymentHistoryDetails'
};
