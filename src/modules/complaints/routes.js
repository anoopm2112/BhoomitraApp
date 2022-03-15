import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();
const ComplaintsTopTab = createMaterialTopTabNavigator();

export default function ServiceNavigation() {
    return (
        <Navigator headerMode="none">
            <Screen name={ROUTE_KEYS.COMPLAINTLIST} getComponent={() => require('./containers/ComplaintsList').default} />
            <Screen name={ROUTE_KEYS.COMPLAINTADD} getComponent={() => require('./containers/ComplaintAdd').default} />
            <Screen name={ROUTE_KEYS.COMPLAINTIMAGE} getComponent={() => require('./containers/ComplaintImage').default} />
            <Screen name={ROUTE_KEYS.COMPLAINTITEMLIST} getComponent={() => require('./containers/ComplaintItemList').default} />
        </Navigator>
    );
}

const ComplaintTopNavigator = () => {
    const ComplaintsTopBar = require('./containers/ComplaintsTopBar').default;
    return (
        <ComplaintsTopTab.Navigator
            swipeEnabled={false}
            tabBar={props => <ComplaintsTopBar {...props} />}>
            <ComplaintsTopTab.Screen
                name={ROUTE_KEYS.COMPLAINTSINPROGRESS}
                getComponent={() => require('./containers/ComplaintsInProgress').default}
                options={{ title: 'pending' }}
            />
            {/* <ComplaintsTopTab.Screen
            name={ROUTE_KEYS.COMPLAINTSDONE}
            component={ComplaintsDone}
            options={{ title: 'done' }}
        /> */}
        </ComplaintsTopTab.Navigator>
    );
}
export { ComplaintTopNavigator };
