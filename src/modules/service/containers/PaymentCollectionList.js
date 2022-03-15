import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PaymentCollectionListView from '../components/PaymentCollectionListView';
import { getIcons, getServicePayment, getQueued, getProgress, getProcessed, getFailed } from '../selectors';
import * as ServiceActions from '../actions';
import { getAnimationData } from '../../settings/selectors';

class PaymentCollectionList extends Component {

    render() {
        return (
            <PaymentCollectionListView {...this.props} />
        );
    }

}

const mapStateToProps = createStructuredSelector({
    servicePayment: getServicePayment,
    queued: getQueued,
    progress: getProgress,
    processed: getProcessed,
    failed: getFailed,
    icons: getIcons,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadServiceIcons: () => dispatch(ServiceActions.loadServiceIcons()),
    generateServicePaymentCollectionData: (data) => dispatch(ServiceActions.generateServicePaymentCollectionData(data)),
    resetServicePaymentCollectionData: () => dispatch(ServiceActions.resetServicePaymentCollectionData()),
    populateAdvanceOutstandingPaymentData: (data) => dispatch(ServiceActions.populateAdvanceOutstandingPaymentData(data)),
    setServicePaymentCollectionItem: (data) => dispatch(ServiceActions.setServicePaymentCollectionItem(data)),
    navigateToPaymentCollection: () => dispatch(ServiceActions.navigateToPaymentCollection()),
    unsetProcessed: (data) => dispatch(ServiceActions.unsetProcessed(data)),
    deleteInvoice: (data) => dispatch(ServiceActions.deleteInvoice(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentCollectionList);
