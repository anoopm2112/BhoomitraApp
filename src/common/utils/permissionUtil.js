import _ from 'lodash';
import { getKeyByValue } from './apiUtil';
import { RESOURCE_MAPPING } from '../../common/constants';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, RESULTS, PERMISSIONS, requestMultiple } from 'react-native-permissions';

export const formatPermission = (roles = []) => {
    let roleDetails = {};
    _.forEach(roles, (role) => {
        _.forEach(role.resourcePermissions, (permission) => {
            let { resource = {}, actionIds } = permission;
            if (!_.has(roleDetails, getKeyByValue(RESOURCE_MAPPING, resource.name))) {
                _.set(roleDetails, getKeyByValue(RESOURCE_MAPPING, resource.name), { resourceActions: _.get(resource, 'resourceActions', []), actionIds: [actionIds] });
            } else {
                _.set(roleDetails, `${getKeyByValue(RESOURCE_MAPPING, resource.name)}.actionIds`, [..._.get(roleDetails, `${getKeyByValue(RESOURCE_MAPPING, resource.name)}.actionIds`), actionIds]);
            }
        });
    });
    return roleDetails;
};

const checkPermissions = (userRoles, resourceName, resourceActionId) => {
    let { actionIds = [], resourceActions = [] } = _.get(userRoles, getKeyByValue(RESOURCE_MAPPING, resourceName), {});
    let currentAction = _.find(resourceActions, ['actionId', resourceActionId]) || null;
    if (actionIds.length < 1 || resourceActions.length < 1 || currentAction === null) {
        return false;
    } else {
        return actionIds.some((action) => (action & currentAction.bitwiseValue) > 0);
    }
};

export const hasAccessPermission = (userRoles, resourceName, resourceActionId) => {
    return checkPermissions(userRoles, resourceName, resourceActionId);
};

export const locationPermissionCheck = async () => {
    let checkStatus;
    checkStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (checkStatus) {
        return checkStatus;
    }
}

export const locationPermissionRequest = async () => {
    let requestStatus;
    if (Platform.OS === 'android') {
        requestStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    } else if (Platform.OS === 'ios') {
        requestStatus = await requestMultiple([PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.LOCATION_ALWAYS]);
    }
    return requestStatus;
}