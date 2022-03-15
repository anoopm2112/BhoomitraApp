import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import OtpVerificationView from '../components/OtpVerificationView';
import { getUser } from '../selectors';
import * as Actions from '../actions';

class OtpVerification extends Component {

    componentDidMount() {
        const phoneNumber = this.props.route && this.props.route.params ? this.props.route.params.data : null;
        if (!phoneNumber) {
            this.props.navigateToForgotPassword();
        }
    }

    render() {
        return (
            <OtpVerificationView {...this.props} />
        );
    }

}

const mapStateToProps = createStructuredSelector({
    user: getUser
});

const mapDispatchToProps = dispatch => ({
    navigateToForgotPassword: () => dispatch(Actions.navigateToForgotPassword()),
    resendOtp: (phoneNumber) => dispatch(Actions.resendOtp(phoneNumber)),
    verifyOtp: (values) => dispatch(Actions.verifyOtp(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(OtpVerification);