import React, { Component } from 'react';
import { connect } from 'react-redux';
import ServiceComplaintItemListView from '../components/ServiceComplaintItemListView';

class ServiceCompalintItemList extends Component {

    render() {
        return (
            <ServiceComplaintItemListView {...this.props} />
        );
    }

}

export default connect(null, null)(ServiceCompalintItemList);
