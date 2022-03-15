import React, { Component } from 'react';
import InvoiceHistoryTopBarView from '../components/InvoiceHistoryTopBarView';
import * as DashboardActions from '../../dashboard/actions';
import { connect } from 'react-redux';

class InvoiceHistoryTopBar extends Component {
    render() {
        return (
            <InvoiceHistoryTopBarView {...this.props} />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    navigateToCustomerDashboardSummary: () => dispatch(DashboardActions.navigateToCustomerDashboardSummary())
});

export default connect(null, mapDispatchToProps)(InvoiceHistoryTopBar);