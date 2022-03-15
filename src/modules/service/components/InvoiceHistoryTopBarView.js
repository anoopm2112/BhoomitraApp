import React, { useEffect } from 'react';
import { StyleSheet, BackHandler } from 'react-native';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';

const { dimensionUtils: { convertHeight } } = utils;
const { Divider, TabBar, Tab, Text, Header } = components;

const InvoiceTopBarView = ({ user, ...props }) => {

    const { navigation, navigateToCustomerDashboardSummary } = props;

    useEffect(() => {
        function handleBackButton() {
            navigateToCustomerDashboardSummary();
            return true;
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            backHandler.remove();
        }
    }, []);

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
            <Header title={I18n.t('invoice_history')} navigation={navigation} onBackPress={navigateToCustomerDashboardSummary} />
            <TabBar style={Styles.tabBarStyle} selectedIndex={props.state.index} onSelect={onTabSelect}>
                {props.state.routes.map(createNavigationTabForRoute)}
            </TabBar>
            <Divider />
        </>
    );
};

export default InvoiceTopBarView;
