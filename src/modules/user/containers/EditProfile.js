import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EditProfileView from '../components/EditProfileView';
import { getUser } from '../selectors';
import * as UserActions from '../actions';

class EditProfile extends Component {

    render() {
        return (
            <EditProfileView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    user: getUser
});

const mapDispatchToProps = dispatch => ({
    updateProfile: (values) => dispatch(UserActions.updateProfile(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);