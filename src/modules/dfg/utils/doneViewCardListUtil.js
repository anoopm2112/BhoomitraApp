import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { QUESTION_TYPES, BUILDING_TYPES } from '../constants';
import { I18n, components, utils } from '../../../common';

const { Text, Icon } = components;
const { dimensionUtils: { convertWidth, convertHeight }, locationUtils: { hasLocationAccess }, dateUtils: { convertToLocal } } = utils;

export default renderElements = ({ renderObjs, dataSources }) => {
    return renderObjs.map((renderObj, index) =>
        <View key={index} style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
            {
                getItemData({ renderObj })
            }
        </View>
    )
}

const getItemData = ({ renderObj }) => {
    const theme = useTheme();
    switch (renderObj.type) {
        case QUESTION_TYPES.TEXT:
        case QUESTION_TYPES.TEXTAREA:
        case QUESTION_TYPES.QR_CODE:
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
        case QUESTION_TYPES.IMAGE:
            return <>
                <View style={styles.keyTextStyle}>
                    <Text category='h5'>{I18n.t('enrollment_image')}</Text>
                </View>
                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                <View>
                    {renderObj.value ?
                        <Image style={styles.userIcon} source={{ uri: `data:image/*;base64,${renderObj.value}` }} /> :
                        <Icon name={'account-circle'} pack="material-community" style={[styles.userIcon, { color: theme['color-basic-1000'] }]} />}
                </View>
            </>
        case QUESTION_TYPES.LOCATION:
            const latitude = Number(renderObj?.value?.latitude);
            const longitude = Number(renderObj?.value?.longitude);
            return <>
                <View style={styles.keyTextStyle}>
                    <Text category='h5'>{I18n.t('location')}</Text>
                </View>
                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                {renderObj.value == null ?
                    I18n.t('no_data_available') :
                    <TouchableOpacity activeOpacity={0.8} onPress={() => hasLocationAccess(latitude, longitude)}>
                        <View pointerEvents={'none'}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={styles.map}
                                initialCamera={{ center: { latitude, longitude }, heading: 0, pitch: 0, zoom: 15, altitude: 0 }}
                            >
                                <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
                            </MapView>
                        </View>
                    </TouchableOpacity>}
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
    userIcon: {
        width: convertWidth(170),
        height: convertWidth(150),
    },
    map: {
        width: convertWidth(170),
        height: convertHeight(100)
    },
});