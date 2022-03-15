import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_KEYS } from './constants';

const { Navigator, Screen } = createStackNavigator();

export default function DfgNavigation() {
    return (
        <Navigator headerMode="none">
            <Screen name={ROUTE_KEYS.DYNAMICFORM} getComponent={() => require('./containers/DynamicForm').default} />
            <Screen name={ROUTE_KEYS.SURVEYDONE} getComponent={() => require('./containers/SurveyDone').default} />
            <Screen name={ROUTE_KEYS.SURVEYDONEDETAILS} getComponent={() => require('./containers/SurveyDoneDetails').default} />
            <Screen name={ROUTE_KEYS.SURVEYFILTER} getComponent={() => require('./containers/SurveyFilter').default} />
        </Navigator>
    );
}
