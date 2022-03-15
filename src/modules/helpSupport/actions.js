import { actions } from '../../common';

const { action, navigation: { navigate } } = actions;

export const types = {
    FETCH_DEPARTMENT: 'HelpSupport/FETCH_DEPARTMENT',
    SET_SUPPORT_DATA: 'HelpSupport/SET_SUPPORT_DATA'
}

export function fetchDepartment(data) {
    return action(types.FETCH_DEPARTMENT, { data });
}

export function setSupportData(data) {
    return action(types.SET_SUPPORT_DATA, { data });
}