import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as REPORT_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    SAVE_BUG_REPORT: 'Report/SAVE_BUG_REPORT',
    GET_IMAGE: 'Report/GET_IMAGE',
    DELETE_REPORT_IMAGE: 'Report/DELETE_REPORT_IMAGE',
    SAVE_BUGREPORT_API_REQUEST: 'Report/SAVE_BUGREPORT_API_REQUEST',
    SAVE_BUGREPORT_API_SUCCESS: 'Report/SAVE_BUGREPORT_API_SUCCESS',
    SAVE_BUGREPORT_API_FAILED: 'Report/SAVE_BUGREPORT_API_FAILED',
};

export function saveBugReport(data) {
    return action(types.SAVE_BUG_REPORT, { data });
}

export function getImage(data) {
    return action(types.GET_IMAGE, { data });
}

export function deleteReportImage() {
    return action(types.DELETE_REPORT_IMAGE)
}
