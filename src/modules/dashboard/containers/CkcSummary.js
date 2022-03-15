import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import CkcSummaryView from '../components/CkcSummaryView';
import * as Actions from '../../ckc/actions';
import { getUserRoles } from '../../user/selectors';

class CkcSummary extends Component {
    render() {
        return (
            <CkcSummaryView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    userRoles: getUserRoles
});

const mapDispatchToProps = (dispatch) => ({
    ckcPickUp: () => dispatch(Actions.ckcPickUp()),
    ckcSale: () => dispatch(Actions.ckcSale()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CkcSummary);
