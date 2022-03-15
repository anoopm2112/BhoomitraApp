import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SideBarView from '../components/SideBarView';
import { getSideBarData, getPlaystoreAppData, getNeedsUpdate } from '../selectors';
import * as UserSelectors from '../../user/selectors';
import * as UserActions from '../../user/actions';
import * as DashboardActions from '../actions';

const { getUser, getUserRoles } = UserSelectors;

class SideBar extends Component {

    componentDidMount() {
        this.props.takeTourThroughApp();
    }
    render() {
        return (
            <SideBarView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    sideBar: getSideBarData,
    user: getUser,
    userRoles: getUserRoles,
    playstoreAppData: getPlaystoreAppData,
    needsUpdate: getNeedsUpdate
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(UserActions.logout()),
    doLogout: () => dispatch(UserActions.doLogout()),
    dontLogout: () => dispatch(UserActions.dontLogout()),
    navigateToMyProfile: () => dispatch(UserActions.navigateToMyProfile()),
    loadSurveyDoneView: (data) => dispatch(DashboardActions.loadSurveyDoneView(data)),
    takeTourThroughApp: () => dispatch(DashboardActions.takeTourThroughApp()),
    drawerStatus: (data) => dispatch(DashboardActions.drawerStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
