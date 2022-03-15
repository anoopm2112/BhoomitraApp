import React, { Component } from 'react';
import { AppState } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import * as EnrollmentActions from '../actions';
import { getSubscription } from '../selectors';
import EnrollmentSubscribedView from '../components/EnrollmentSubscribedView';
import { getAnimationData } from '../../settings/selectors';

class EnrollmentSubscribed extends Component {
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
            this.props.fetchSubscribed();
        }
        this.setState({ appState: nextAppState });
    };
    render() {
        return (
            <EnrollmentSubscribedView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    subscription: getSubscription,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    fetchSubscribed: () => dispatch(EnrollmentActions.fetchSubscribed()),
    optInOptOrOut: (data) => dispatch(EnrollmentActions.optInOptOrOut(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentSubscribed)