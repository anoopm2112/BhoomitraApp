import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ComplaintsInProgressView from '../components/ComplaintsInProgressView';
import { getIncompleteComplaints, getComplaintIcons, getComplaintPhotos } from '../selectors';
import * as ComplaintActions from '../actions';
import * as DashboardActions from '../../dashboard/actions';
import * as ServiceActions from '../../service/actions';
import { getAnimationData } from '../../settings/selectors';

class ComplaintsInProgress extends Component {
    render() {
        return (
            <ComplaintsInProgressView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    incompleteComplaints: getIncompleteComplaints,
    icons: getComplaintIcons,
    photos: getComplaintPhotos,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadIncompleteServices: () => dispatch(ServiceActions.loadIncompleteServices()),
    startHeaderQRCodeScanning: (data) => dispatch(DashboardActions.startHeaderQRCodeScanning({
        allowedQrCode: data.qrCode
    })),
    loadComplaintPhotos: (data) => dispatch(ComplaintActions.loadComplaintPhotos(data)),
    resetComplaintPhotos: () => dispatch(ComplaintActions.resetComplaintPhotos()),
    loadComplaintIcons: () => dispatch(ComplaintActions.loadComplaintIcons()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsInProgress);