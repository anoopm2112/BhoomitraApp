import AwaitLock from 'await-lock';

let dfgLock = new AwaitLock();
let deleteSurveysLock = new AwaitLock();
let syncInprogressDataLock = new AwaitLock();
let fetchSurveyTemplateLock = new AwaitLock();
let loadIncompleteServicesLock = new AwaitLock();
let syncPaymentDataLock = new AwaitLock();
let qrcodeUpdateInProfileLock = new AwaitLock();
let toastLock = new AwaitLock();
let netInfoLock = new AwaitLock();
let surveyDataLock = {};
let customerProfileLock = {};

export {
    dfgLock, deleteSurveysLock, syncInprogressDataLock,
    fetchSurveyTemplateLock,
    loadIncompleteServicesLock, syncPaymentDataLock,
    surveyDataLock, customerProfileLock, qrcodeUpdateInProfileLock,
    toastLock, netInfoLock
};
