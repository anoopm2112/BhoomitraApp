import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import InvoiceHistorySubscriptionDetailsView from '../components/InvoiceHistorySubscriptionDetailsView';
import { getIcons } from '../selectors';


class InvoiceHistorySubscriptionDetails extends Component {
    render() {
        return (
            <InvoiceHistorySubscriptionDetailsView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    icons: getIcons,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceHistorySubscriptionDetails);
