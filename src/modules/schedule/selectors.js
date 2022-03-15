import flow from 'lodash/fp/flow';
import _ from 'lodash';
import { STATE_REDUCER_KEY } from './constants';

export const getShedule = state => state[STATE_REDUCER_KEY];

const scheduleList = shedule => shedule.scheduleList;
export const getScheduleList = flow(getShedule, scheduleList);