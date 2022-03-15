import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();
const EntrollmentTopTab = createMaterialTopTabNavigator();
const EntrollmentSubcriptionTopTab = createMaterialTopTabNavigator();

export default function EnrollmentNavigation() {
    return (
        <Navigator headerMode="none">
            <Screen name={ROUTE_KEYS.ENROLLMENTSUBSCRIPTION} component={EntrollmentSubscriptionTopNavigator} />
        </Navigator>
    );
}

const EntrollmentTopNavigator = () => {
    const EntrollmentTopBar = require('./containers/EntrollmentTopBar').default;
    return (
        <EntrollmentTopTab.Navigator
            swipeEnabled={false}
            tabBar={props => <EntrollmentTopBar {...props} />}>
            <EntrollmentTopTab.Screen
                name={ROUTE_KEYS.ENROLLMENTINPROGRESS}
                getComponent={() => require('./containers/EntrollmentInProgress').default}
                options={{ title: 'customers' }}
            />
            {/* <EntrollmentTopTab.Screen
            name={ROUTE_KEYS.ENROLLMENTDONE}
            component={EntrollmentDone}
            options={{ title: 'done' }}
        /> */}
            <EntrollmentTopTab.Screen
                name={ROUTE_KEYS.ENROLLMENTQRCODE}
                getComponent={() => require('./containers/EntrollmentQrCode').default}
                options={{ title: 'qr_code' }}
            />
        </EntrollmentTopTab.Navigator>
    );
}

const EntrollmentSubscriptionTopNavigator = () => {
    const EnrollmentSubscriptionTopBar = require('./containers/EnrollmentSubscriptionTopBar').default;
    return (
        <EntrollmentSubcriptionTopTab.Navigator
            swipeEnabled={false}
            tabBar={props => <EnrollmentSubscriptionTopBar {...props} />}>
            <EntrollmentSubcriptionTopTab.Screen
                name={ROUTE_KEYS.ENROLLMENTSUBSCRIBED}
                getComponent={() => require('./containers/EnrollmentSubscribed').default}
                options={{ title: 'subscribed' }}
            />
            <EntrollmentSubcriptionTopTab.Screen
                name={ROUTE_KEYS.ENROLLMENTSUBSCRIPTION}
                getComponent={() => require('./containers/EnrollmentSubscription').default}
                options={{ title: 'subscriptions' }}
            />
        </EntrollmentSubcriptionTopTab.Navigator>
    );
}

export { EntrollmentTopNavigator }