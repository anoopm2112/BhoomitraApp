import React, { Component } from 'react';
import { connect } from 'react-redux';
import ServicePaymentView from '../components/ServicePaymentView';
import * as ServiceActions from '../actions';

class ServicePayment extends Component {

    render() {
        return (
            <ServicePaymentView {...this.props} />
        );
    }

}

const mapDispatchToProps = dispatch => ({
    navigateToPaymentCollectionList: (data) => dispatch(ServiceActions.navigateToPaymentCollectionList(data))
});

export default connect(null, mapDispatchToProps)(ServicePayment);
