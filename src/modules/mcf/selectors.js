import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getMcf = state => state[STATE_REDUCER_KEY];

const mcfItemNames = mcf => mcf.mcfItemNames;
export const getMcfItemNames = flow(getMcf, mcfItemNames);

const mcfFacilityType = mcf => mcf.mcfFacilityType;
export const getMcfFacilityType = flow(getMcf, mcfFacilityType);

const mcfItemTypes = mcf => mcf.mcfItemTypes;
export const getMcfItemTypes = flow(getMcf, mcfItemTypes);

const mcfAssociations = mcf => mcf.mcfAssociations;
export const getMcfAssociations = flow(getMcf, mcfAssociations);

const rate = mcf => mcf.rate;
export const getRate = flow(getMcf, rate);

const stockInItems = mcf => mcf.stockInItems;
export const getStockInItems = flow(getMcf, stockInItems);

const saleItems = mcf => mcf.saleItems;
export const getSaleItems = flow(getMcf, saleItems);

const segregationItemNames = mcf => mcf.segregationItemNames;
export const getSegregationItemNames = flow(getMcf, segregationItemNames);

const segregationQuantity = mcf => mcf.segregationQuantity;
export const getSegregationQuantity = flow(getMcf, segregationQuantity);

const itemSubCatogories = mcf => mcf.itemSubCategories;
export const getItemSubCatogories = flow(getMcf, itemSubCatogories);
