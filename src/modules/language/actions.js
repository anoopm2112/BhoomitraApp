import { actions, MODULE_ROUTE_KEYS } from '../../common';
import { ROUTE_KEYS as LANGUAGE_ROUTE_KEYS } from './constants';

const { action, navigation: { navigateWithReset } } = actions;

export const types = {
    LANGUAGE_SELECT: 'Language/LANGUAGE_SELECT'
};

export function navigateToLanguageSelectScreen() {
    return navigateWithReset(MODULE_ROUTE_KEYS.LANGUAGE, { screen: LANGUAGE_ROUTE_KEYS.LANGUAGE_SELECT });
}

export function languageSelect(data) {
    return action(types.LANGUAGE_SELECT, { data });
}
