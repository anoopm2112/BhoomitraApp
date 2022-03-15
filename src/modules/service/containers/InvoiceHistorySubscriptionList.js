import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import InvoiceHistorySubscriptionListView from '../components/InvoiceHistorySubscriptionListView';
import * as Actions from '../actions';
import { getCustomerInvoiceHistory, getIcons } from '../selectors';
import { getUserInfo } from '../../user/selectors';
import { getAnimationData } from '../../settings/selectors';

class InvoiceHistorySubscriptionList extends Component {
    render() {
        return (
            <InvoiceHistorySubscriptionListView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    customerInvoiceHistory: getCustomerInvoiceHistory,
    userInfo: getUserInfo,
    icons: getIcons,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    fetchCustomerInvoiceHistory: () => dispatch(Actions.fetchCustomerInvoiceHistory()),
    navigateToInvoiceSubscriptionDetails: (data) => dispatch(Actions.navigateToInvoiceSubscriptionDetails(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceHistorySubscriptionList);
