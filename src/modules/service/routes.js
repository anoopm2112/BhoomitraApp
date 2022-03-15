import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();
const ServiceTopTab = createMaterialTopTabNavigator();
const InvoiceHistoryTopTab = createMaterialTopTabNavigator();
const PaymentHistoryTopTab = createMaterialTopTabNavigator();

export default function ServiceNavigation() {
    return (
        <Navigator headerMode="none">
            <Screen name={ROUTE_KEYS.SERVICEBARCODE} getComponent={() => require('./containers/ServiceBarcode').default} />
            <Screen name={ROUTE_KEYS.SERVICELIST} getComponent={() => require('./containers/ServiceItemList').default} />
            <Screen name={ROUTE_KEYS.COMPLAINTLIST} getComponent={() => require('./containers/ServiceComplaintItemList').default} />
            <Screen name={ROUTE_KEYS.SERVICEREQUESTLIST} getComponent={() => require('./containers/ServiceRequestItemList').default} />
            <Screen name={ROUTE_KEYS.SERVICENEWREQUEST} getComponent={() => require('./containers/ServiceNewRequest').default} />
            <Screen name={ROUTE_KEYS.SERVICEHISTORY} getComponent={() => require('./containers/ServiceHistory').default} />
            <Screen name={ROUTE_KEYS.SERVICEDONE} getComponent={() => require('./containers/ServiceDone').default} />
            <Screen name={ROUTE_KEYS.SERVICEPAYMENT} getComponent={() => require('./containers/ServicePayment').default} />
            <Screen name={ROUTE_KEYS.PAYMENTCOLLECTIONLIST} getComponent={() => require('./containers/PaymentCollectionList').default} />
            <Screen name={ROUTE_KEYS.PAYMENTCOLLECTION} getComponent={() => require('./containers/PaymentCollection').default} />
            <Screen name={ROUTE_KEYS.INVOICEHISTORYCOLLECTIONLIST} component={InvoiceHistoryTopBarNavigator} />
            <Screen name={ROUTE_KEYS.INVOICEHISTORYCOLLECTIONDETAILS} getComponent={() => require('./containers/InvoiceHistoryCollectionDetails').default} />
            <Screen name={ROUTE_KEYS.PAYMENTHISTORY} component={PaymentHistoryTopBarNavigator} />
            <Screen name={ROUTE_KEYS.PAYMNETHISTORYDETAILS} getComponent={() => require('./containers/PaymentHistoryDetails').default} />
            <Screen name={ROUTE_KEYS.INVOICEHISTORYSUBSCRIPTIONDETAILS} getComponent={() => require('./containers/InvoiceHistorySubscriptionDetails').default} />
        </Navigator>
    );
}

const ServiceTopNavigator = () => {
    const ServiceTopBar = require('./containers/ServiceTopBar').default;
    return (
        <ServiceTopTab.Navigator
            swipeEnabled={false}
            tabBar={props => <ServiceTopBar {...props} />}>
            <ServiceTopTab.Screen
                name={ROUTE_KEYS.SERVICEINPROGRESS}
                getComponent={() => require('./containers/ServiceInProgress').default}
                options={{ title: 'pending' }}
            />
            {/* <ServiceTopTab.Screen
            name={ROUTE_KEYS.SERVICEDONE}
            component={ServiceDone}
            options={{ title: 'done' }}
        /> */}
        </ServiceTopTab.Navigator>
    );
}

export { ServiceTopNavigator };

const InvoiceHistoryTopBarNavigator = () => {
    const InvoiceHistoryTopBar = require('./containers/InvoiceHistoryTopBar').default;
    return (
        <InvoiceHistoryTopTab.Navigator
            swipeEnabled={false}
            tabBar={props => <InvoiceHistoryTopBar {...props} />}>
            <InvoiceHistoryTopTab.Screen
                name={ROUTE_KEYS.INVOICEHISTORYCOLLECTIONLIST}
                getComponent={() => require('./containers/InvoiceHistoryCollectionList').default}
                options={{ title: 'collection' }}
            />
            <InvoiceHistoryTopTab.Screen
                name={ROUTE_KEYS.INVOICEHISTORYSUBSCRIPTIONLIST}
                getComponent={() => require('./containers/InvoiceHistorySubscriptionList').default}
                options={{ title: 'subscription' }}
            />
        </InvoiceHistoryTopTab.Navigator>
    );
}

export { InvoiceHistoryTopBarNavigator };

const PaymentHistoryTopBarNavigator = () => {
    const PaymentHistoryTopBar = require('./containers/PaymentHistoryTopBar').default;
    return (
        <PaymentHistoryTopTab.Navigator
            swipeEnabled={false}
            tabBar={props => <PaymentHistoryTopBar {...props} />}>
            <PaymentHistoryTopTab.Screen
                name={ROUTE_KEYS.PAYMENTHISTORY}
                getComponent={() => require('./containers/PaymentHistoryList').default}
                options={{ title: 'collection' }}
            />
            <PaymentHistoryTopTab.Screen
                name={ROUTE_KEYS.PAYMENTHISTORYSUBSCRIPTION}
                getComponent={() => require('./containers/PaymentHistorySubscriptionList').default}
                options={{ title: 'subscription' }}
            />
        </PaymentHistoryTopTab.Navigator>
    );
}
export { PaymentHistoryTopBarNavigator };
