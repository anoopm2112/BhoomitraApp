import React, { useRef } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { components, I18n, utils } from '../../../common';

const { SafeAreaView, Content, Icon, Text, Button, useStyleSheet, StyleService, Input, Header, Card } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

export default ChangePasswordView = (props) => {
    const changePasswordValidationSchema = yup.object().shape({
        oldPassword: yup
            .string()
            .required(I18n.t('please_enter_old_password')),
        newPassword: yup
            .string()
            .required(I18n.t('please_enter_new_password'))
            .notOneOf([yup.ref('oldPassword')], I18n.t('old_and_new_password_cannot_be_same')),
        confirmPassword: yup
            .string()
            .required(I18n.t('please_enter_new_password'))
            .oneOf([yup.ref('newPassword'), null], I18n.t('passwords_do_not_match')),
    });

    const styles = useStyleSheet(themedStyles);

    const newPasswordInputRef = useRef();
    const confirmPasswordInputRef = useRef();
    const updatePasswordButtonRef = useRef();

    return (
        <Formik
            validationSchema={changePasswordValidationSchema}
            initialValues={{ id: props.user.info.id, oldPassword: '', newPassword: '', confirmPassword: '' }}
            onSubmit={props.updatePassword}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <SafeAreaView>
                        <Header title={I18n.t('change_password')} />
                        <Content style={styles.content} >
                            <Card shadow style={styles.card}>
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('old_password')}</Text>}
                                    size='medium'
                                    status={(errors.oldPassword && touched.oldPassword) ? 'danger' : 'basic'}
                                    value={values.oldPassword}
                                    caption={(errors.oldPassword && touched.oldPassword) ? errors.oldPassword : ''}
                                    captionIcon={(errors.oldPassword && touched.oldPassword) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('oldPassword')}
                                    onBlur={handleBlur('oldPassword')}
                                    returnKeyType='next'
                                    onSubmitEditing={() => newPasswordInputRef.current.focus()}
                                    blurOnSubmit={false}
                                    secureTextEntry
                                />
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('new_password')}</Text>}
                                    size='medium'
                                    status={(errors.newPassword && touched.newPassword) ? 'danger' : 'basic'}
                                    value={values.newPassword}
                                    caption={(errors.newPassword && touched.newPassword) ? errors.newPassword : ''}
                                    captionIcon={(errors.newPassword && touched.newPassword) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    ref={newPasswordInputRef}
                                    returnKeyType='next'
                                    onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
                                    blurOnSubmit={false}
                                    secureTextEntry
                                />
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('confirm_password')}</Text>}
                                    size='medium'
                                    status={(errors.confirmPassword && touched.confirmPassword) ? 'danger' : 'basic'}
                                    value={values.confirmPassword}
                                    caption={(errors.confirmPassword && touched.confirmPassword) ? errors.confirmPassword : ''}
                                    captionIcon={(errors.confirmPassword && touched.confirmPassword) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    ref={confirmPasswordInputRef}
                                    returnKeyType='next'
                                    onSubmitEditing={() => updatePasswordButtonRef.current.props.onPress()}
                                    secureTextEntry
                                />
                            </Card>
                            <View style={styles.buttonView}>
                                <Button
                                    appearance='filled'
                                    size='large'
                                    disabled={props.user.updatePassword.requestInProgress}
                                    ref={updatePasswordButtonRef}
                                    onPress={handleSubmit}
                                >
                                    <Text appearance='alternative' category='h3'>{I18n.t('save')}</Text>
                                </Button>
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
        paddingHorizontal: convertWidth(13),
        paddingVertical: convertHeight(7),
        justifyContent: 'space-between',
        backgroundColor: 'color-basic-200'
    },
    card: {
        alignSelf: 'stretch',
        justifyContent: 'space-evenly',
        height: convertHeight(300)
    },
    label: {
        color: 'text-black-color',
    },
    buttonView: {
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
        height: convertHeight(200),
        paddingBottom: convertHeight(43),
        paddingHorizontal: convertWidth(13)
    }
});