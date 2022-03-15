import { Platform } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';
import { PermissionsAndroid } from "react-native";

export const API_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';

export const API_TIME_FORMAT = 'HH:mm:ss.SSS';

export const DATE_TIME_FORMAT = 'DD/MM/YYYY hh:mm A';

export const DATE_FORMAT = 'DD/MM/YYYY';

export const TIME_FORMAT = 'hh:mm A';

export const DATE_TIME_FORMAT_DATEPICKER = 'MM/DD/YYYY HH:mm:ss';

export const AUTH_SERVER_ENDPOINT = "auth/realms/bhoomitra/protocol/openid-connect/token";

export const CLIENT_ID = "mobile-app";

export const ERROR_CODES = {
    JWT_EXPIRED: 4401
};

export const RESOURCE_MAPPING = {
    SERVICE_ENROLLMENT: 'in.trois.common.model.entity.Customer.ServiceEnrollment',
    MOBILE_HOME: 'in.trois.common.model.entity.MobileHome',
    QRCODE: 'in.trois.common.model.entity.QRCode',
    SERVICE: 'in.trois.common.model.entity.Service',
    USER: 'in.trois.common.model.entity.User',
    SETTINGS: 'in.trois.common.model.entity.MobileSettings',
    PROFILE: 'in.trois.common.model.entity.MobileProfile',
    ENROLLMENT: 'in.trois.common.model.entity.Customer.Enrollment'
};
export const ACTION_MAPPING = {
    SERVICE_ENROLLMENT: {
        ACCESS_SERVICE_ENROLLMENT_IN_NAV: 'ACCESS_SERVICE_ENROLLMENT_IN_NAV',
        ADD_SERVICE_ENROLLMENT: 'ADD_SERVICE_ENROLLMENT',
        DELETE_SERVICE_ENROLLMENT: 'DELETE_SERVICE_ENROLLMENT',
        DO_SERVICE_ENROLLEMENT: 'DO_SERVICE_ENROLLEMENT',
        EDIT_SERVICE_ENROLLMENT: 'EDIT_SERVICE_ENROLLMENT',
        LIST_SERVICE_ENROLLMENT: 'LIST_SERVICE_ENROLLMENT'
    },
    ENROLLMENT: {
        ENROLLMENT_HISTORY: 'ENROLLMENT_HISTORY'
    },
    MOBILE_HOME: {
        ACCESS_HOME_IN_MBT: 'ACCESS_HOME_IN_MBT',
        COMPLAINTS_CARD: 'COMPLAINTS_CARD',
        CUSTOMER_COMPLAINTS_CARD: 'CUSTOMER_COMPLAINTS_CARD',
        INCIDENT_REPORTING_CARD: 'INCIDENT_REPORTING_CARD',
        NEAREST_MCF_CARD: 'NEAREST_MCF_CARD',
        PAYMENTS_CARD: 'PAYMENTS_CARD',
        SCHEDULES_CARD: 'SCHEDULES_CARD',
        SERVICES_CARD: 'SERVICES_CARD',
        SERVICE_HISTORY_CARD: 'SERVICE_HISTORY_CARD',
        SPECIAL_SERVICES_CARD: 'SPECIAL_SERVICES_CARD',
        START_SURVEY_CARD: 'START_SURVEY_CARD',
        SUBSCRIPTION_CARD: 'SUBSCRIPTION_CARD',
        MCF_STOCK_IN_CARD: 'MCF_STOCK_IN_CARD',
        MCF_STOCK_TRANSFER_CARD: 'MCF_STOCK_TRANSFER_CARD',
        MCF_SALE_CARD: 'MCF_SALE_CARD',
        RRF_STOCK_IN_CARD: 'RRF_STOCK_IN_CARD',
        RRF_SALE_CARD: 'RRF_SALE_CARD',
        CKC_PICKUP_CARD: 'CKC_PICKUP_CARD',
        CKC_SALE_CARD: 'CKC_SALE_CARD',
        PAYMENT_HISTORY_CARD: 'PAYMENT_HISTORY_CARD',
        INVOICE_HISTORY_CARD: 'INVOICE_HISTORY_CARD'
    },
    QRCODE: {
        ACCESS_QRCODE_IN_NAV: 'ACCESS_QRCODE_IN_NAV',
    },
    SERVICE: {
        DO_SERVICE_EXECUTION: 'DO_SERVICE_EXECUTION',
        SERVICE_HISTORY: 'SERVICE_HISTORY'
    },
    USER: {
        ACCESS_USER_IN_NAV: 'ACCESS_USER_IN_NAV',
        ADD_USER: 'ADD_USER',
        DELETE_USER: 'DELETE_USER',
        EDIT_USER: 'EDIT_USER',
        LIST_USERS: 'LIST_USERS'
    },
    SETTINGS: {
        SHOW_FORCE_UPDATE: 'SHOW_FORCE_UPDATE'
    },
    PROFILE: {
        EDIT_PROFILE: 'EDIT_PROFILE'
    }
};

export const VALIDATION_RULES = {
    PHONE_REG_EXP: /^[3-9]\d{9}$/,
    DIGIT_REG_EXP: /^\d+$/,
    DECIMAL_REG_EXP: /^[0-9]*\.[0-9]+/,
    DIGIT_OR_DECIMAL_REG_EXP: /^[0-9]*(\.[0-9]+)?$/,
    EMAIL_REG_EXP: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    EN_ONLY_REG_EXP: /^[a-zA-Z\s.!,']*$/
};

export const ROLE_TYPES = {
    ROLE_GT: 'ROLE_GT',
    ROLE_CUSTOMER: 'ROLE_CUSTOMER',
    ROLE_SURVEYOR: 'ROLE_SURVEYOR',
    ROLE_MCF_USER: 'ROLE_MCF_USER',
    ROLE_RRF_USER: 'ROLE_RRF_USER',
    ROLE_CKC_USER: 'ROLE_CKC_USER',
    ROLE_SW_SUPERVISOR: 'ROLE_SW_SUPERVISOR',
    ROLE_SURVEYOR_SUPERVISOR: 'ROLE_SURVEYOR_SUPERVISOR'
};

export const MODULES = {
    MODULE_ENROLLMENTS: "enrollment",
    MODULE_SERVICES: "service",
    MODULE_COMPLAINTS: "complaints"
};

export const ORGANIZATION_TYPE = {
    STOCK_IN: 'SP',
    STOCK_TRANSFER_TO: 'RRF',
    SALE: 'LSGI-Vendor',
    CKC_SALE: 'CKC-Vendor'
};

export const PERMISSIONS_REQUIRED = Platform.OS === 'android' ? [
    // PermissionsAndroid.PERMISSIONS.CAMERA,
    // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    // PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    // PermissionsAndroid.PERMISSIONS.CALL_PHONE
] : Platform.OS === 'ios' ? [
    // PERMISSIONS.IOS.CAMERA,
    // PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    // PERMISSIONS.IOS.CONTACTS,
] : [];

export const LANGUAGES = [
    {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octobre', 'Novembre', 'Decembre'],
        monthNamesShort: ['Jan.', 'Feb.', 'Mar', 'Apr', 'May', 'Ju', 'Jul.', 'Aug', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
        dayNames: ['Monday', 'Tuesday', 'Wenesday', 'Thursday', 'Friday', 'Satuday', 'Sunday'],
        dayNamesShort: ['Mon.', 'Tue.', 'Wen.', 'Thu.', 'Fri.', 'Sat.', 'San.'],
        today: 'Today',
        locale: 'en_IN'
    },
    {
        monthNames: ['ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മെയ്', 'ജൂൺ', 'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'],
        monthNamesShort: ['ജനു.', 'ഫെബ്രു.', 'മാർ', 'ഏപ്രി', 'മെയ്', 'ജൂൺ', 'ജൂലൈ.', 'ഓഗ.', 'സെപ്റ്റം.', 'ഒക്ടോ.', 'നവം.', 'ഡിസം.'],
        dayNames: ['തിങ്കളാഴ്ച', 'ചൊവ്വാഴ്ച', 'ബുധനാഴ്ച', 'വ്യാഴാഴ്ച', 'വെള്ളിയാഴ്ച', 'ശനിയാഴ്ച', 'ഞായറാഴ്ച',],
        dayNamesShort: ['തിങ്ക.', 'ചൊവ', 'ബുധ.', 'വ്യാഴ.', 'വെള്ളി.', 'ശനി.', 'ഞായ.',],
        today: 'ഇന്ന്',
        locale: 'ml_IN'
    },
    {
        monthNames: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
        monthNamesShort: ['जाने.', 'फेब्रु.', 'मार्च.', 'एप्रि.', 'मे', 'जून', 'जुलै', 'ऑग.', 'सप्टें.', 'ऑक्ट.', 'नोव्हे.', 'डिसें.'],
        dayNames: ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवारी',],
        dayNamesShort: ['सोम.', 'मंग', 'बुध.', 'गुरु.', 'शुक्र.', 'शनि.', 'रवि.',],
        today: 'आज',
        locale: 'mr_IN'
    },
];

export const LANGUAGESI18N =
    [
        {
            locale: 'en_IN',
            dayNames: {
                short: ['Mon.', 'Tue.', 'Wen.', 'Thu.', 'Fri.', 'Sat.', 'San.'],
                long: ['Monday', 'Tuesday', 'Wenesday', 'Thursday', 'Friday', 'Satuday', 'Sunday'],
            },
            monthNames: {
                short: ['Jan.', 'Feb.', 'Mar', 'Apr', 'May', 'Ju', 'Jul.', 'Aug', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
                long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            },
        },
        {
            locale: 'ml_IN',
            dayNames: {
                short: ['തി.', 'ചൊ', 'ബു.', 'വ്യാ.', 'വെ.', 'ശ.', 'ഞാ.'],
                long: ['തിങ്കളാഴ്ച', 'ചൊവ്വാഴ്ച', 'ബുധനാഴ്ച', 'വ്യാഴാഴ്ച', 'വെള്ളിയാഴ്ച', 'ശനിയാഴ്ച', 'ഞായറാഴ്ച',],
            },
            monthNames: {
                short: ['ജനു.', 'ഫെബ്രു.', 'മാർ', 'ഏപ്രി', 'മെയ്', 'ജൂൺ', 'ജൂലൈ.', 'ഓഗ.', 'സെപ്റ്റം.', 'ഒക്ടോ.', 'നവം.', 'ഡിസം.'],
                long: ['ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മെയ്', 'ജൂൺ', 'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'],
            },
        },
        {
            locale: 'mr_IN',
            dayNames: {
                short: ['सोम.', 'मंग', 'बुध.', 'गुरु.', 'शुक्र.', 'शनि.', 'रवि.',],
                long: ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवारी',],
            },
            monthNames: {
                short: ['जाने.', 'फेब्रु.', 'मार्च.', 'एप्रि.', 'मे', 'जून', 'जुलै', 'ऑग.', 'सप्टें.', 'ऑक्ट.', 'नोव्हे.', 'डिसें.'],
                long: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
            },
        },
    ];

export const COLOR_SCHEME = {
    BLUE_LIGHT: 'blue-light',
    GREEN_LIGHT: 'green-light'
};

export const API_PROVIDER_TYPE = {
    NOTIFICATION: 'Notification'
};
