import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ServiceBarcodeView from '../components/ServiceBarcodeView';
import { getQueued, getProgress, getProcessed, getFailed } from '../../dfg/selectors';
import { getServiceBarcode } from '../selectors';
import { getUserRoles, getUserInfo } from '../../user/selectors';
import * as DfgActions from '../../dfg/actions';
import * as ServiceActions from '../actions';
import * as EnrollmentActions from '../../enrollment/actions';
import * as ComplaintsActions from '../../complaints/actions';
import { getAppTourData } from '../../dashboard/selectors';
import { getAnimationData } from '../../settings/selectors';

class ServiceBarCode extends Component {
    render() {
        return (
            <ServiceBarcodeView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    serviceBarcode: getServiceBarcode,
    queued: getQueued,
    progress: getProgress,
    processed: getProcessed,
    failed: getFailed,
    userRoles: getUserRoles,
    tourData: getAppTourData,
    userInfo: getUserInfo,
    animationData:getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadCustomerProfile: (data) => dispatch(ServiceActions.loadCustomerProfile(data)),
    resetCustomerProfile: () => dispatch(ServiceActions.resetCustomerProfile()),
    navigateToServiceItemList: (data) => dispatch(ServiceActions.navigateToServiceItemList(data)),
    navigateToServiceItemComplaintList: (data) => dispatch(ServiceActions.navigateToServiceItemComplaintList(data)),
    navigateToServicePayment: (data) => dispatch(ServiceActions.navigateToServicePayment(data)),
    startEnrollmentSurvey: (data) => dispatch(EnrollmentActions.startEnrollmentSurvey(data)),
    startQrCodeEnrollment: (data) => dispatch(EnrollmentActions.startQrCodeEnrollment(data)),
    startMobileServiceEnrollment: (data) => dispatch(ServiceActions.startMobileServiceEnrollment(data)),
    unsetProcessed: (data) => dispatch(DfgActions.unsetProcessed(data)),
    doResume: () => dispatch(DfgActions.doResume()),
    dontResume: () => dispatch(DfgActions.dontResume()),
    navigateToComplaintItemList: (data) => dispatch(ComplaintsActions.navigateToComplaintItemList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceBarCode);
