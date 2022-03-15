import React, { Component } from 'react';
import PaymentHistoryTopBarView from '../components/PaymentHistoryTopBarView';
import * as DashboardActions from '../../dashboard/actions';
import { connect } from 'react-redux';

class PaymentHistoryTopBar extends Component {
    render() {
        return (
            <PaymentHistoryTopBarView {...this.props} />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    navigateToCustomerDashboardSummary: () => dispatch(DashboardActions.navigateToCustomerDashboardSummary())
});

export default connect(null, mapDispatchToProps)(PaymentHistoryTopBar);