import { actions, MODULE_ROUTE_KEYS } from '../../common';
import { ROUTE_KEYS as PERMISSIONS_ROUTE_KEYS } from './constants';

const { action, navigation: { navigateWithReset }  } = actions;

export const types = {
    GRANT_PERMISSIONS: 'Permissions/GRANT_PERMISSIONS',
    DENY_PERMISSIONS: 'Permissions/DENY_PERMISSIONS',
    SHOW_GRANT_PERMISSIONS_MODAL: 'Permissions/SHOW_GRANT_PERMISSIONS_MODAL',
    SHOW_ALLOW_BLOCKED_PERMISSIONS_MODAL: 'Permissions/SHOW_ALLOW_BLOCKED_PERMISSIONS_MODAL',
    RECHECK_PERMISSIONS: 'Permissions/RECHECK_PERMISSIONS',
};

export function navigateToPermissionsScreen() {
    return navigateWithReset(MODULE_ROUTE_KEYS.PERMISSIONS, { screen: PERMISSIONS_ROUTE_KEYS.PERMISSION_GRANT })
}

export function grantPermissions() {
    return action(types.GRANT_PERMISSIONS);
}

export function denyPermissions() {
    return action(types.DENY_PERMISSIONS);
}

export function showGrantPermissionsModal(data) {
    return action(types.SHOW_GRANT_PERMISSIONS_MODAL, { data })
}

export function showAllowBlockedPermissionsModal(data) {
    return action(types.SHOW_ALLOW_BLOCKED_PERMISSIONS_MODAL, { data })
}

export function recheckPermissions(data) {
    return action(types.RECHECK_PERMISSIONS, { data });
}
