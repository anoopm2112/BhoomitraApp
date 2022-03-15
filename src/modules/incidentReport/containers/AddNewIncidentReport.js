import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import AddNewIncidentReportView from "../components/AddNewIncidentReportView";
import * as Actions from '../actions';
import * as ComplaintActions from '../../complaints/actions';
import { getNewComplaint } from '../../complaints/selectors';
import { getIncidentReportData } from '../selectors';

class AddNewIncidentReport extends Component {

  render() {
    return <AddNewIncidentReportView {...this.props} />;
  }
}

const mapStateToProps = createStructuredSelector({
  newComplaint: getNewComplaint,
  incidentReportData: getIncidentReportData
});

const mapDispatchToProps = dispatch => ({
  navigateToComplaintImage: () => dispatch(ComplaintActions.navigateToComplaintImage()),
  deleteComplaintImage: () => dispatch(ComplaintActions.deleteComplaintImage()),
  addIncidentReport: (data) => dispatch(Actions.addIncidentReport(data)),
  fetchIncidentReport: (data) => dispatch(Actions.fetchIncidentReport(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewIncidentReport);
