import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import InvoiceHistoryCollectionDetailsView from '../components/InvoiceHistoryCollectionDetailsView';
import { getIcons } from '../selectors';


class InvoiceHistoryCollectionDetails extends Component {
    render() {
        return (
            <InvoiceHistoryCollectionDetailsView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    icons: getIcons,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceHistoryCollectionDetails);
