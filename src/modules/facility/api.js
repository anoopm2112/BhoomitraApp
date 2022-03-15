import { api } from '../../common';
import * as Actions from './actions';

const { types: ActionTypes } = Actions;
const { restAPI } = api;

export function fetchNearestMcf(customerNumber, params) {
    let payload = {
        types: [ActionTypes.FETCH_MCF_API_REQUEST, ActionTypes.FETCH_MCF_API_SUCCESS, ActionTypes.FETCH_MCF_API_FAILED],
        params
    };
    return {
        endpoint: `schedule/customers/${customerNumber}/nearest-mcf`,
        api: restAPI.get,
        payload
    };
}