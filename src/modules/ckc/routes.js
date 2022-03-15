import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function UserNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.ADD_CKC_PICK_UP} headerMode="none">
            <Screen name={ROUTE_KEYS.ADD_CKC_PICK_UP} getComponent={() => require('./containers/AddCkcPickUp').default} />
            <Screen name={ROUTE_KEYS.ADD_CKC_SALE} getComponent={() => require('./containers/AddCkcSale').default} />
            <Screen name={ROUTE_KEYS.ADD_CKC_ITEM} getComponent={() => require('./containers/AddCkcItem').default} />
        </Navigator>
    );
}
