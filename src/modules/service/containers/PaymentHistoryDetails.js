import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PaymentHistoryDetailsView from '../components/PaymentHistoryDetailsView';
import { getIcons, getCustomerPaymentHistory } from '../selectors';
import * as  Actions from '../actions';


class PaymentHistoryDetails extends Component {
    render() {
        return (
            <PaymentHistoryDetailsView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    icons: getIcons,
    customerPaymentHistory: getCustomerPaymentHistory
});

const mapDispatchToProps = dispatch => ({
    paymentHistory: (data) => dispatch(Actions.paymentHistory(data)),
    fetchCustomerPaymentHistory: (data) => dispatch(Actions.fetchCustomerPaymentHistory(data)),
    fetchCustomerPaymentHistoryDetails: (data) => dispatch(Actions.fetchCustomerPaymentHistoryDetails(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentHistoryDetails);
