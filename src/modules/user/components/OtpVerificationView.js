import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as Progress from 'react-native-progress';
import { components, utils, I18n } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import { OTP_WAITING_PERIOD } from '../constants';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Layout, Icon, Text, Button, Input, Content, FontelloIcon } = components;

export default OtpVerificationView = ({ navigateToForgotPassword, ...props }) => {
    const otpValidationSchema = yup.object().shape({
        firstNumber: yup
            .number()
            .required(' '),
        secondNumber: yup
            .number()
            .required(' '),
        thirdNumber: yup
            .number()
            .required(' '),
        fourthNumber: yup
            .number()
            .required(' '),
    });

    const firstInputRef = useRef();
    const secondInputRef = useRef();
    const thirdInputRef = useRef();
    const fourthInputRef = useRef();
    const verificationButtonRef = useRef();

    const { route: { params: { data: phoneNumber = '' } = {} } = {}, user: { otpVerify } } = props;

    const theme = useTheme();

    const styles = StyleSheet.create({
        layout: {
            flex: 1,
            paddingHorizontal: convertWidth(30)
        },
        topSection: {
            height: convertHeight(180)
        },
        bottomSection: {
            height: convertWidth(460),
            alignSelf: 'stretch',
            alignItems: 'center'
        },
        wrapperIcon: {
            paddingTop: convertHeight(27),
        },
        wrapperImage: {
            flex: 1,
            alignItems: 'center'
        },
        backArrowIcon: {
            width: convertHeight(18.5),
            height: convertHeight(14),
            resizeMode: 'contain'
        },
        otpIcon: {
            width: convertWidth(200),
            height: convertHeight(137),
            resizeMode: 'contain',
        },
        otpText: {
            paddingTop: convertHeight(39),
            alignSelf: 'flex-start'
        },
        wrapperInputFields: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            marginTop: convertHeight(19)
        },
        otpInput: {
            width: convertWidth(50),
            height: convertWidth(50)
        },
        verificationButton: {
            marginTop: convertHeight(30),
            alignSelf: 'stretch'
        },
        getOtpText: {
            marginTop: convertHeight(10),
            color: theme['color-basic-400']
        },
        resendText: {
            marginTop: convertHeight(15),
            textDecorationLine: 'underline'
        },
        pleaseWaitResendText: {
            marginTop: convertHeight(15)
        },
        progressPie: {
            marginTop: convertHeight(20),
            alignSelf: 'center'
        }
    });
    return (
        <Formik
            validationSchema={otpValidationSchema}
            initialValues={{
                firstNumber: '',
                secondNumber: '',
                thirdNumber: '',
                fourthNumber: '',
                phoneNumber
            }}
            onSubmit={props.verifyOtp}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <SafeAreaView>
                        <Layout level='6' style={styles.layout}>
                            <View style={styles.topSection}>
                                <View style={styles.wrapperIcon}>
                                    <TouchableOpacity onPress={navigateToForgotPassword}>
                                        <FontelloIcon name="back-button" size={convertWidth(14)} style={{ color: theme['color-basic-100'] }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.wrapperImage}>
                                    <Icon name='otp' pack='assets' style={styles.otpIcon} />
                                </View>
                            </View>
                            <Content style={styles.bottomSection}>
                                <Text style={styles.otpText} appearance='alternative' category='label'>{I18n.t('otp_verification')}</Text>
                                <View style={styles.wrapperInputFields}>
                                    <Input
                                        status={(errors.firstNumber && touched.firstNumber) ? 'danger' : 'basic'}
                                        // autoFocus={true}
                                        placeholder='-'
                                        maxLength={1}
                                        value={values.firstNumber}
                                        onChangeText={(text) => {
                                            text = text.replace(/[^0-9]/g, '');
                                            handleChange('firstNumber')(text);
                                            if (text.length > 0) {
                                                secondInputRef.current.focus();
                                            }
                                        }}
                                        onBlur={handleBlur('firstNumber')}
                                        keyboardType='numeric'
                                        returnKeyType='next'
                                        blurOnSubmit={false}
                                        ref={firstInputRef}
                                        style={styles.otpInput}
                                    />
                                    <Input
                                        status={(errors.secondNumber && touched.secondNumber) ? 'danger' : 'basic'}
                                        placeholder='-'
                                        maxLength={1}
                                        value={values.secondNumber}
                                        onChangeText={(text) => {
                                            text = text.replace(/[^0-9]/g, '');
                                            handleChange('secondNumber')(text);
                                            if (text.length > 0) {
                                                thirdInputRef.current.focus();
                                            }
                                        }}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key === 'Backspace') {
                                                firstInputRef.current.focus();
                                            }
                                        }}
                                        onBlur={handleBlur('secondNumber')}
                                        keyboardType='numeric'
                                        returnKeyType='next'
                                        blurOnSubmit={false}
                                        ref={secondInputRef}
                                        style={styles.otpInput}
                                    />
                                    <Input
                                        status={(errors.thirdNumber && touched.thirdNumber) ? 'danger' : 'basic'}
                                        placeholder='-'
                                        maxLength={1}
                                        value={values.thirdNumber}
                                        onChangeText={(text) => {
                                            text = text.replace(/[^0-9]/g, '');
                                            handleChange('thirdNumber')(text);
                                            if (text.length > 0) {
                                                fourthInputRef.current.focus();
                                            }
                                        }}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key === 'Backspace') {
                                                secondInputRef.current.focus();
                                            }
                                        }}
                                        onBlur={handleBlur('thirdNumber')}
                                        keyboardType='numeric'
                                        returnKeyType='next'
                                        blurOnSubmit={false}
                                        ref={thirdInputRef}
                                        style={styles.otpInput}
                                    />
                                    <Input
                                        status={(errors.fourthNumber && touched.fourthNumber) ? 'danger' : 'basic'}
                                        placeholder='-'
                                        maxLength={1}
                                        value={values.fourthNumber}
                                        onChangeText={(text) => {
                                            text = text.replace(/[^0-9]/g, '');
                                            handleChange('fourthNumber')(text);
                                            if (text.length > 0) {
                                                fourthInputRef.current.blur();
                                            }
                                        }}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key === 'Backspace') {
                                                thirdInputRef.current.focus();
                                            }
                                        }}
                                        onBlur={handleBlur('fourthNumber')}
                                        keyboardType='numeric'
                                        ref={fourthInputRef}
                                        style={styles.otpInput}
                                    />
                                </View>
                                <Button
                                    style={styles.verificationButton}
                                    appearance='filled'
                                    disabled={otpVerify.requestInProgress}
                                    size='large'
                                    ref={verificationButtonRef}
                                    onPress={handleSubmit}
                                >
                                    <Text appearance='alternative' category='h3'>{I18n.t('Verify_and_Proceed')}</Text>
                                </Button>
                                <Text style={styles.getOtpText} appearance='alternative' category='c1'>{I18n.t('did_not_get_otp_code')}</Text>
                                {otpVerify.shouldResend ?
                                    <TouchableOpacity disabled={otpVerify.requestInProgress} onPress={() => { props.resendOtp(phoneNumber); }}>
                                        <Text style={styles.resendText} appearance='alternative' category='p1'>{I18n.t('resend_code')}</Text>
                                    </TouchableOpacity> :
                                    <>
                                        <Text style={styles.pleaseWaitResendText} appearance='alternative' category='p1'>{I18n.t('please_wait_resend_code', { minutes: Math.ceil((OTP_WAITING_PERIOD - OTP_WAITING_PERIOD * otpVerify.progress)) })}</Text>
                                        <Progress.Pie animated={false} style={styles.progressPie} color='#7AF395' progress={otpVerify.progress} size={50} />
                                    </>
                                }
                            </Content>
                        </Layout>
                    </SafeAreaView>
                </>
            )}
        </Formik>
    );
}
