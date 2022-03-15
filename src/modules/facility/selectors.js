import flow from 'lodash/fp/flow';
import _ from 'lodash';
import { STATE_REDUCER_KEY } from './constants';

export const getfacility = state => state[STATE_REDUCER_KEY];

const facilityList = facility => facility;
export const getFacilityList = flow(getfacility, facilityList);
