import { actions } from '../../common';

const { action } = actions;

const { navigation: { navigate } } = actions;

export const types = {
    SET_DEVELOPER_OPTIONS: 'Settings/SET_DEVELOPER_OPTIONS',
    RESET_DEVELOPER_OPTIONS: 'Settings/RESET_DEVELOPER_OPTIONS',
    FORCE_UPDATE: 'Settings/FORCE_UPDATE',
    ANIMATION_DATA: 'Settings/ANIMATION_DATA',
    SET_ANIMATION_DATA: 'Settings/SET_ANIMATION_DATA',
}

export function navigateTo(route, screen) {
    return navigate(route, { screen });
}

export function setDeveloperOptions(data) {
    return action(types.SET_DEVELOPER_OPTIONS, { data });
}

export function resetDeveloperOptions() {
    return action(types.RESET_DEVELOPER_OPTIONS);
}

export function forceUpdate() {
    return action(types.FORCE_UPDATE);
}

export function componentAnimation(data) {
    return action(types.ANIMATION_DATA, { data })
}

export function setComponentAnimation(data) {
    return action(types.SET_ANIMATION_DATA, { data })
}