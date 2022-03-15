import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ServiceInProgressView from '../components/ServiceInProgressView';
import { getIcons, getIncompleteServices, getPhotos } from '../selectors';
import { getAppTourData, getDrawerStatus } from '../../dashboard/selectors';
import * as ServiceActions from '../actions';
import * as DashboardActions from '../../dashboard/actions';
import { getAnimationData } from '../../settings/selectors';

class ServiceInProgress extends Component {
    render() {
        return (
            <ServiceInProgressView {...this.props} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    photos: getPhotos,
    icons: getIcons,
    incompleteServices: getIncompleteServices,
    tourData: getAppTourData,
    drawerStatus: getDrawerStatus,
    animationData: getAnimationData
});

const mapDispatchToProps = dispatch => ({
    loadIncompleteServices: () => dispatch(ServiceActions.loadIncompleteServices()),
    loadPhotos: (data) => dispatch(ServiceActions.loadPhotos(data)),
    resetPhotos: () => dispatch(ServiceActions.resetPhotos()),
    loadServiceIcons: () => dispatch(ServiceActions.loadServiceIcons()),
    scanQrCodePendingServiceTourData: () => dispatch(ServiceActions.scanQrCodePendingServiceTourData()),
    startHeaderQRCodeScanning: (data) => dispatch(DashboardActions.startHeaderQRCodeScanning({
        allowedQrCode: data.qrCode
    }))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceInProgress);
