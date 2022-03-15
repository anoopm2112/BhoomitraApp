import React, { Component } from 'react';
import { AppState } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import * as EnrollmentActions from '../actions';
import { getSubscription } from '../selectors';
import EnrollmentSubscriptionView from '../components/EnrollmentSubscriptionView';
import { getAnimationData } from '../../settings/selectors';

class EnrollmentSubscription extends Component {
    constructor(props) {
        super(props);
        this.state = { appState: AppState.currentState };
    }

    componentDidMount() {
        AppState.addEventListener(
            'change',
            this._handleAppStateChange
        );
    }

    componentWillUnmount() {
        AppState.removeEventListener(
            'change',
            this._handleAppStateChange
        );
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            this.props.fetchSubscription();
        }
        this.setState({ appState: nextAppState });
    };
    render() {
        return (
            <EnrollmentSubscriptionView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    subscription: getSubscription,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    fetchSubscription: () => dispatch(EnrollmentActions.fetchSubscription()),
    optInOptOrOut: (data) => dispatch(EnrollmentActions.optInOptOrOut(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentSubscription)