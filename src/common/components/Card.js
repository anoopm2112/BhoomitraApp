import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { dimensionUtils } from "../../common/utils";

const { convertWidth, convertHeight } = dimensionUtils;

export default React.forwardRef((props, ref) => {
    const { shadow, style = {}, children, readOnly } = props;
    const styles = StyleSheet.create({
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingHorizontal: convertWidth(13),
            paddingTop: convertHeight(13)
        },
        iOSShadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22
        },
        androidShadow: {
            elevation: readOnly ? 0 : 3,
            borderWidth: readOnly ? 2 : 0,
            borderColor: readOnly ? '#eee' : '#fff'
        }
    });
    let combinedStyle = {
        ...styles.viewStyle,
        ...style
    };
    if (shadow) {
        combinedStyle = Platform.OS === 'android' ?
            {
                ...styles.androidShadow,
                ...combinedStyle
            } :
            {
                ...styles.iOSShadow,
                ...combinedStyle
            };
    }
    return (
        <View pointerEvents={readOnly ? 'none' : 'auto'} ref={ref} style={combinedStyle}>{children}</View>
    );
});
