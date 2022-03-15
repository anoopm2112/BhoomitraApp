import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function ReportBugNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.REPORT_BUG} headerMode="none">
            <Screen name={ROUTE_KEYS.REPORT_BUG} getComponent={() => require('./containers/ReportBug').default} />
        </Navigator>
    );
}
