import { api } from '../../common';
import * as Actions from './actions';

const { types: ActionTypes } = Actions;
const { restAPI } = api;

export function saveBugReport(params) {
    let payload = {
        types: [ActionTypes.SAVE_BUGREPORT_API_REQUEST, ActionTypes.SAVE_BUGREPORT_API_SUCCESS, ActionTypes.SAVE_BUGREPORT_API_FAILED],
        body: params
    };
    return {
        endpoint: 'user/report-a-bug',
        api: restAPI.post,
        payload
    };
}