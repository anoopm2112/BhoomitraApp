import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SupervisorSummaryView from '../components/SupervisorSummaryView';
import * as DashboardActions from '../actions';
import * as EnrollmentActions from '../../enrollment/actions';

class SupervisorSummary extends Component {
    render() {
        return (
            <SupervisorSummaryView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
});

const mapDispatchToProps = (dispatch) => ({
    startEnrollmentSurvey: () => dispatch(EnrollmentActions.startEnrollmentSurvey()),
    navigateToServiceTopBar: () => dispatch(DashboardActions.navigateToServiceTopBar()),
    navigateToComplaintsTopBar: () => dispatch(DashboardActions.navigateToComplaintsTopBar()),
    drawerStatus: (data) => dispatch(DashboardActions.drawerStatus(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SupervisorSummary);
