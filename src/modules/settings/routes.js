import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function DashboardNavigation() {
    return (
        <Navigator headerMode="none">
            <Screen name={ROUTE_KEYS.SETTINGS} getComponent={() => require('./containers/Settings').default} />
            <Screen name={ROUTE_KEYS.DEVELOPER_OPTIONS} getComponent={() => require('./containers/DeveloperOptions').default} />
        </Navigator>
    );
}
