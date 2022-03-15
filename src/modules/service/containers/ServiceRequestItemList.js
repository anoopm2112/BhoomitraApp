import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getLanguage } from '../../language/selectors';
import { getSpecialServiceRequests } from '../selectors';
import ServiceRequestItemListView from '../components/ServiceRequestItemListView';
import * as Actions from '../actions';
import NetInfo from "@react-native-community/netinfo";
import { getAppTourData } from '../../dashboard/selectors';
import { getAnimationData } from '../../settings/selectors';

class ServiceRequestItemList extends Component {
  constructor(props) {
    super(props);
    this.state = { appState: AppState.currentState }
  }

  componentDidMount() {
    AppState.addEventListener(
      'change',
      this._handleAppStateChange
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener(
      'change',
      this._handleAppStateChange
    );
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      NetInfo.fetch().then(state => {
        if (state.isInternetReachable) {
          this.props.fetchServices();
        }
      });
    }
    this.setState({ appState: nextAppState });
  };
  render() {
    return (
      <ServiceRequestItemListView {...this.props} />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  language: getLanguage,
  specialServiceRequests: getSpecialServiceRequests,
  tourData: getAppTourData,
  animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
  fetchServices: () => dispatch(Actions.fetchServices()),
  newSurviceRequest: (data) => dispatch(Actions.newServiceRequest(data)),
  getSpecialServiceById: (data) => dispatch(Actions.getSpecialServiceById(data)),
  deleteSpecialServiceRequest: (data) => dispatch(Actions.deleteSpecialServiceRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceRequestItemList);
