import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PaymentCollectionView from '../components/PaymentCollectionView';
import { getServicePayment } from '../selectors';
import * as ServiceActions from '../actions';
import { navigation } from '../../../common/actions';

const { navigateBack } = navigation;

class PaymentCollection extends Component {

    render() {
        return (
            <PaymentCollectionView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    servicePayment: getServicePayment
});

const mapDispatchToProps = dispatch => ({
    updatePaymentCollection: (values) => dispatch(ServiceActions.updatePaymentCollection({
        values
    })),
    navigateBack: () => { dispatch(navigateBack()); }
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentCollection);
