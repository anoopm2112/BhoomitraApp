import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ResetPasswordView from '../components/ResetPasswordView';
import { getUser } from '../selectors';
import * as Actions from '../actions';

class ForgotPassword extends Component {

    componentDidMount() {
        const requestId = this.props.route && this.props.route.params ? this.props.route.params.data : null;
        if (!requestId) {
            this.props.navigateToForgotPassword();
        }
    }

    render() {
        return (
            <ResetPasswordView {...this.props} />
        );
    }

}

const mapStateToProps = createStructuredSelector({
    user: getUser
});

const mapDispatchToProps = dispatch => ({
    navigateToForgotPassword: () => dispatch(Actions.navigateToForgotPassword()),
    resetPassword: (values) => dispatch(Actions.resetPassword(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
