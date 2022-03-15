import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getCkc = state => state[STATE_REDUCER_KEY];

const ckcLsgiType = ckc => ckc.lsgiType;
export const getCkcLsgiType = flow(getCkc, ckcLsgiType);

const ckcLsgiName = ckc => ckc.lsgiName;
export const getCkcLsgiName = flow(getCkc, ckcLsgiName);

const ckcMcfRrfName = ckc => ckc.mcfRrfName;
export const getCkcMcfRrfName = flow(getCkc, ckcMcfRrfName);

const ckcgoDownsName = ckc => ckc.goDownsName;
export const getCkcDoDownsName = flow(getCkc, ckcgoDownsName);
