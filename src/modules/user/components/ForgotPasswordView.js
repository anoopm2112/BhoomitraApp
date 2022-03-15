import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Svg, Circle } from 'react-native-svg';
import RNConfigReader from 'rn-config-reader';
import { useTheme } from '@ui-kitten/components';
import types from '../../../common/eva/mapping';
import { components, utils, I18n } from '../../../common';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Layout, Icon, Text, Input, Button, FontelloIcon } = components;

export default ForgotPasswordView = (props) => {

    const AlertIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );
    
    const UserIcon = () => (
            <FontelloIcon name="user" size={convertHeight(20)} color={theme['color-basic-600']} />
    );

    const forgotPasswordValidationSchema = yup.object().shape({
        phoneNumber: yup
            .string()
            .required(I18n.t('please_enter_phone_number'))
            .matches(new RegExp('[0-9]{10}'), I18n.t('please_enter_valid_phone_number'))
    });

    const otpButtonRef = useRef();

    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1
        },
        topLayout: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme['color-basic-1000'],
            height: convertHeight(162)
        },
        bottomLayout: {
            backgroundColor: theme['color-basic-1000'],
            height: convertHeight(478)
        },
        layout: {
            flex: 1,
            paddingHorizontal: convertWidth(30),
            borderTopLeftRadius: convertWidth(60)
        },
        circle: {
            height: convertHeight(58),
            width: convertHeight(58),
            borderRadius: convertWidth(30),
        },
        nameText: {
            fontFamily: types.strict['text-font-family'],
            fontSize: convertHeight(20),
            lineHeight: convertHeight(23),
            color: theme['color-basic-100'],
            paddingTop: convertHeight(6)
        },
        passwordText: {
            marginTop: convertHeight(57)
        },
        phoneNumberInput: {
            marginTop: convertHeight(19)
        },
        otpButton: {
            marginTop: convertHeight(30)
        },
        iconStyle: {
            width: convertWidth(62),
            height: convertHeight(62),
            top: convertWidth(10),
            left: convertWidth(10),
            resizeMode: 'contain'
        }
    });

    return (
        <Formik
            validationSchema={forgotPasswordValidationSchema}
            initialValues={{ phoneNumber: '' }}
            onSubmit={(values) => { props.sendOtp(values); }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <SafeAreaView>
                        <View style={styles.container}>
                            <View style={styles.topLayout}>
                                <Svg height={convertHeight(80)} width={convertWidth(80)}>
                                    <Icon name={RNConfigReader.app_login_icon} pack="assets" style={styles.iconStyle} />
                                </Svg>
                                <Text style={styles.nameText}>{I18n.t(RNConfigReader.app_name_key)}</Text>
                            </View>
                            <View style={styles.bottomLayout}>
                                <Layout level='6' style={styles.layout}>
                                    <Text style={styles.passwordText} appearance='alternative' category='label'>{I18n.t('forgot_your_password')}</Text>
                                    <Input
                                        size='large'
                                        status={(errors.phoneNumber && touched.phoneNumber) ? 'danger' : 'basic'}
                                        value={values.phoneNumber}
                                        maxLength={10}
                                        placeholder={I18n.t('phone_number')}
                                        caption={(errors.phoneNumber && touched.phoneNumber) ? errors.phoneNumber : ''}
                                        accessoryLeft={UserIcon}
                                        captionIcon={(errors.phoneNumber && touched.phoneNumber) ? AlertIcon : () => (<></>)}
                                        onChangeText={(text) => {
                                            text = text.replace(/[^0-9]/g, '');
                                            handleChange('phoneNumber')(text);
                                        }}
                                        onBlur={handleBlur('phoneNumber')}
                                        style={styles.phoneNumberInput}
                                        keyboardType='numeric'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { otpButtonRef.current.props.onPress() }}
                                    />
                                    <Button
                                        style={styles.otpButton}
                                        appearance='filled'
                                        disabled={props.user.forgotPassword.requestInProgress}
                                        size='large'
                                        onPress={handleSubmit}
                                        ref={otpButtonRef}
                                    >
                                        <Text appearance='alternative' category='h3'>{I18n.t('send_otp')}</Text>
                                    </Button>
                                </Layout>
                            </View>
                        </View>
                    </SafeAreaView>
                </>
            )}
        </Formik>
    );
};