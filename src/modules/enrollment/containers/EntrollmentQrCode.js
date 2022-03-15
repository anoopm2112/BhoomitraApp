import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getUserInfo } from '../../user/selectors';
import { getAppTourData, getDrawerStatus } from '../../dashboard/selectors';
import EntrollmentQrCodeView from '../components/EntrollmentQrCodeView';
import { getQueued, getProgress, getProcessed, getFailed } from '../../dfg/selectors';
import { getPendingQrCodeSurveys } from '../selectors';
import * as DfgActions from '../../dfg/actions';
import * as EnrollmentActions from '../actions';
import { getAnimationData } from '../../settings/selectors';

class EntrollmentQrCode extends Component {

    render() {
        return (
            <EntrollmentQrCodeView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    pendingQrCodeSurveys: getPendingQrCodeSurveys,
    queued: getQueued,
    progress: getProgress,
    processed: getProcessed,
    failed: getFailed,
    userInfo: getUserInfo,
    tourData: getAppTourData,
    drawerStatusData: getDrawerStatus,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadPendingQrCodeSurveys: () => dispatch(EnrollmentActions.loadPendingQrCodeSurveys()),
    startQrCodeEnrollment: (data) => dispatch(EnrollmentActions.startQrCodeEnrollment(data)),
    resetQrEnrollmentTourData: (data) => dispatch(EnrollmentActions.resetQrEnrollmentTourData(data)),
    unsetProcessed: (data) => dispatch(DfgActions.unsetProcessed(data)),
    clearPendingQrCodeSurveys: (surveyIds) => dispatch(EnrollmentActions.clearPendingQrCodeSurveys(surveyIds))
});

export default connect(mapStateToProps, mapDispatchToProps)(EntrollmentQrCode);