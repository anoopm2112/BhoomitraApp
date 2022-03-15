import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RCTTextarea from 'react-native-textarea';
import { useTheme } from '@ui-kitten/components';
import { convertWidth } from '../utils/dimensionUtil';

export default Textarea = ({ caption, captionIcon, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const theme = useTheme();
    const styles = StyleSheet.create({
        dangerStyle: {
            borderWidth: convertWidth(1),
            borderColor: theme['color-danger-500']
        },
        focusStyle: {
            borderWidth: convertWidth(1),
            borderColor: theme['color-primary-500']
        }
    });

    return (
        <>
            <RCTTextarea
                {...props}
                containerStyle={[props.containerStyle, props.status === 'danger' ?
                    styles.dangerStyle : isFocused ? styles.focusStyle : {}]}
                onBlur={(e) => {
                    props.onBlur && props.onBlur(e);
                    setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
            />
            <View style={{ flexDirection: 'row' }}>
                {captionIcon}
                {caption}
            </View>
        </>
    );
};
