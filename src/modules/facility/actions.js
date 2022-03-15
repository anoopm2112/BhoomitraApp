import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as FACILITY_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    FETCH_MCF: 'Facility/FETCH_MCF',
    FETCH_MCF_API_REQUEST: 'Facility/FETCH_MCF_API_REQUEST',
    FETCH_MCF_API_SUCCESS: 'Facility/FETCH_MCF_API_SUCCESS',
    FETCH_MCF_API_FAILED: 'Facility/FETCH_MCF_API_FAILED',
};

export function navigateTo(route, screen) {
    return navigate(route, { screen });
}

export function navigateToNearestMcf() {
    return navigate(MODULE_ROUTE_KEYS.FACILITY, { screen: FACILITY_ROUTE_KEYS.FACILITYNEARESTMCF });
}

export function fetchNearestMcf(data) {
    return action(types.FETCH_MCF, data);
}
