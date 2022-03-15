import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getHelpSupport = state => state[STATE_REDUCER_KEY];

const supportData = helpsupport => helpsupport.setSupport;
export const getSupportData = flow(getHelpSupport, supportData);