import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function UserNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.ADD_RRF_STOCK_IN} headerMode="none">
            <Screen name={ROUTE_KEYS.ADD_RRF_STOCK_IN} getComponent={() => require('./containers/AddRrfSockIn').default} />
            <Screen name={ROUTE_KEYS.ADD_RRF_SALE} getComponent={() => require('./containers/AddRrfSale').default} />
            <Screen name={ROUTE_KEYS.ADD_RRF_SHERDDED_PLASTIC} getComponent={() => require('./containers/AddRrfSherddedPlastic').default} />
        </Navigator>
    );
}
