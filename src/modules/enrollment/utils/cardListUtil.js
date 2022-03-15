import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QUESTION_TYPES } from '../../dfg/constants';
import { I18n, components, utils } from '../../../common';

const { Text } = components;
const { dimensionUtils: { convertWidth, convertHeight }, dateUtils: { convertToLocal } } = utils;

export default renderElements = ({ renderObjs }) => {
    return renderObjs.map((renderObj, index) =>
        <View key={index} style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
            {
                getItemData({ renderObj })
            }
        </View>
    )
}

const getItemData = ({ renderObj }) => {

    switch (renderObj.type) {
        case QUESTION_TYPES.TEXT:
        case QUESTION_TYPES.TEXTAREA:
            return <>
                <View style={styles.keyTextStyle}>
                    <Text category='h5'>{renderObj.label}</Text>
                </View>
                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                <Text category='h5' style={styles.textStyle}>
                    {renderObj.value != null ? renderObj.value : I18n.t('no_data_available')}
                </Text>
            </>
        case QUESTION_TYPES.DROPDOWN:
        case QUESTION_TYPES.SEARCHABLE_DROPDOWN:
        case QUESTION_TYPES.OPTION:
        case QUESTION_TYPES.OPTION_WITH_ICON:
            return <>
                <View style={styles.keyTextStyle}>
                    <Text category='h5'>{renderObj.label}</Text>
                </View>
                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                <Text category='h5' style={styles.textStyle}>
                    {renderObj.value != null ? renderObj.value.name : I18n.t('no_data_available')}
                </Text>
            </>
        case QUESTION_TYPES.LOCATION:
            return <>
                <View style={styles.keyTextStyle}>
                    <Text category='h5'>{I18n.t('location')}</Text>
                </View>
                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                <Text category='h5' style={styles.textStyle}>
                    {renderObj.value == null ?
                        I18n.t('no_data_available') :
                        renderObj.value.formattedAddress ? renderObj.value.formattedAddress :
                            `${renderObj.value.latitude}, ${renderObj.value.longitude}`
                    }
                </Text>
            </>
        case QUESTION_TYPES.DATETIME:
            return <>
                <View style={styles.keyTextStyle}>
                    <Text category='h5'>{renderObj.label}</Text>
                </View>
                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                <Text category='h5' style={styles.textStyle}>
                    {renderObj.value != null ? convertToLocal(renderObj.value) : I18n.t('no_data_available')}
                </Text>
            </>
        default:
            return <>
                <View style={styles.keyTextStyle}>
                    <Text category='h5'>{I18n.t('no_data_available')}</Text>
                </View>
            </>
    }
}

const styles = StyleSheet.create({
    fullColonSpace: {
        paddingHorizontal: convertWidth(5)
    },
    keyTextStyle: {
        width: convertWidth(135)
    },
    textStyle: {
        flexWrap: 'wrap',
        flex: 1,
        textAlign: 'left'
    },
});