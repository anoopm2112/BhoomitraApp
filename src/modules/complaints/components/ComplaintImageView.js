import React from 'react';
import { View, StyleSheet } from 'react-native';
import { components, I18n, utils, } from '../../../common';

const { Header, Camera, SafeAreaView } = components;
const { dimensionUtils: { convertHeight } } = utils;

const ComplaintImageView = (props) => {
    const { navigation } = props;

    const styles = StyleSheet.create({
        cameraView: {
            marginTop: convertHeight(80),
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('take_photo')} />
            <View style={styles.cameraView}>
                <Camera onImageTaken={(base64) => {
                    props.newComplaintImage(base64);
                    navigation.goBack();
                }} />
            </View>
        </SafeAreaView>
    );
};

export default ComplaintImageView;
