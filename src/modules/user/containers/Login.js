import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LoginView from '../components/LoginView';
import { getUser } from '../selectors';
import * as Actions from '../actions';

class Login extends React.Component {

    render() {
        return (
            <LoginView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    user: getUser
});

const mapDispatchToProps = dispatch => ({
    authenticate: (values) => dispatch(Actions.authenticate(values)),
    navigateToForgotPassword: () => dispatch(Actions.navigateToForgotPassword())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
