import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MODULE_ROUTE_KEYS } from '../common';
import * as Splash from '../modules/splash';
import * as Language from '../modules/language';
import * as User from '../modules/user';
import * as Dashboard from '../modules/dashboard';
import * as Settings from '../modules/settings';
import * as Dummy from '../modules/dummy';
import * as Permissions from '../modules/permissions';
import * as Dfg from '../modules/dfg';
import * as Enrollment from '../modules/enrollment';
import * as Service from '../modules/service';
import * as AboutUs from '../modules/aboutUs';
import * as Shedule from '../modules/schedule';
import * as Facility from '../modules/facility';
import * as Complaints from '../modules/complaints';
import * as ReportBug from '../modules/reportBug';
import * as HelpSupport from '../modules/helpSupport';
import * as IncidentReport from '../modules/incidentReport';
import * as Mcf from '../modules/mcf';
import * as Rrf from '../modules/rrf';
import * as Ckc from '../modules/ckc';

const { Navigator, Screen } = createStackNavigator();

export default function RootNavigation() {
    return (
        <Navigator initialRouteName={MODULE_ROUTE_KEYS.SPLASH} headerMode="none">
            <Screen name={MODULE_ROUTE_KEYS.SPLASH} component={Splash.routes} />
            <Screen name={MODULE_ROUTE_KEYS.LANGUAGE} component={Language.routes} />
            <Screen name={MODULE_ROUTE_KEYS.PERMISSIONS} component={Permissions.routes} />
            <Screen name={MODULE_ROUTE_KEYS.USER} component={User.routes} />
            <Screen name={MODULE_ROUTE_KEYS.DASHBOARD} component={Dashboard.routes} />
            <Screen name={MODULE_ROUTE_KEYS.SETTINGS} component={Settings.routes} />
            <Screen name={MODULE_ROUTE_KEYS.DUMMY} component={Dummy.routes} />
            <Screen name={MODULE_ROUTE_KEYS.DFG} component={Dfg.routes} />
            <Screen name={MODULE_ROUTE_KEYS.ENROLLMENT} component={Enrollment.routes} />
            <Screen name={MODULE_ROUTE_KEYS.SERVICE} component={Service.routes} />
            <Screen name={MODULE_ROUTE_KEYS.ABOUTUS} component={AboutUs.routes} />
            <Screen name={MODULE_ROUTE_KEYS.SCHEDULE} component={Shedule.routes} />
            <Screen name={MODULE_ROUTE_KEYS.FACILITY} component={Facility.routes} />
            <Screen name={MODULE_ROUTE_KEYS.COMPLAINT} component={Complaints.routes} />
            <Screen name={MODULE_ROUTE_KEYS.REPORTBUG} component={ReportBug.routes} />
            <Screen name={MODULE_ROUTE_KEYS.HELPSUPPORT} component={HelpSupport.routes} />
            <Screen name={MODULE_ROUTE_KEYS.INCIDENTREPORT} component={IncidentReport.routes} />
            <Screen name={MODULE_ROUTE_KEYS.MCF} component={Mcf.routes} />
            <Screen name={MODULE_ROUTE_KEYS.RRF} component={Rrf.routes} />
            <Screen name={MODULE_ROUTE_KEYS.CKC} component={Ckc.routes} />
        </Navigator>
    );
}
