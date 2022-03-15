import React, { Component } from 'react';
import ComplaintsTopBarView from '../components/ComplaintsTopBarView';

class ComplaintsTopBar extends Component {
    render() {
        return (
            <ComplaintsTopBarView {...this.props} />
        );
    }
}

export default ComplaintsTopBar;