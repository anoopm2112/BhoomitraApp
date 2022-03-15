import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import EmailSupportView from "../components/EmailSupportView";
import * as Actions from '../actions';
import { getSupportData } from '../selectors';

class EmailSupport extends Component {

  render() {
    return <EmailSupportView {...this.props} />;
  }
}

const mapStateToProps = createStructuredSelector({
  dropDownData: getSupportData
});

const mapDispatchToProps = dispatch => ({
  fetchDepartment: (data) => dispatch(Actions.fetchDepartment(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EmailSupport);
