import React, { Component } from 'react';
import { Camera } from '../../../common/components';

class Dummy extends Component {

    render() {
        return (
            <Camera {...this.props} onImageTaken={(base64) => base64} />
        );
    }
}

export default Dummy;
