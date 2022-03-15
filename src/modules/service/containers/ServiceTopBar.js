import React, { Component } from 'react';
import ServiceTopBarView from '../components/ServiceTopBarView';

class ServiceTopBar extends Component {
    render() {
        return (
            <ServiceTopBarView {...this.props} />
        );
    }
}

export default ServiceTopBar;