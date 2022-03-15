import React, { Component } from 'react';
import ServiceNewRequestView from '../components/ServiceNewRequestView';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getLanguage } from '../../language/selectors';
import { getSpecialServices, getUpdatedData } from '../selectors';
import * as Actions from '../actions';

class ServiceNewRequest extends Component {
    render() {
        return (
            <ServiceNewRequestView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    language: getLanguage,
    specialService: getSpecialServices,
    updatedData: getUpdatedData
});

const mapDispatchToProps = dispatch => ({
    updateServiceRequest: (data) => dispatch(Actions.updateServiceRequest(data)),
    fetchServices: () => dispatch(Actions.fetchServices()),
    navigateWithResetToSpecialService: () => dispatch(Actions.navigateWithResetToSpecialService()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceNewRequest);

