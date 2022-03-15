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

export default EditProfileView = (props) => {
    const { info: { id, username, firstName = '', middleName = '', lastName = '', userTypeResponse: { typeId: userTypeId } = {} } = {} } = props.user;
    const editProfileValidationSchema = yup.object().shape({
        firstName: yup
            .string()
            .required(I18n.t('please_enter_first_name')),
        lastName: yup
            .string()
            .required(I18n.t('please_enter_last_name')),
    });

    const styles = useStyleSheet(themedStyles);

    const middleNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const updateProfileButtonRef = useRef();

    return (
        <Formik
            validationSchema={editProfileValidationSchema}
            initialValues={{ id, username, firstName, middleName, lastName, userTypeId }}
            onSubmit={props.updateProfile}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <SafeAreaView>
                        <Header title={I18n.t('edit_profile')} />
                        <Content style={styles.content} >
                            <Card shadow style={styles.card}>
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('first_name')}</Text>}
                                    size='medium'
                                    status={(errors.firstName && touched.firstName) ? 'danger' : 'basic'}
                                    value={values.firstName}
                                    caption={(errors.firstName && touched.firstName) ? errors.firstName : ''}
                                    captionIcon={(errors.firstName && touched.firstName) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('firstName')}
                                    onBlur={handleBlur('firstName')}
                                    returnKeyType='next'
                                    onSubmitEditing={() => middleNameInputRef.current.focus()}
                                    blurOnSubmit={false}
                                />
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('middle_name')}</Text>}
                                    size='medium'
                                    status={(errors.middleName && touched.middleName) ? 'danger' : 'basic'}
                                    value={values.middleName}
                                    caption={(errors.middleName && touched.middleName) ? errors.middleName : ''}
                                    captionIcon={(errors.middleName && touched.middleName) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('middleName')}
                                    onBlur={handleBlur('middleName')}
                                    ref={middleNameInputRef}
                                    returnKeyType='next'
                                    onSubmitEditing={() => lastNameInputRef.current.focus()}
                                    blurOnSubmit={false}
                                />
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('last_name')}</Text>}
                                    size='medium'
                                    status={(errors.lastName && touched.lastName) ? 'danger' : 'basic'}
                                    value={values.lastName}
                                    caption={(errors.lastName && touched.lastName) ? errors.lastName : ''}
                                    captionIcon={(errors.lastName && touched.lastName) ? AlertIcon : () => (<></>)}
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    ref={lastNameInputRef}
                                    returnKeyType='next'
                                    onSubmitEditing={() => updateProfileButtonRef.current.props.onPress()}
                                />
                            </Card>
                            <View style={styles.buttonView}>
                                <Button
                                    appearance='filled'
                                    size='large'
                                    disabled={props.user.updateProfile.requestInProgress}
                                    ref={updateProfileButtonRef}
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