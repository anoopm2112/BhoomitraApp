import flow from 'lodash/fp/flow';
import { STATE_REDUCER_KEY } from './constants';

export const getSplash = state => state[STATE_REDUCER_KEY];

const tourData = splash => splash.tourData;
export const getAppTourData = flow(getSplash, tourData);
