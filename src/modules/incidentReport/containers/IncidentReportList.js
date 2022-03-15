import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import IncidentReportListView from "../components/IncidentReportListView";
import * as Actions from '../actions';
import * as ComplaintActions from '../../complaints/actions';
import { getIncidentReportList } from '../selectors';
import { getAppTourData } from '../../dashboard/selectors';
import { getAnimationData } from '../../settings/selectors';

class IncidentReportList extends Component {

  render() {
    return <IncidentReportListView {...this.props} />;
  }
}

const mapStateToProps = createStructuredSelector({
  incidentReportList: getIncidentReportList,
  tourData: getAppTourData,
  animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
  navigateToAddNewIncidentReport: () => dispatch(Actions.navigateToAddNewIncidentReport()),
  fetchComplaints: (data) => dispatch(ComplaintActions.fetchComplaints(data)),
  fetchIncidentReportList: () => dispatch(Actions.fetchIncidentReportList()),
  newComplaint: (data) => dispatch(ComplaintActions.newComplaint(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncidentReportList);
