import React from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default React.forwardRef(({ children, style, ...rest }, ref) => {
    return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" ref={ref} showsVerticalScrollIndicator={false} {...rest} contentContainerStyle={[styles.contentContainer, style]}>
            {children}
        </KeyboardAwareScrollView>
    );
});

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center'
    }
});
