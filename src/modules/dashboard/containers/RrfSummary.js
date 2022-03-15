import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RrfSummaryView from '../components/RrfSummaryView';
import * as Actions from '../../rrf/actions';
import { getUserRoles } from '../../user/selectors';

class RrfSummary extends Component {
    render() {
        return (
            <RrfSummaryView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    userRoles: getUserRoles
});

const mapDispatchToProps = (dispatch) => ({
    rrfStockIn: () => dispatch(Actions.rrfStockIn()),
    rrfSale: () => dispatch(Actions.rrfSale()),
    rrfShreddedPlastic: () => dispatch(Actions.rrfShreddedPlastic()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RrfSummary);
