import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import NotificationView from '../components/NotificationView';
import { navigation } from '../../../common/actions';
import * as DashboardAction from '../actions';
import { getNotification } from '../selectors';
import { getAnimationData } from '../../settings/selectors';

const { navigateBack } = navigation;

class Notification extends Component {

  render() {
    return (
      <NotificationView {...this.props} />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  notificationData: getNotification,
  animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
  navigateBack: () => { dispatch(navigateBack()) },
  loadNotification: () => dispatch(DashboardAction.loadNotification()),
  readNotificationMsg: (data) => dispatch(DashboardAction.readNotificationMsg(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
