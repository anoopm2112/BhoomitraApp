import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EntrollmentTopBarView from '../components/EntrollmentTopBarView';
import { getAppTourData } from '../../splash/selectors';
import * as EnrollmentActions from '../actions';

class EntrollmentTopBar extends Component {
    render() {
        return (
            <EntrollmentTopBarView {...this.props} />
        );
    }
}
const mapStateToProps = createStructuredSelector({
    tourData: getAppTourData
});


const mapDispatchToProps = (dispatch) => ({
    resetQrEnrollmentTabTourData: (data) => dispatch(EnrollmentActions.resetQrEnrollmentTabTourData(data))
});


export default connect(mapStateToProps, mapDispatchToProps)(EntrollmentTopBar);
