import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { ListItem } from '@ui-kitten/components';
import { convertHeight, convertWidth } from '../utils/dimensionUtil';
import { useTheme } from '@ui-kitten/components';

export default ({ cardView = true, style: propStyle = {}, ...rest }) => {
    let customStyle = {};
    if (cardView) {
        customStyle = Platform.OS === 'android' ?
            { ...styles.cardView, ...styles.androidShadow } :
            { ...styles.cardView, ...styles.iOSShadow };
    }

    const theme = useTheme();

    const styles = StyleSheet.create({
        listItem: {
            borderWidth: convertWidth(1),
            marginVertical: convertHeight(3),
            marginHorizontal: convertWidth(6),
            borderRadius: convertWidth(10),
            borderColor: theme['color-basic-300']
        },
        cardView: {
            borderWidth: 0,
            marginVertical: convertHeight(4)
        },
        iOSShadow: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.5
        },
        androidShadow: {
            elevation: 8
        }
    });

    return (
        <ListItem style={{ ...styles.listItem, ...customStyle, ...propStyle }} {...rest}></ListItem>
    );
};
