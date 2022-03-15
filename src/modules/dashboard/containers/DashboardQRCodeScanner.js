import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DashboardQRCodeScannerView from '../components/DashboardQRCodeScannerView';
import { getQRCode } from '../selectors';

class DashboardQRCodeScanner extends Component {

    render() {
        return (
            <DashboardQRCodeScannerView {...this.props} />
        );
    }

}

const mapStateToProps = createStructuredSelector({
    qrcode: getQRCode
});

const mapDispatchToProps = dispatch => ({
    postQRCodeScanning: (initializer, data) => {
        const { params, scanFinishedAction } = initializer;
        scanFinishedAction && dispatch(scanFinishedAction({ params, qrcode: data }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardQRCodeScanner);
