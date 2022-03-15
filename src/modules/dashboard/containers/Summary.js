import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SummaryView from '../components/SummaryView';
import { getDashboard, getCount, getAppTourData } from '../selectors';
import { getSurveyTemplateFetchStatus, getSurvey } from '../../dfg/selectors';
import { getLanguage } from '../../language/selectors';
import { getUserRoles } from '../../user/selectors';
import * as UserSelectors from '../../user/selectors';
import * as DfgActions from '../../dfg/actions';
import * as EnrollmentActions from '../../enrollment/actions';
import * as DashboardActions from '../actions';

const { getUser } = UserSelectors;

class Summary extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <SummaryView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    dashboard: getDashboard,
    user: getUser,
    language: getLanguage,
    surveyTemplateFetchStatus: getSurveyTemplateFetchStatus,
    survey: getSurvey,
    count: getCount,
    userRoles: getUserRoles,
    tourData: getAppTourData
});

const mapDispatchToProps = (dispatch) => ({
    updateUserLanguage: (data) => dispatch(DashboardActions.updateUserLanguage(data)),
    setSurveyTemplateMessage: (data) => dispatch(DfgActions.setSurveyTemplateMessage(data)),
    startEnrollmentSurvey: () => dispatch(EnrollmentActions.startEnrollmentSurvey()),
    navigateToServiceTopBar: () => dispatch(DashboardActions.navigateToServiceTopBar()),
    navigateToComplaintsTopBar: () => dispatch(DashboardActions.navigateToComplaintsTopBar()),
    loadQuestionUIKey: (data) => dispatch(DashboardActions.loadQuestionUIKey(data)),
    populateDashboardCount: () => dispatch(DashboardActions.populateDashboardCount()),
    drawerStatus: (data) => dispatch(DashboardActions.drawerStatus(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
