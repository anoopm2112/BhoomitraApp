import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function DummyNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.DUMMY} headerMode="none">
            <Screen name={ROUTE_KEYS.DUMMY} getComponent={() => require('./containers/Dummy').default} />
            <Screen name={ROUTE_KEYS.DUMMYLOC} getComponent={() => require('./containers/DummyLocation').default} />
        </Navigator>
    );
}
