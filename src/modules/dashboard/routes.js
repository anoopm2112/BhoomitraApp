import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@ui-kitten/components';
import { getUserRoles } from '../user/selectors';
import { useSelector } from "react-redux";
import { components, I18n, utils } from '../../common';
import { ROUTE_KEYS } from './constants';
import { ServiceTopNavigator } from '../service/routes';
import { ComplaintTopNavigator } from '../complaints/routes';
import { EntrollmentTopNavigator } from '../enrollment/routes';
import { RESOURCE_MAPPING, ACTION_MAPPING } from '../../common/constants';
const { Icon, FontelloIcon } = components;
const { dimensionUtils: { convertHeight, convertWidth }, permissionUtils: { hasAccessPermission } } = utils;

const { Navigator, Screen } = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();

export default function DashboardNavigation() {
    const [initRender, setInitRender] = React.useState(true);

    React.useEffect(() => {
        setInitRender(false); // Fix to blink issue on load page
    }, [initRender]);

    const SideBar = require('./containers/SideBar').default;

    return (
        <Navigator
            drawerContent={props => <SideBar {...props} />}
            drawerStyle={{ width: initRender ? null : '85%' }}
            headerMode="none"
            screenOptions={{ gestureEnabled: true }}>
            <Screen name={ROUTE_KEYS.DASHBOARDBOTTOMBAR} component={DashboardBottomNavigator} />
            <Screen name={ROUTE_KEYS.CUSTOMERSUMMARY} getComponent={() => require('./containers/CustomerSummary').default} />
            <Screen name={ROUTE_KEYS.NOTIFICATION} getComponent={() => require('./containers/Notification').default} />
            <Screen name={ROUTE_KEYS.QRCODESCANNER} getComponent={() => require('./containers/DashboardQRCodeScanner').default} />
            <Screen name={ROUTE_KEYS.MCFSUMMARY} getComponent={() => require('./containers/McfSummary').default} />
            <Screen name={ROUTE_KEYS.RRFSUMMARY} getComponent={() => require('./containers/RrfSummary').default} />
            <Screen name={ROUTE_KEYS.CKCSUMMARY} getComponent={() => require('./containers/CkcSummary').default} />
            <Screen name={ROUTE_KEYS.SUPERVISORSUMMARY} getComponent={() => require('./containers/SupervisorSummary').default} />
        </Navigator>
    );
}

const DashboardBottomNavigator = () => {
    const userRoles = useSelector(getUserRoles);
    const theme = useTheme();

    const BottomTabNavigator = require('./containers/BottomTabNavigator').default;

    const HomeIconSelect = () => <FontelloIcon name="home-select" size={convertHeight(20)} color={theme['color-basic-600']} />
    const HomeIconUnselect = () => <FontelloIcon name="home-select" size={convertHeight(20)} color={theme['text-disabled-color']} />

    const EnrollmentIconSelect = () => <Icon style={{ height: convertHeight(22), color: theme['color-basic-600'] }} name="account-details-outline" pack="material-community" />
    const EnrollmentIconUnSelect = () => <Icon style={{ height: convertHeight(22), color: theme['text-disabled-color'] }} name="account-details-outline" pack="material-community" />

    const ServiceIconSelect = () => <Icon name="tools" pack="material-community" style={{ height: convertHeight(22), color: theme['color-basic-600'] }} />
    const ServiceIconUnSelect = () => <Icon name="tools" pack="material-community" style={{ height: convertHeight(22), color: theme['text-disabled-color'] }} />

    const ComplaintIconSelect = () => <Icon name="inbox-multiple" pack="material-community" style={{ height: convertHeight(22), color: theme['color-basic-600'] }} />
    const ComplaintIconUnSelect = () => <Icon name="inbox-multiple" pack="material-community" style={{ height: convertHeight(22), color: theme['text-disabled-color'] }} />

    return (
        <BottomTab.Navigator tabBar={props => <BottomTabNavigator {...props} />}>
            <BottomTab.Screen
                name={ROUTE_KEYS.SUMMARY}
                getComponent={() => require('./containers/Summary').default}
                options={{ index: 0, title: I18n.t('home'), tabBarIcon1: HomeIconSelect, tabBarIcon2: HomeIconUnselect }}
            />
            {
                hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.START_SURVEY_CARD) ?
                    <BottomTab.Screen
                        name={ROUTE_KEYS.ENTROLLMENTTOPBAR}
                        component={EntrollmentTopNavigator}
                        options={{ index: 1, title: I18n.t('enrollment'), tabBarIcon1: EnrollmentIconSelect, tabBarIcon2: EnrollmentIconUnSelect }}
                    />
                    : null
            }
            {
                hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.SERVICES_CARD) ?
                    <BottomTab.Screen
                        name={ROUTE_KEYS.SERVICETOPBAR}
                        component={ServiceTopNavigator}
                        options={{ index: 2, title: I18n.t('services'), tabBarIcon1: ServiceIconSelect, tabBarIcon2: ServiceIconUnSelect }}
                    /> : null
            }
            {
                hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.COMPLAINTS_CARD) ?
                    <BottomTab.Screen
                        name={ROUTE_KEYS.COMPLAINTSTOPBAR}
                        component={ComplaintTopNavigator}
                        options={{ index: 3, title: I18n.t('complaints_small'), tabBarIcon1: ComplaintIconSelect, tabBarIcon2: ComplaintIconUnSelect }}
                    /> : null
            }
        </BottomTab.Navigator>
    );
}
