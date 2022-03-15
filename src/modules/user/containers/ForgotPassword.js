import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ForgotPasswordView from '../components/ForgotPasswordView';
import { getUser } from '../selectors';
import * as Actions from '../actions';

class ForgotPassword extends Component {

    render() {
        return (
            <ForgotPasswordView {...this.props} />
        );
    }

}

const mapStateToProps = createStructuredSelector({
    user: getUser
});

const mapDispatchToProps = dispatch => ({
    sendOtp: (values) => dispatch(Actions.sendOtp(values.phoneNumber))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
