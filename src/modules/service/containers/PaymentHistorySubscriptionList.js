import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PaymentHistorySubscriptionListView from '../components/PaymentHistorySubscriptionListView';
import * as Actions from '../actions';
import { getCustomerPaymentHistory, getIcons, getCustomerPaymentHistoryList } from '../selectors';
import { getAnimationData } from '../../settings/selectors';

class PaymentHistorySubscriptionList extends Component {
    render() {
        return (
            <PaymentHistorySubscriptionListView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    customerPaymentHistory: getCustomerPaymentHistory,
    icons: getIcons,
    animationData: getAnimationData,
    customerPaymentHistoryList: getCustomerPaymentHistoryList
});

const mapDispatchToProps = dispatch => ({
    fetchCustomerPaymentHistoryDetails: (data) => dispatch(Actions.fetchCustomerPaymentHistoryDetails(data)),
    navigateToPaymentHistoryDetails: (data) => dispatch(Actions.navigateToPaymentHistoryDetails(data)),
    fetchCustomerPaymentHistory: (data) => dispatch(Actions.fetchCustomerPaymentHistory(data)),
    getPaymentHistory: (data) => dispatch(Actions.getPaymentHistory(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentHistorySubscriptionList);
