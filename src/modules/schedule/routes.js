import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function UserNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.SCHEDULELIST} headerMode="none">
            <Screen name={ROUTE_KEYS.SCHEDULELIST} getComponent={() => require('./containers/ScheduleItemList').default} />
        </Navigator>
    );
}
