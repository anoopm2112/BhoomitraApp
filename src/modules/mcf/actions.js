import { actions } from '../../common';
import { MODULE_ROUTE_KEYS } from '../../common/routeKeys';
import { ROUTE_KEYS as MCF_ROUTE_KEYS } from './constants';

const { action, navigation: { navigate } } = actions;

export const types = {
    MCF_STOCK_IN: 'Mcf/MCF_STOCK_IN',
    MCF_STOCK_TRANSFER: 'Mcf/MCF_STOCK_TRANSFER',
    MCF_SALE: 'Mcf/MCF_SALE',
    ADD_MCF_STOCK_IN: 'Mcf/ADD_MCF_STOCK_IN',
    GET_MCF_ITEM_NAME: 'Mcf/GET_MCF_ITEM_NAME',
    GET_MCF_ITEM_NAME_API_REQUEST: 'Mcf/GET_MCF_ITEM_NAME_API_REQUEST',
    GET_MCF_ITEM_NAME_API_SUCCESS: 'Mcf/GET_MCF_ITEM_NAME_API_SUCCESS',
    GET_MCF_ITEM_NAME_API_FAILED: 'Mcf/GET_MCF_ITEM_NAME_API_FAILED',
    GET_MCF_STOCK_TRANSFER_TO: 'Mcf/GET_MCF_STOCK_TRANSFER_TO',
    GET_MCF_STOCK_TRANSFER_TO_REQUEST: 'Mcf/GET_MCF_STOCK_TRANSFER_TO_REQUEST',
    GET_MCF_STOCK_TRANSFER_TO_SUCCESS: 'Mcf/GET_MCF_STOCK_TRANSFER_TO_SUCCESS',
    GET_MCF_STOCK_TRANSFER_TO_FAILED: 'Mcf/GET_MCF_STOCK_TRANSFER_TO_FAILED',
    GET_MCF_ITEM_TYPES: 'Mcf/GET_MCF_ITEM_TYPES',
    GET_MCF_ITEM_TYPES_REQUEST: 'Mcf/GET_MCF_ITEM_TYPES_REQUEST',
    GET_MCF_ITEM_TYPES_SUCCESS: 'Mcf/GET_MCF_ITEM_TYPES_SUCCESS',
    GET_MCF_ITEM_TYPES_FAILED: 'Mcf/GET_MCF_ITEM_TYPES_FAILED',
    ADD_MCF_STOCK_IN_API_REQUEST: 'Mcf/ADD_MCF_STOCK_IN_API_REQUEST',
    ADD_MCF_STOCK_IN_API_SUCCESS: 'Mcf/ADD_MCF_STOCK_IN_API_SUCCESS',
    ADD_MCF_STOCK_IN_API_FAILED: 'Mcf/ADD_MCF_STOCK_IN_API_FAILED',
    GET_ASSOCIATIONS: 'Mcf/GET_ASSOCIATIONS',
    GET_MCF_ASSOCIATIONS_API_REQUEST: 'Mcf/GET_MCF_ASSOCIATIONS_API_REQUEST',
    GET_MCF_ASSOCIATIONS_API_SUCCESS: 'Mcf/GET_MCF_ASSOCIATIONS_API_SUCCESS',
    GET_MCF_ASSOCIATIONS_API_FAILED: 'Mcf/GET_MCF_ASSOCIATIONS_API_FAILED',
    SAVE_MCF_STOCK_TRANSFER: 'Mcf/SAVE_MCF_STOCK_TRANSFER',
    ADD_MCF_STOCK_TRANSFER_API_REQUEST: 'Mcf/ADD_MCF_STOCK_TRANSFER_API_REQUEST',
    ADD_MCF_STOCK_TRANSFER_API_SUCCESS: 'Mcf/ADD_MCF_STOCK_TRANSFER_API_SUCCESS',
    ADD_MCF_STOCK_TRANSFER_API_FAILED: 'Mcf/ADD_MCF_STOCK_TRANSFER_API_FAILED',
    GET_RATE: 'Mcf/GET_RATE',
    GET_RATE_API_REQUEST: 'Mcf/GET_RATE_API_REQUEST',
    GET_RATE_API_SUCCESS: 'Mcf/GET_RATE_API_SUCCESS',
    GET_RATE_API_FAILED: 'Mcf/GET_RATE_API_FAILED',
    ADD_MCF_SALE: 'Mcf/ADD_MCF_SALE',
    ADD_MCF_SALE_API_REQUEST: 'Mcf/ADD_MCF_SALE_API_REQUEST',
    ADD_MCF_SALE_API_SUCCESS: 'Mcf/ADD_MCF_SALE_API_SUCCESS',
    ADD_MCF_SALE_API_FAILED: 'Mcf/ADD_MCF_SALE_API_FAILED',
    RESET_RATE: 'Mcf/RESET_RATE',
    ADD_ITEM: 'Mcf/ADD_ITEM',
    ADD_STOCK_IN_ITEM: 'Mcf/ADD_STOCK_IN_ITEM',
    SET_STOCK_IN_ITEM: 'Mcf/SET_STOCK_IN_ITEM',
    ADD_SALE_ITEM: 'Mcf/ADD_SALE_ITEM',
    SET_SALE_ITEM: 'Mcf/SET_SALE_ITEM',
    MCF_SEGREGATION: 'Mcf/MCF_SEGREGATION',
    GET_SEGREGATION_ITEM: 'Mcf/GET_SEGREGATION_ITEM',
    GET_SEGREGATION_ITEM_TYPES_REQUEST: 'Mcf/GET_SEGREGATION_ITEM_TYPES_REQUEST',
    GET_SEGREGATION_ITEM_TYPES_SUCCESS: 'Mcf/GET_SEGREGATION_ITEM_TYPES_SUCCESS',
    GET_SEGREGATION_ITEM_TYPES_FAILED: 'Mcf/GET_SEGREGATION_ITEM_TYPES_FAILED',
    GET_SEGREGATION_QUANTITY: 'Mcf/GET_SEGREGATION_QUANTITY',
    SET_SEGREGATION_QUANTITY: 'Mcf/SET_SEGREGATION_QUANTITY',
    SET_SEGREGATION_ITEM: 'Mcf/SET_SEGREGATION_ITEM',
    SET_SEGREGATION_ITEM_TYPES_REQUEST: 'Mcf/SET_SEGREGATION_ITEM_TYPES_REQUEST',
    SET_SEGREGATION_ITEM_TYPES_SUCCESS: 'Mcf/SET_SEGREGATION_ITEM_TYPES_SUCCESS',
    SET_SEGREGATION_ITEM_TYPES_FAILED: 'Mcf/SET_SEGREGATION_ITEM_TYPES_FAILED',
    GET_ITEM_SUB_CATEGORIES: 'Mcf/GET_ITEM_SUB_CATEGORIES',
    GET_ITEM_SUB_CATEGORIES_REQUEST: 'Mcf/GET_ITEM_SUB_CATEGORIES_REQUEST',
    GET_ITEM_SUB_CATEGORIES_SUCCESS: 'Mcf/GET_ITEM_SUB_CATEGORIES_SUCCESS',
    GET_ITEM_SUB_CATEGORIES_FAILED: 'Mcf/GET_ITEM_SUB_CATEGORIES_FAILED',
    ADD_MCF_SEGREGATION_REQUEST: 'Mcf/ADD_MCF_SEGREGATION_REQUEST',
    ADD_MCF_SEGREGATION_SUCCESS: 'Mcf/ADD_MCF_SEGREGATION_SUCCESS',
    ADD_MCF_SEGREGATION_FAILED: 'Mcf/ADD_MCF_SEGREGATION_FAILED',
    REMOVE_ITEM: 'Mcf/REMOVE_ITEM',
    REMOVE_SALE_ITEM: 'Mcf/REMOVE_SALE_ITEM'
};

export function mcfStockIn() {
    return action(types.MCF_STOCK_IN);
}

export function mcfStockTransfer() {
    return action(types.MCF_STOCK_TRANSFER);
}

export function mcfSale() {
    return action(types.MCF_SALE);
}

export function navigateToAddMcfStockIn() {
    return navigate(MODULE_ROUTE_KEYS.MCF, { screen: MCF_ROUTE_KEYS.ADD_MCF_STOCK_IN });
}

export function navigateToAddMcfStockTransfer() {
    return navigate(MODULE_ROUTE_KEYS.MCF, { screen: MCF_ROUTE_KEYS.ADD_MCF_STOCK_TRANSFER });
}

export function navigateToAddMcfSale() {
    return navigate(MODULE_ROUTE_KEYS.MCF, { screen: MCF_ROUTE_KEYS.ADD_MCF_SALE });
}

export function navigateToAddMcfSegregation() {
    return navigate(MODULE_ROUTE_KEYS.MCF, { screen: MCF_ROUTE_KEYS.ADD_MCF_SEGREGATION });
}

export function addMcfStockIn(data) {
    return action(types.ADD_MCF_STOCK_IN, { data });
}

export function getMcfItemName() {
    return action(types.GET_MCF_ITEM_NAME);
}

export function getMcfStockTransferTo(data) {
    return action(types.GET_MCF_STOCK_TRANSFER_TO, { data });
}

export function getMcfItemTypes() {
    return action(types.GET_MCF_ITEM_TYPES);
}

export function getAssociations(data) {
    return action(types.GET_ASSOCIATIONS, { data });
}

export function addMcfStockTransfer(data) {
    return action(types.SAVE_MCF_STOCK_TRANSFER, { data });
}

export function getRate(data) {
    return action(types.GET_RATE, { data });
}

export function addMcfSale(data) {
    return action(types.ADD_MCF_SALE, { data });
}

export function resetRate() {
    return action(types.RESET_RATE);
}

export function navigateToAddItem(data) {
    return navigate(MODULE_ROUTE_KEYS.MCF, { screen: MCF_ROUTE_KEYS.ADD_ITEM, params: { data } });
}

export function navigateToAddItemStockIn(data) {
    return navigate(MODULE_ROUTE_KEYS.MCF, { screen: MCF_ROUTE_KEYS.ADD_ITEM_STOCK_IN, params: { data } });
}

export function addStockInItem(data) {
    return action(types.ADD_STOCK_IN_ITEM, { data });
}

export function setStockInItemData(data) {
    return action(types.SET_STOCK_IN_ITEM, { data });
}

export function addSaleItem(data) {
    return action(types.ADD_SALE_ITEM, { data });
}

export function setSaleItemData(data) {
    return action(types.SET_SALE_ITEM, { data });
}

export function mcfSegregation() {
    return action(types.MCF_SEGREGATION);
}

export function getSegregationItem() {
    return action(types.GET_SEGREGATION_ITEM);
}

export function getSegregationQuantity(data) {
    return action(types.GET_SEGREGATION_QUANTITY, { data });
}

export function setSegregationQuantity(data) {
    return action(types.SET_SEGREGATION_QUANTITY, { data });
}

export function setSegregationItem(data) {
    return action(types.SET_SEGREGATION_ITEM, { data });
}

export function getItemSubCategories(data) {
    return action(types.GET_ITEM_SUB_CATEGORIES, { data });
}

export function removeItem(data) {
    return action(types.REMOVE_ITEM, { data });
}

export function removeSaleItem(data) {
    return action(types.REMOVE_SALE_ITEM, { data });
}
