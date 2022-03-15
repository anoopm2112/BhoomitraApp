import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import SendFeedBackView from "../components/SendFeedBackView";
import * as Actions from '../actions';
import { getSupportData } from '../selectors';

class SendFeedBack extends Component {

  render() {
    return <SendFeedBackView {...this.props} />;
  }
}

const mapStateToProps = createStructuredSelector({
  dropDownData: getSupportData
});

const mapDispatchToProps = dispatch => ({
  fetchDepartment: (data) => dispatch(Actions.fetchDepartment(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendFeedBack);