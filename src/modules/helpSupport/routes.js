import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function ReportBugNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.FEEDBACKSUPPORT} headerMode="none">
            <Screen name={ROUTE_KEYS.FEEDBACKSUPPORT} getComponent={() => require('./containers/SendFeedBack').default} />
            <Screen name={ROUTE_KEYS.EMAILSUPPORT} getComponent={() => require('./containers/EmailSupport').default} />
            <Screen name={ROUTE_KEYS.PHONESUPPORT} getComponent={() => require('./containers/PhoneSupport').default} />
        </Navigator>
    );
}
