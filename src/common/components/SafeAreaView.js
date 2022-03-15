import React from 'react';
// import { StatusBar } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { withStyles } from '@ui-kitten/components';

const component = (props) => {
    const { children, eva, style, ...rest } = props;
    return (
        <SafeAreaView {...rest} style={[eva.style.rules, style]}>
            {/* <StatusBar hidden={true} /> */}
            {children}
        </SafeAreaView>
    );
};

const ThemedSafeAreaView = withStyles(component, (theme) => ({
    rules: {
        backgroundColor: theme['color-basic-100'],
        flex: 1
    }
}));

export default ThemedSafeAreaView;
