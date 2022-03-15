import flow from 'lodash/fp/flow';
import _ from 'lodash';
import { STATE_REDUCER_KEY } from './constants';

export const getEnrollment = state => state[STATE_REDUCER_KEY];

const incompleteSurveys = enrollment => enrollment.incompleteSurveys;
export const getIncompleteSurveys = flow(getEnrollment, incompleteSurveys);

const subscription = enrollment => enrollment.subscription;
export const getSubscription = flow(getEnrollment, subscription);

const pendingQrCodeSurveys = enrollment => enrollment.pendingQrCodeSurveys;
export const getPendingQrCodeSurveys = flow(getEnrollment, pendingQrCodeSurveys);

const enrollmentInProgressAnimationStatus = enrollment => enrollment.enrollmentInProgressAnimationStatus;
export const getEnrollmentInProgressAnimationStatus = flow(getEnrollment, enrollmentInProgressAnimationStatus);
