import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as ServiceActions from '../actions';
import { getServiceHistory } from '../selectors';
import ServiceHistoryView from '../components/ServiceHistoryView';
import { getAnimationData } from '../../settings/selectors';

class ServiceHistory extends Component {
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
            this.props.fetchServiceHistory();
        }
        this.setState({ appState: nextAppState });
    };
    render() {
        return (
            <ServiceHistoryView {...this.props} />
        );
    }
}
const mapStateToProps = createStructuredSelector({
    serviceHistory: getServiceHistory,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    fetchServiceHistory: () => dispatch(ServiceActions.fetchServiceHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceHistory);


