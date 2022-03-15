import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getReport = state => state[STATE_REDUCER_KEY];

const baseImage = report => report.baseImage;
export const getBaseImage = flow(getReport, baseImage);