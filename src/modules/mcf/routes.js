import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function UserNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.ADD_MCF_STOCK_IN} headerMode="none">
            <Screen name={ROUTE_KEYS.ADD_MCF_STOCK_IN} getComponent={() => require('./containers/AddMcfSockIn').default} />
            <Screen name={ROUTE_KEYS.ADD_MCF_STOCK_TRANSFER} getComponent={() => require('./containers/AddMcfStockTransfer').default} />
            <Screen name={ROUTE_KEYS.ADD_MCF_SALE} getComponent={() => require('./containers/AddMcfSale').default} />
            <Screen name={ROUTE_KEYS.ADD_ITEM} getComponent={() => require('./containers/AddItem').default} />
            <Screen name={ROUTE_KEYS.ADD_ITEM_STOCK_IN} getComponent={() => require('./containers/AddItemStockIn').default} />
            <Screen name={ROUTE_KEYS.ADD_MCF_SEGREGATION} getComponent={() => require('./containers/AddMcfSegregation').default} />
        </Navigator>
    );
}
