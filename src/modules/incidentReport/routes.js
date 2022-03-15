import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function IncidentReportNavigation() {
    return (
        <Navigator initialRouteName={ROUTE_KEYS.INCIDENTREPORTLIST} headerMode="none">
            <Screen name={ROUTE_KEYS.INCIDENTREPORTLIST} getComponent={() => require('./containers/IncidentReportList').default} />
            <Screen name={ROUTE_KEYS.ADDNEWINCIDENTREPORT} getComponent={() => require('./containers/AddNewIncidentReport').default} />
        </Navigator>
    );
}
