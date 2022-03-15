import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import McfSummaryView from '../components/McfSummaryView';
import * as Actions from '../../mcf/actions';
import { getUserRoles } from '../../user/selectors';

class MCfSummary extends Component {
    render() {
        return (
            <McfSummaryView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    userRoles: getUserRoles
});

const mapDispatchToProps = (dispatch) => ({
    mcfStockIn: () => dispatch(Actions.mcfStockIn()),
    mcfStockTransfer: () => dispatch(Actions.mcfStockTransfer()),
    mcfSale: () => dispatch(Actions.mcfSale()),
    mcfSegregation: () => dispatch(Actions.mcfSegregation())
});

export default connect(mapStateToProps, mapDispatchToProps)(MCfSummary);
