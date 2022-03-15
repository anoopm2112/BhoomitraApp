import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import InvoiceHistoryCollectionView from '../components/InvoiceHistoryCollectionView';
import * as Actions from '../actions';
import { getCustomerInvoiceHistory, getIcons } from '../selectors';
import { getUserInfo } from '../../user/selectors';
import { getAnimationData } from '../../settings/selectors';

class InvoiceHistoryCollectionList extends Component {
    render() {
        return (
            <InvoiceHistoryCollectionView {...this.props} />
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
    navigateToInvoiceCollectionDetails: (data) => dispatch(Actions.navigateToInvoiceCollectionDetails(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceHistoryCollectionList);
