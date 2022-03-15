import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { useTheme } from '@ui-kitten/components';
import { createStructuredSelector } from 'reselect';
import { DrawerActions } from '@react-navigation/native';
import { components, utils } from '../../../common';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const { Icon, Header, TopNavigationAction } = components;

const DashboardHeader = ({ title, alignment, toggleDrawer }) => {
    const theme = useTheme();

    const openDrawer = (toggleDrawer) => (
        <TopNavigationAction onPress={toggleDrawer} icon={(props) => <Icon {...props} style={{ height: convertHeight(35), color: theme['color-basic-100'] }} name="menu" pack="material-community" />} />
    );

    return (
        <Header
            title={title}
            accessoryLeft={() => openDrawer(toggleDrawer)}
            alignment={alignment}
        />
    );
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleDrawer: () => ownProps.navigation.dispatch(DrawerActions.toggleDrawer())
});

const styles = StyleSheet.create({
    menuIcon: {
        width: convertWidth(24),
        height: convertHeight(20),
        resizeMode: 'contain'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHeader);
