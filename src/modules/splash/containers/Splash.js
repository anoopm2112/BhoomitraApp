import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, BackHandler } from 'react-native';
import SplashView from '../components/SplashView';
import { actions as CommonActions } from '../../../common';
import { ROUTE_KEYS as SPLASH_ROUTE_KEYS } from '../constants';
import * as Actions from '../actions';
import JailMonkey from 'jail-monkey';

class Splash extends Component {

    componentDidMount() {
        this.props.createSidebarInitialRoute(SPLASH_ROUTE_KEYS.SPLASH);
        if (!__DEV__ && JailMonkey.isJailBroken()) {
            Alert.alert(
                'App is not supported on this device.',
                'Error code 101.',
                [
                    { text: 'Exit', onPress: () => BackHandler.exitApp() }
                ]
            );
        } else {
            // Initialize app
            this.props.initialize();
        }
    }

    render() {
        return (
            <SplashView {...this.props} />
        );
    }
}


const mapDispatchToProps = dispatch => ({
    createSidebarInitialRoute: (initialRoute) => dispatch(CommonActions.routeChanged(initialRoute)),
    initialize: () => dispatch(Actions.initialize()),
});

export default connect(null, mapDispatchToProps)(Splash);
