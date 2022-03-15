import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserRoles } from '../../user/selectors';
import CustomerSummaryView from '../components/CustomerSummaryView';
import * as ScheduleActions from '../../schedule/actions';
import * as ServiceActions from '../../service/actions';
import * as EnrollmentActions from '../../enrollment/actions';
import * as FacilityActions from '../../facility/actions';
import * as ComplaintsActions from '../../complaints/actions';
import * as DashboardActions from '../actions';

class CustomerSummary extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <CustomerSummaryView {...this.props} />
        );
    }
}


const mapStateToProps = createStructuredSelector({
    userRoles: getUserRoles
});

const mapDispatchToProps = (dispatch) => ({
    customerSchedule: () => dispatch(ScheduleActions.customerSchedule()),
    customerComplaints: () => dispatch(ComplaintsActions.customerComplaints()),
    specialServices: () => dispatch(ServiceActions.specialServices()),
    subscriptions: () => dispatch(EnrollmentActions.subscriptions()),
    serviceHistory: () => dispatch(ServiceActions.serviceHistory()),
    navigateToNearestMcf: () => dispatch(FacilityActions.navigateToNearestMcf()),
    loadSurveyDoneView: (data) => dispatch(DashboardActions.loadSurveyDoneView(data)),
    incidentReportNavigate: () => dispatch(DashboardActions.incidentReportNavigate()),
    invoiceHistory: () => dispatch(ServiceActions.invoiceHistory()),
    navigateToPaymentHistory: () => dispatch(ServiceActions.navigateToPaymentHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerSummary);
