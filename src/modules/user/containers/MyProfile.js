import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MyProfileView from '../components/MyProfileView';
import { getUser } from '../selectors';
import { getLanguage } from '../../language/selectors';
import { getUserRoles } from '../../user/selectors';
import * as UserActions from '../actions';

class MyProfile extends Component {

    render() {
        return (
            <MyProfileView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    user: getUser,
    language: getLanguage,
    userRoles: getUserRoles
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(UserActions.logout()),
    navigateToEditProfile: () => dispatch(UserActions.navigateToEditProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);