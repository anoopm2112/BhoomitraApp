import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as CKC_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    CKC_PICK_UP: 'Ckc/CKC_PICK_UP',
    CKC_SALE: 'Ckc/CKC_SALE',
    CKC_LSGI_TYPE: 'Ckc/CKC_LSGI_TYPE',
    GET_CKC_LSGI_TYPE_API_REQUEST: 'Ckc/GET_CKC_LSGI_TYPE_API_REQUEST',
    GET_CKC_LSGI_TYPE_API_SUCCESS: 'Ckc/GET_CKC_LSGI_TYPE_API_SUCCESS',
    GET_CKC_LSGI_TYPE_API_FAILED: 'Ckc/GET_CKC_LSGI_TYPE_API_FAILED',
    CKC_LSGI_NAME: 'Ckc/CKC_LSGI_NAME',
    GET_CKC_LSGI_NAME_API_REQUEST: 'Ckc/GET_CKC_LSGI_NAME_API_REQUEST',
    GET_CKC_LSGI_NAME_API_SUCCESS: 'Ckc/GET_CKC_LSGI_NAME_API_SUCCESS',
    GET_CKC_LSGI_NAME_API_FAILED: 'Ckc/GET_CKC_LSGI_NAME_API_FAILED',
    CKC_MCF_RRF_NAME: 'Ckc/CKC_MCF_RRF_NAME',
    GET_CKC_MCF_RRF_NAME_API_REQUEST: 'Ckc/GET_CKC_MCF_RRF_NAME_API_REQUEST',
    GET_CKC_MCF_RRF_NAME_API_SUCCESS: 'Ckc/GET_CKC_MCF_RRF_NAME_API_SUCCESS',
    GET_CKC_MCF_RRF_NAME_API_FAILED: 'Ckc/GET_CKC_MCF_RRF_NAME_API_FAILED',
    SAVE_PICK_UP: 'Ckc/SAVE_PICK_UP',
    SAVE_PICK_UP_API_REQUEST: 'Ckc/SAVE_PICK_UP_API_REQUEST',
    SAVE_PICK_UP_API_SUCCESS: 'Ckc/SAVE_PICK_UP_API_SUCCESS',
    SAVE_PICK_UP_API_FAILED: 'Ckc/SAVE_PICK_UP_API_FAILED',
    CKC_GO_DOWN: 'Ckc/CKC_GO_DOWN',
    GET_CKC_GO_DOWN_API_REQUEST: 'Ckc/GET_CKC_GO_DOWN_API_REQUEST',
    GET_CKC_GO_DOWN_API_SUCCESS: 'Ckc/GET_CKC_GO_DOWN_API_SUCCESS',
    GET_CKC_GO_DOWN_API_FAILED: 'Ckc/GET_CKC_GO_DOWN_API_FAILED',
    SAVE_CKC_SALE: 'Ckc/SAVE_CKC_SALE',
    SAVE_CKC_SALE_API_REQUEST: 'Ckc/SAVE_CKC_SALE_API_REQUEST',
    SAVE_CKC_SALE_API_SUCCESS: 'Ckc/SAVE_CKC_SALE_API_SUCCESS',
    SAVE_CKC_SALE_API_FAILED: 'Ckc/SAVE_CKC_SALE_API_FAILED',
    RESET_LSGI_NAME: 'Ckc/RESET_LSGI_NAME',
    RESET_MCF_RRF_NAME: 'Ckc/RESET_MCF_RRF_NAME'
};

export function ckcPickUp() {
    return action(types.CKC_PICK_UP);
}

export function ckcSale() {
    return action(types.CKC_SALE);
}

export function navigateToAddCkcPickUp() {
    return navigate(MODULE_ROUTE_KEYS.CKC, { screen: CKC_ROUTE_KEYS.ADD_CKC_PICK_UP });
}

export function navigateToAddCkcSale() {
    return navigate(MODULE_ROUTE_KEYS.CKC, { screen: CKC_ROUTE_KEYS.ADD_CKC_SALE });
}

export function getCkcLsgiType() {
    return action(types.CKC_LSGI_TYPE);
}

export function getCkcLsgiName(data) {
    return action(types.CKC_LSGI_NAME, { data });
}

export function getMcfRrfName(data) {
    return action(types.CKC_MCF_RRF_NAME, { data });
}

export function getGoDown(data) {
    return action(types.CKC_GO_DOWN, { data });
}

export function savePickUp(data) {
    return action(types.SAVE_PICK_UP, { data });
}

export function addCkcSale(data) {
    return action(types.SAVE_CKC_SALE, { data });
}

export function resetLsgiName() {
    return action(types.RESET_LSGI_NAME);
}

export function resetMcfRrfName() {
    return action(types.RESET_MCF_RRF_NAME);
}

export function navigateToAddItemCkcPickUp(data) {
    return navigate(MODULE_ROUTE_KEYS.CKC, { screen: CKC_ROUTE_KEYS.ADD_CKC_ITEM, params: { data } });
}
