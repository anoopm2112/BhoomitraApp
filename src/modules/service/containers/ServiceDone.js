import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ServiceDoneView from '../components/ServiceDoneView';
import { getDoneServices } from '../selectors';
import * as ServiceActions from '../actions';

class ServiceDone extends Component {
    render() {
        return (
            <ServiceDoneView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    doneServices: getDoneServices
});

const mapDispatchToProps = dispatch => ({
    loadDoneServices: () => dispatch(ServiceActions.loadDoneServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDone);