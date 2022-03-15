import React, { Component } from 'react';
import { Location } from '../../../common/components';

class DummyLocation extends Component {

    render() {
        return (
            <Location {...this.props} />
        );
    }
}

export default DummyLocation;
