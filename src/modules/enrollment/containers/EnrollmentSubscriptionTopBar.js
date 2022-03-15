import React, { Component } from 'react';
import EnrollmentSubscriptionTopBarView from '../components/EnrollmentSubscriptionTopBarView';
import * as Actions from '../../dashboard/actions';
import { connect } from 'react-redux';

class EntrollmentSubscriptionTopBar extends Component {
    render() {
        return (
            <EnrollmentSubscriptionTopBarView {...this.props} />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    navigateToCustomerDashboardSummary: () => dispatch(Actions.navigateToCustomerDashboardSummary())
});

export default connect(null, mapDispatchToProps)(EntrollmentSubscriptionTopBar);