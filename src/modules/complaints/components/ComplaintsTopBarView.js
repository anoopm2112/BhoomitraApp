import React from 'react';
import { StyleSheet } from 'react-native';
import DashboardHeader from '../../dashboard/components/DashboardHeader';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { Divider, TabBar, Tab, Text } = components

const ComplaintsTopBarView = ({ user, ...props }) => {

    const { navigation } = props;

    const onTabSelect = (index) => {
        const selectedTabRoute = props.state.routeNames[index];
        props.navigation.navigate(selectedTabRoute);
    };

    const createNavigationTabForRoute = (route) => {
        const { options } = props.descriptors[route.key];
        return (
            <Tab key={route.key}
                title={props => (
                    <Text numberOfLines={1} category="h1" {...props}
                        style={[props.style, { color: theme['color-basic-100'] }]}>
                        {I18n.t(options.title)}
                    </Text>)}
            />
        );
    };

    const theme = useTheme();

    const Styles = StyleSheet.create({
        tabBarStyle: {
            backgroundColor: theme['color-basic-600'],
            paddingTop: convertHeight(15)
        }
    });

    return (
        <>
            <DashboardHeader title={I18n.t('complaints_small')} navigation={navigation} />
            <TabBar
                style={Styles.tabBarStyle}
                selectedIndex={props.state.index}
                onSelect={onTabSelect}>
                {props.state.routes.map(createNavigationTabForRoute)}
            </TabBar>
            <Divider />
        </>
    );
};

export default ComplaintsTopBarView;
