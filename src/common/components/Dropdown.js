import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { convertWidth, convertHeight } from '../utils/dimensionUtil';

export default Dropdown = ({ caption, captionIcon, question, updateFormData, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const theme = useTheme();
    const styles = StyleSheet.create({
        dropdown: {
            borderWidth: convertWidth(1),
            borderRadius: convertWidth(5),
            height: convertHeight(40),
            backgroundColor: theme['color-basic-200'],
            borderColor: theme['color-basic-300'],
            justifyContent: 'center',
            paddingLeft: convertWidth(20),
        },
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
            <View onTouchStart={() => { setIsFocused(true) }} style={[styles.dropdown, props.status === 'danger' ?
                styles.dangerStyle : isFocused ? styles.focusStyle : {}]}>
                {props.picker}
            </View>
            <View style={{ flexDirection: 'row' }}>
                {captionIcon}
                {caption}
            </View>
        </>
    );
};