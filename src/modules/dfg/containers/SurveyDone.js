import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SurveyDoneView from '../components/SurveyDoneView';
import { getCompletedSurveys, getInitializer } from '../selectors';
import * as DfgActions from '../actions';
import { getUserInfo } from '../../user/selectors';
import { getAnimationData } from '../../settings/selectors';

class SurveyDone extends Component {
    render() {
        return (
            <SurveyDoneView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    completedSurveys: getCompletedSurveys,
    initializer: getInitializer,
    userInfo: getUserInfo,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadCompletedSurveys: (data) => dispatch(DfgActions.loadCompletedSurveys(data)),
    // editSyncedSurvey: (surveyId) => dispatch(DfgActions.editSyncedSurvey(surveyId)),
    toogleDownloadingSurveyDataModalVisibility: (data) => dispatch(DfgActions.toogleDownloadingSurveyDataModalVisibility(data)),
    clearSurveyDataFetchMessage: () => dispatch(DfgActions.clearSurveyDataFetchMessage()),
    // startEnrollmentSurvey: () => dispatch(DfgActions.startEnrollmentSurvey()),
    filterModalVisibility: (data) => dispatch(DfgActions.filterModalVisibility(data)),
    navigateToSurveyFilter: (data) => dispatch(DfgActions.navigateToSurveyFilter(data)),
    toogleStartServiceEnrollmentDataModalVisibility: (data) => dispatch(DfgActions.toogleStartServiceEnrollmentDataModalVisibility(data)),
    // startQRCodeScanning: (data) => dispatch(DfgActions.startQRCodeScanning(data)),
    navigateToSurveyDoneDetails: (data) => dispatch(DfgActions.navigateToSurveyDoneDetails(data)),
    clearCompleteSurveyFilter: () => dispatch(DfgActions.clearCompleteSurveyFilter()),
    resetCompletedSurvey: () => dispatch(DfgActions.resetCompletedSurvey())
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDone);