import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getDashboard = state => state[STATE_REDUCER_KEY];

const sideBar = dashboard => dashboard.sideBar;
export const getSideBarData = flow(getDashboard, sideBar);

const qrcode = dashboard => dashboard.qrcode;
export const getQRCode = flow(getDashboard, qrcode);

const notification = dashboard => dashboard.notification;
export const getNotification = flow(getDashboard, notification);

const qusUIKey = dashboard => dashboard.qus_UI_key;
export const getQusUIKkey = flow(getDashboard, qusUIKey);

const count = dashboard => dashboard.count;
export const getCount = flow(getDashboard, count);

const playstoreAppData = dashboard => dashboard.playstoreAppData;
export const getPlaystoreAppData = flow(getDashboard, playstoreAppData);

const needsUpdate = dashboard => dashboard.needsUpdate;
export const getNeedsUpdate = flow(getDashboard, needsUpdate);

const tourData = dashboard => dashboard.tourData;
export const getAppTourData = flow(getDashboard, tourData);

const qrScannerModal = dashboard => dashboard.qrScannerModal;
export const getAppQrScannerModal = flow(getDashboard, qrScannerModal);

const drawerStatus = dashboard => dashboard.drawerStatus;
export const getDrawerStatus = flow(getDashboard, drawerStatus);
