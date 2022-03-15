import React, { useRef } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Svg, Circle } from 'react-native-svg';
import RNConfigReader from 'rn-config-reader';
import { components, I18n, utils } from '../../../common';

const { SafeAreaView, Content, Icon, FontelloIcon, Text, Button, useStyleSheet, StyleService, Input } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

export default LoginView = (props) => {
    const theme = useTheme();

    const AlertIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );
    const UserIcon = () => (
        <FontelloIcon name="user" size={convertHeight(20)} color={theme['color-basic-600']} />
    );
    const PasswordIcon = () => (
        <FontelloIcon name="password" size={convertHeight(20)} color={theme['color-basic-600']} />
    );

    const {
        user: { login },
        authenticate,
        navigateToForgotPassword
    } = props;
    const styles = useStyleSheet(themedStyles);
    const loginValidationSchema = yup.object().shape({
        username: yup
            .string()
            .required(I18n.t('please_enter_username_customerid_phone')),
        password: yup
            .string()
            .required(I18n.t('please_enter_password')),
    });

    const passwordInputRef = useRef();
    const loginButtonRef = useRef();

    return (
        <Formik
            validationSchema={loginValidationSchema}
            initialValues={{ username: '', password: '' }}
            onSubmit={authenticate}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <SafeAreaView>
                        <Content style={styles.content}>
                            <View style={styles.nameWrapperView}>
                                <Svg height={convertHeight(80)} width={convertWidth(80)}>
                                    {/* <Circle cx={convertWidth(40)} cy={convertHeight(40)} r={convertHeight(29)} stroke='#039123' /> */}
                                    <Icon name={RNConfigReader.app_login_icon} pack="assets" style={styles.iconStyle} />
                                </Svg>
                                <Text appearance='alternative' category='h3' >{I18n.t(RNConfigReader.app_name_key)}</Text>
                            </View>
                            <View style={styles.cardStyle}>
                                <View style={styles.loginTextWrapperView}>
                                    <Text appearance='alternative' category='h3'>{I18n.t('login')}</Text>
                                    <Text appearance='alternative' category='p1'>{I18n.t(RNConfigReader.app_slogan_key)}</Text>
                                </View>
                                <Input
                                    size='large'
                                    status={(errors.username && touched.username) ? 'danger' : 'basic'}
                                    value={values.username}
                                    placeholder={I18n.t('username_customerid_phone')}
                                    caption={(errors.username && touched.username) ? errors.username : ''}
                                    accessoryLeft={UserIcon}
                                    captionIcon={(errors.username && touched.username) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    style={styles.usernameInput}
                                    returnKeyType='next'
                                    onSubmitEditing={() => passwordInputRef.current.focus()}
                                    blurOnSubmit={false}
                                    autoCapitalize='none'
                                />
                                <Input
                                    size='large'
                                    status={(errors.password && touched.password) ? 'danger' : 'basic'}
                                    value={values.password}
                                    placeholder={I18n.t('password')}
                                    caption={(errors.password && touched.password) ? errors.password : ''}
                                    accessoryLeft={PasswordIcon}
                                    captionIcon={(errors.password && touched.password) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    secureTextEntry={true}
                                    style={styles.passwordInput}
                                    ref={passwordInputRef}
                                    returnKeyType='next'
                                    onSubmitEditing={() => { loginButtonRef.current.props.onPress() }}
                                />
                                <Button
                                    style={styles.loginButton}
                                    appearance='filled'
                                    disabled={login.isAuthenticating}
                                    size='large'
                                    onPress={handleSubmit}
                                    ref={loginButtonRef}
                                >
                                    <Text appearance='alternative' category='h3'>{I18n.t('login')}</Text>
                                </Button>
                                <TouchableOpacity onPress={navigateToForgotPassword} style={styles.forgotPasswordLink} disabled={login.isAuthenticating}>
                                    <Text appearance='alternative' category='h5'  >{I18n.t('forgot_your_password')}</Text>
                                </TouchableOpacity>
                            </View>
                        </Content>
                    </SafeAreaView>
                </>
            )}
        </Formik>
    );
}

const themedStyles = StyleService.create({
    content: {
        backgroundColor: 'color-basic-1000',
    },
    nameWrapperView: {
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        height: convertHeight(150)
    },
    cardStyle: {
        flex: 1,
        alignSelf: 'stretch',
        borderTopLeftRadius: convertHeight(60),
        backgroundColor: 'color-basic-600',
        paddingHorizontal: convertWidth(30),
        height: convertHeight(490)
    },
    loginTextWrapperView: {
        height: convertHeight(80),
        justifyContent: 'space-between',
        marginTop: convertHeight(40)
    },
    usernameInput: {
        marginTop: convertHeight(50)
    },
    passwordInput: {
        marginTop: convertHeight(15)
    },
    loginButton: {
        marginTop: convertHeight(15)
    },
    forgotPasswordLink: {
        marginTop: convertHeight(18),
        alignSelf: 'flex-end'
    },
    iconStyle: {
        width: convertWidth(62),
        height: convertHeight(62),
        top: convertWidth(10),
        left: convertWidth(10),
        resizeMode: 'contain'
    }
});
