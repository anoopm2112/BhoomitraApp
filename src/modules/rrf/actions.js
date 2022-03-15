import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as RRF_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    RRF_STOCK_IN: 'Rrf/RRF_STOCK_IN',
    RRF_STOCK_TRANSFER: 'Rrf/RRF_STOCK_TRANSFER',
    RRF_SALE: 'Rrf/RRF_SALE',
    ADD_RRF_STOCK_IN: 'Rrf/ADD_RRF_STOCK_IN',
    ADD_RRF_STOCK_IN_API_REQUEST: 'Rrf/ADD_RRF_STOCK_IN_API_REQUEST',
    ADD_RRF_STOCK_IN_API_SUCCESS: 'Rrf/ADD_RRF_STOCK_IN_API_SUCCESS',
    ADD_RRF_STOCK_IN_API_FAILED: 'Rrf/ADD_RRF_STOCK_IN_API_FAILED',
    ADD_RRF_SALE: 'Rrf/ADD_RRF_SALE',
    ADD_RRF_SALE_API_REQUEST: 'Rrf/ADD_RRF_SALE_API_REQUEST',
    ADD_RRF_SALE_API_SUCCESS: 'Rrf/ADD_RRF_SALE_API_SUCCESS',
    ADD_RRF_SALE_API_FAILED: 'Rrf/ADD_RRF_SALE_API_FAILED',
    RRF_SHREDDED_PLASTIC: 'Rrf/RRF_SHREDDED_PLASTIC',
    SAVE_SHREDDED_PLASTIC: 'Rrf/SAVE_SHREDDED_PLASTIC',
    SAVE_SHREDDED_PLASTIC_API_REQUEST: 'Rrf/SAVE_SHREDDED_PLASTIC_API_REQUEST',
    SAVE_SHREDDED_PLASTIC_API_SUCCESS: 'Rrf/SAVE_SHREDDED_PLASTIC_API_SUCCESS',
    SAVE_SHREDDED_PLASTIC_API_FAILED: 'Rrf/SAVE_SHREDDED_PLASTIC_API_FAILED',
};

export function rrfStockIn() {
    return action(types.RRF_STOCK_IN);
}

export function rrfSale() {
    return action(types.RRF_SALE);
}

export function navigateToAddRrfStockIn() {
    return navigate(MODULE_ROUTE_KEYS.RRF, { screen: RRF_ROUTE_KEYS.ADD_RRF_STOCK_IN });
}

export function navigateToAddRrfStockTransfer() {
    return navigate(MODULE_ROUTE_KEYS.RRF, { screen: RRF_ROUTE_KEYS.ADD_RRF_STOCK_TRANSFER });
}

export function navigateToAddRrfSale() {
    return navigate(MODULE_ROUTE_KEYS.RRF, { screen: RRF_ROUTE_KEYS.ADD_RRF_SALE });
}

export function addRrfStockIn(data) {
    return action(types.ADD_RRF_STOCK_IN, { data });
}

export function addRrfSale(data) {
    return action(types.ADD_RRF_SALE, { data });
}

export function rrfShreddedPlastic() {
    return action(types.RRF_SHREDDED_PLASTIC);
}

export function navigateToAddShreddedPlastic() {
    return navigate(MODULE_ROUTE_KEYS.RRF, { screen: RRF_ROUTE_KEYS.ADD_RRF_SHERDDED_PLASTIC });
}

export function saveShreddedPlastic(data) {
    return action(types.SAVE_SHREDDED_PLASTIC, { data });
}
