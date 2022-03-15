import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ChangePasswordView from '../components/ChangePasswordView';
import { getUser } from '../selectors';
import * as UserActions from '../actions';

class EditProfile extends Component {

    render() {
        return (
            <ChangePasswordView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    user: getUser
});

const mapDispatchToProps = dispatch => ({
    updatePassword: (values) => dispatch(UserActions.updatePassword(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);