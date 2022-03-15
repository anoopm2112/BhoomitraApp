import React from 'react';
import { View, StyleSheet } from 'react-native';
import { I18n, utils, components } from '../../../common';

const { dimensionUtils: { convertHeight } } = utils;
const { Text, Header } = components;

const ServiceComplaintItemListView = () => {

    return (
        <>
            <Header title={I18n.t('complaints_small')} />
            <View style={styles.mainContainer}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View>
        </>
    );

};

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: convertHeight(10)
    }
});

export default ServiceComplaintItemListView;
