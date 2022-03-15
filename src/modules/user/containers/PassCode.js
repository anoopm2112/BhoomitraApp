import React, { Component } from 'react';
import { connect } from 'react-redux';
import PassCodeView from '../components/PassCodeView';
import * as Actions from '../actions';

class PassCode extends Component {

    render() {
        return (
            <PassCodeView {...this.props} />
        );
    }
}


const mapDispatchToProps = dispatch => ({
    prepareEncryptionKey: (data) => dispatch(Actions.prepareEncryptionKey(data)),
    forgotPassCode: () => dispatch(Actions.navigateToPassCode({ status: 'choose', resetPassCode: true }))
});

export default connect(null, mapDispatchToProps)(PassCode);
