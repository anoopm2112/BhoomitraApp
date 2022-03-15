import React, { Component } from "react";
import { AppState } from "react-native";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { getPermissions } from '../selectors';
import * as Actions from '../actions';
import * as SplashActions from '../../splash/actions';
import PermissionGrantView from "../components/PermissionGrantView";

class PermissionGrant extends Component {

  state = {
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active" && this.props.permissions.recheckPermissions
    ) {
      // Re-initialize here
      this.props.initialize();
      this.props.recheckPermissions(false);
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return <PermissionGrantView {...this.props} />;
  }

}

const mapStateToProps = createStructuredSelector({
  permissions: getPermissions
});

const mapDispatchToProps = dispatch => ({
  grandPermissions: () => dispatch(Actions.grantPermissions()),
  denyPermissions: () => dispatch(Actions.denyPermissions()),
  showGrantPermissionsModal: (data) => dispatch(Actions.showGrantPermissionsModal(data)),
  showAllowBlockedPermissionsModal: (data) => dispatch(Actions.showAllowBlockedPermissionsModal(data)),
  initialize: () => dispatch(SplashActions.initialize()),
  recheckPermissions: (data) => dispatch(Actions.recheckPermissions(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PermissionGrant);
