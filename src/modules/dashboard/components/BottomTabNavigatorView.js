import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { components } from '../../../common';

const { BottomNavigation, BottomNavigationTab, Divider, Text } = components;

const BottomTabNavigatorView = ({ ...props }) => {

    const theme = useTheme();

    const onTabSelect = (index) => {
        const selectedTabRoute = props.state.routeNames[index];
        props.navigation.navigate(selectedTabRoute);
    };

    const createNavigationTabForRoute = (route, index) => {
        const { options } = props.descriptors[route.key];
        return (
            <BottomNavigationTab
                disabled={props.surveyTemplateFetchStatus.updateInProgress}
                key={route.key}
                icon={index === options.index ? options.tabBarIcon1 : options.tabBarIcon2}
                title={props => (
                    <Text category="h1" {...props}
                        style={[props.style, {
                            color: index === options.index ?
                                theme['color-basic-600'] :
                                theme['text-disabled-color']
                        }]}>
                        {options.title}
                    </Text>)}
            />
        );
    };

    return (
        <SafeAreaView>
            <Divider />
            <BottomNavigation appearance='noIndicator' selectedIndex={props.state.index} onSelect={onTabSelect}>
                {props.state.routes.map((route) => createNavigationTabForRoute(route, props.state.index))}
            </BottomNavigation>
        </SafeAreaView>
    );
}

export default BottomTabNavigatorView;