import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './RootNavigation';
import { isReadyRef, navigationRef } from './constants';
import { actions } from '../common';

const { routeChanged } = actions;

class AppNavigation extends Component {

    componentDidMount() {
        isReadyRef.current = false;
    }

    render() {
        return (
            <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                    isReadyRef.current = true;
                }}
                onStateChange={() => {
                    this.props.routeChanged(navigationRef.current.getCurrentRoute().name);
                }}
            >
                <RootNavigation />
            </NavigationContainer>
        );
    }

}

const mapDispatchToProps = dispatch => ({
    routeChanged: (name) => dispatch(routeChanged(name))
});

export default connect(null, mapDispatchToProps)(AppNavigation);
