import React, { useEffect } from 'react';
import { View } from 'react-native';
import { components } from '../../../common';
import SplashScreen from 'react-native-splash-screen';
import BuildConfig from 'react-native-build-config';

const { SafeAreaView } = components;

const SplashView = () => {

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <>
            <SafeAreaView>
                <View style={{ flex: 1, backgroundColor: BuildConfig.SPLASH_BG_COLOR }} />
            </SafeAreaView>
        </>
    );
}

export default SplashView;
