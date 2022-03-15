import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';
import Login from './containers/Login';
import PassCode from './containers/PassCode';

const { Navigator, Screen } = createStackNavigator();

export default function UserNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.LOGIN_FORM} headerMode="none">
            <Screen name={ROUTE_KEYS.LOGIN_FORM} component={Login} />
            <Screen name={ROUTE_KEYS.FORGOT_PASSWORD} getComponent={() => require('./containers/ForgotPassword').default} />
            <Screen name={ROUTE_KEYS.RESET_PASSWORD} getComponent={() => require('./containers/ResetPassword').default} />
            <Screen name={ROUTE_KEYS.CHANGE_PASSWORD} getComponent={() => require('./containers/ChangePassword').default} />
            <Screen name={ROUTE_KEYS.OTP_VERIFICATION} getComponent={() => require('./containers/OtpVerification').default} />
            <Screen name={ROUTE_KEYS.EDIT_PROFILE} getComponent={() => require('./containers/EditProfile').default} />
            <Screen name={ROUTE_KEYS.MY_PROFILE} getComponent={() => require('./containers/MyProfile').default} />
            <Screen name={ROUTE_KEYS.PASSCODE} component={PassCode} />
        </Navigator>
    );
}
