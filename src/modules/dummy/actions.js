import { MODULE_ROUTE_KEYS } from '../../common';
import { ROUTE_KEYS as LOGIN_ROUTE_KEYS } from '../user/constants';
import { actions } from '../../common';

const { navigation: { navigateWithReset } } = actions;
const { LOGIN_FORM } = LOGIN_ROUTE_KEYS;

export function navigateToLogin() {
    return navigateWithReset(MODULE_ROUTE_KEYS.USER, { screen: LOGIN_FORM });
}

export function navigateToLanguageSelect() {
    return navigateWithReset(MODULE_ROUTE_KEYS.LANGUAGE);
}
