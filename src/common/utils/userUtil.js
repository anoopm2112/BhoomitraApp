import { ROLE_TYPES, MODULES } from '../constants';

export function getUserId(user = {}) {
    return user.info ? user.info.id : '';
}

export function getFullName(user = {}) {
    if (user.info) {
        const firstName = user.info.firstName ? ' ' + user.info.firstName : '';
        const middleName = user.info.middleName ? ' ' + user.info.middleName : '';
        const lastName = user.info.lastName ? ' ' + user.info.lastName : '';
        return `${firstName}${middleName} ${lastName}`;
    }
    return '';
}

export function getDefaultOrganization(userInfo = {}) {
    const { defaultOrganization } = userInfo;
    if (defaultOrganization) {
        return defaultOrganization;
    }
    return undefined;
}

export function hasDeveloperRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_DEVELOPER);
    }
}

export function hasAdminRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_ADMIN);
    }
}

export function hasGtRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_GT);
    }
}

export function hasCustomerRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_CUSTOMER);
    }
}

export function hasMcfUserRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_MCF_USER);
    }
}

export function hasRrfUserRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_RRF_USER);
    }
}

export function hasCkcUserRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_CKC_USER);
    }
}

export function hasSurveyorRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_SURVEYOR);
    }
}

export function hasSupervisorRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => [ROLE_TYPES.ROLE_SW_SUPERVISOR, ROLE_TYPES.ROLE_SURVEYOR_SUPERVISOR].includes(role.key));
    }
}

export function hasSwSupervisorRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_SW_SUPERVISOR);
    }
}

export function hasSurveyorSupervisorRole(userInfo = {}) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => role.key === ROLE_TYPES.ROLE_SURVEYOR_SUPERVISOR);
    }
}

export function hasAnyRole(userInfo = {}, roles = []) {
    if (userInfo.roles) {
        return userInfo.roles.some(role => roles.includes(role.key));
    }
}

export function hasEnrollmentsModule(userInfo = {}) {
    let permission = false;
    if (userInfo.organizations) {
        userInfo.organizations.some(org => {
            if (org.modules) {
                permission = org.modules.some(module => module.parentName === MODULES.MODULE_ENROLLMENTS);
            }
            return permission;
        });
        return permission;
    }
}

export function hasServicesModule(userInfo = {}) {
    let permission = false;
    if (userInfo.organizations) {
        userInfo.organizations.some(org => {
            if (org.modules) {
                permission = org.modules.some(module => module.parentName === MODULES.MODULE_SERVICES);
            }
            return permission;
        });
        return permission;
    }
}

export function hasComplaintsModule(userInfo = {}) {
    let permission = false;
    if (userInfo.organizations) {
        userInfo.organizations.some(org => {
            if (org.modules) {
                permission = org.modules.some(module => module.parentName === MODULES.MODULE_COMPLAINTS);
            }
            return permission;
        });
        return permission;
    }
}