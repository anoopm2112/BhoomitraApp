import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import PhoneSupportView from "../components/PhoneSupportView";
import * as Actions from '../actions';
import { getSupportData } from '../selectors';

class PhoneSupport extends Component {

  render() {
    return <PhoneSupportView {...this.props} />;
  }
}

const mapStateToProps = createStructuredSelector({
  dropDownData: getSupportData
});

const mapDispatchToProps = dispatch => ({
  fetchDepartment: (data) => dispatch(Actions.fetchDepartment(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneSupport);