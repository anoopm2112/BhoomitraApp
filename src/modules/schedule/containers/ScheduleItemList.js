import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as ScheduleActions from '../actions';
import { getScheduleList } from '../selectors';
import { getLanguage } from '../../language/selectors';
import ScheduleItemListView from '../components/ScheduleItemListView';
import NetInfo from "@react-native-community/netinfo";
import { getAnimationData } from '../../settings/selectors';

class ScheduleItemList extends Component {

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
          this.props.fetchSchedules();
        }
      });

    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <ScheduleItemListView {...this.props} />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  scheduleList: getScheduleList,
  language: getLanguage,
  animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
  toggleSheduleConfirmationModalVisibility: (data) => dispatch(ScheduleActions.toggleSheduleConfirmationModalVisibility(data)),
  fetchSchedules: () => dispatch(ScheduleActions.fetchSchedules()),
  reschedule: (data) => dispatch(ScheduleActions.reschedule(data)),
  deleteSchedule: (data) => dispatch(ScheduleActions.deleteSchedule(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleItemList);
