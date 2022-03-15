import React from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { components, I18n } from '../../../common';

const { SafeAreaView, Header, QRCodeScanner, Text } = components;

export const DashboardQRCodeScannerView = (props) => {

    const { qrcode: { initializer } } = props;

    const isFocused = useIsFocused();

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <Header title={''} accessoryRight={() => (<Text />)} />
                {
                    isFocused &&
                    <QRCodeScanner
                        navigation={props.navigation}
                        onScanFinish={(data) => {
                            props.postQRCodeScanning(initializer, data);
                        }}
                        topContent={<Text category='p1'>{I18n.t('scan_qr_code')}</Text>}
                    />
                }
            </SafeAreaView>
        </>
    );
}

export default DashboardQRCodeScannerView;
