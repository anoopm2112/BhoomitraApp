import { actions } from '../../common';

const { navigation: { navigate } } = actions;

export function navigateTo(route, screen) {
    return navigate(route, { screen });
}
