import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ComplaintsListView from '../components/ComplaintsListView';
import * as Actions from '../actions';
import NetInfo from '@react-native-community/netinfo';
import { getAllComplaints } from '../selectors';
import { getAppTourData } from '../../dashboard/selectors';
import { getAnimationData } from '../../settings/selectors';

class ComplaintsList extends Component {
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
            NetInfo.fetch().then(state => {
                if (state.isInternetReachable) {
                    this.props.getAllComplaints();
                    this.props.fetchComplaints();
                }
            });
        }
        this.setState({ appState: nextAppState });
    };
    render() {
        return (
            <ComplaintsListView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    allComplaints: getAllComplaints,
    tourData: getAppTourData,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    newComplaint: (data) => dispatch(Actions.newComplaint(data)),
    fetchComplaints: (data) => dispatch(Actions.fetchComplaints(data)),
    getAllComplaints: () => dispatch(Actions.getAllComplaints()),
    deleteComplaint: (data) => dispatch(Actions.deleteComplaint(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsList);
