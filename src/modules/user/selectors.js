import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getUser = state => state[STATE_REDUCER_KEY];

const userAuthData = user => user.authData;
export const getUserAuthData = flow(getUser, userAuthData);

const userInfo = user => user.info;
export const getUserInfo = flow(getUser, userInfo);

const fcmDetails = user => user.fcm;
export const getFcmDetails = flow(getUser, fcmDetails);

const userRoles = user => user.userRoles;
export const getUserRoles = flow(getUser, userRoles);

const encryptionKey = user => user.encryptionKey;
export const getEncryptionKey = flow(getUser, encryptionKey);
