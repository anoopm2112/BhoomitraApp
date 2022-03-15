import React from 'react';
import { logger } from 'react-native-logs';
import BuildConfig from 'react-native-build-config';
import { colorConsoleAfterInteractions } from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';
import InfoToast from 'react-native-toast-message/src/components/info';
import SuccessToast from 'react-native-toast-message/src/components/success';
import ErrorToast from 'react-native-toast-message/src/components/error';

const log = logger.createLogger({
    transport: colorConsoleAfterInteractions,
});

if (__DEV__) {
    log.setSeverity('debug');
} else {
    log.setSeverity('error');
}

export { log };

const toastConfig = {
    success: ({ hide, ...rest }) => (
        <SuccessToast {...rest} onTrailingIconPress={hide} text1NumberOfLines={2} />
    ),
    error: ({ hide, ...rest }) => (
        <ErrorToast {...rest} onTrailingIconPress={hide} text1NumberOfLines={2} />
    ),
    info: ({ hide, ...rest }) => (
        <InfoToast {...rest} onTrailingIconPress={hide} text1NumberOfLines={2} />
    )
};

export { toastConfig };

export default {
    apiServer: {
        url: BuildConfig.API_SERVER_URL
    },
    authServer: {
        url: BuildConfig.AUTH_SERVER_URL
    },
    oneSignal: {
        appId: 'fd175534-41f6-424d-872b-d31ff6bdb50d'
    }
};
