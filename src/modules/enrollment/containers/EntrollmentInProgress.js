import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserInfo } from '../../user/selectors';
import EntrollmentInProgressView from '../components/EntrollmentInProgressView';
import { getQueued, getProgress, getProcessed, getFailed } from '../../dfg/selectors';
import { getIncompleteSurveys } from '../selectors';
import * as DfgActions from '../../dfg/actions';
import * as EnrollmentActions from '../actions';
import { getAnimationData } from '../../settings/selectors';

class EntrollmentInProgress extends Component {

    render() {
        return (
            <EntrollmentInProgressView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    incompleteSurveys: getIncompleteSurveys,
    queued: getQueued,
    progress: getProgress,
    processed: getProcessed,
    failed: getFailed,
    userInfo: getUserInfo,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadIncompleteSurveys: () => dispatch(EnrollmentActions.loadIncompleteSurveys()),
    startEnrollmentSurvey: (surveyId) => dispatch(EnrollmentActions.startEnrollmentSurvey({ surveyId })),
    unsetProcessed: (data) => dispatch(DfgActions.unsetProcessed(data)),
    doResume: () => dispatch(DfgActions.doResume()),
    dontResume: () => dispatch(DfgActions.dontResume()),
    removeInprogressData: (surveyId) => dispatch(EnrollmentActions.removeInprogressData(surveyId)),
    clearSurveysToBeDeleted: (surveyIds) => dispatch(EnrollmentActions.clearSurveysToBeDeleted(surveyIds)),
    enrollmentInProgressAnimationStatus: (data) => dispatch(EnrollmentActions.enrollmentInProgressAnimationStatus(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EntrollmentInProgress);