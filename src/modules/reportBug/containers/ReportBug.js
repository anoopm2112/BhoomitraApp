import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import ReportBugView from "../components/ReportBugView";
import * as Actions from '../actions';
import { getNewComplaint } from '../../complaints/selectors';
import { getBaseImage } from '../selectros';
import { actions } from '../../../common';

const { navigation: { navigateBack } } = actions;

class ReportBug extends Component {
  render() {
    return <ReportBugView {...this.props} />;
  }
}

const mapStateToProps = createStructuredSelector({
  newComplaint: getNewComplaint,
  reportImage: getBaseImage
});

const mapDispatchToProps = dispatch => ({
  saveBugReport: (data) => dispatch(Actions.saveBugReport(data)),
  deleteReportImage: () => dispatch(Actions.deleteReportImage()),
  navigateBack: () => dispatch(navigateBack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportBug);
