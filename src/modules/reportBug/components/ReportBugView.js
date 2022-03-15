import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { components, I18n, utils } from '../../../common';
import _ from 'lodash';

const { dimensionUtils: { convertHeight, convertWidth } } = utils
const { Button, Input, Text, Card, SafeAreaView, Header, ImageView, Content, Icon } = components;

const ReportBugView = (props) => {
    const [imageError, setImageError] = useState(false);
    const { navigateToImagePicker, saveBugReport, deleteReportImage, reportImage } = props;
    const theme = useTheme();
    const styles = StyleSheet.create({
        label1: {
            color: theme['text-black-color'],
            fontSize: convertWidth(14),
            marginBottom: convertHeight(10)
        },
        card: {
            alignSelf: 'stretch',
            justifyContent: 'space-evenly'
        },
        content: {
            paddingHorizontal: convertWidth(13),
            paddingVertical: convertHeight(7),
            justifyContent: 'space-between',
            backgroundColor: theme['color-basic-200']
        },
        alertIcon: {
            width: convertWidth(10),
            height: convertHeight(10),
            marginRight: convertWidth(8),
            marginTop: convertHeight(8)
        },
        errorText: {
            marginTop: convertHeight(4)
        }
    });

    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            props.deleteReportImage();
        }
    }, []);

    useEffect(() => {
        if(reportImage != undefined) {
            setImageError(false);
        }
    }, [reportImage])

    const bugReportValidationSchema = yup.object().shape({
        comment: yup
            .string()
            .required(I18n.t('please_enter_comment')),
    });

    const AlertIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );

    return (
        <Formik
            validationSchema={bugReportValidationSchema}
            initialValues={{ comment: '', image: '' }}
            onSubmit={(values, { resetForm }) => {
                if (reportImage === undefined) {
                    setImageError(true);
                } else {
                    setImageError(false);
                    saveBugReport({
                        comment: values.comment,
                        image: reportImage
                    });
                    resetForm({});
                } 
            }}
        >
            {({ resetForm, handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                    <SafeAreaView>
                        <Header title={I18n.t('report_Bug')} />
                        <Content style={styles.content}>
                            <Card shadow style={styles.card}>
                                <View style={{ marginVertical: convertHeight(10) }}>
                                    <Text category='h5' style={[styles.label1]}>{I18n.t('upload_screenhot')}</Text>
                                    <ImageView
                                        screen={'bugReport'}
                                        navigate={navigateToImagePicker}
                                        deleteImg={deleteReportImage}
                                        source={reportImage} />
                                    {imageError &&
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon fill={theme['color-danger-500']} style={[styles.alertIcon, { marginRight: convertWidth(13), marginLeft: convertWidth(3) }]} name='alert-circle-outline' />
                                            <Text style={styles.errorText} category='c1' status='danger'>{I18n.t('select_picture')}</Text>
                                        </View>}
                                    <View style={{ marginBottom: convertHeight(15), marginVertical: convertHeight(5) }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('comment')}</Text>}
                                            size='large'
                                            status={errors.comment ? 'danger' : 'basic'}
                                            onChangeText={handleChange('comment')}
                                            value={values.comment}
                                            multiline={true}
                                            caption={errors.comment ? errors.comment : ''}
                                            captionIcon={errors.comment ? AlertIcon : () => (<></>)}
                                        />
                                    </View>
                                    <View style={{ marginBottom: convertHeight(15), flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Button
                                            appearance='outline'
                                            size='small'
                                            disabled={(imageError && errors.comment) && true}
                                            style={{ width: convertWidth(130) }}
                                            onPress={() => {
                                                if (_.isEmpty(reportImage) && _.isEmpty(values.comment)) {
                                                    props.navigateBack();
                                                } else {
                                                    deleteReportImage();
                                                    resetForm({});
                                                }
                                            }}
                                        >
                                            <Text category='h5'>{I18n.t('cancel')}</Text>
                                        </Button>
                                        <Button
                                            appearance='filled'
                                            size='small'
                                            status="primary"
                                            style={{
                                                width: convertWidth(130),
                                                backgroundColor: theme['color-basic-600'],
                                                borderWidth: 0
                                            }}
                                            onPress={handleSubmit}
                                        >
                                            <Text appearance='alternative' category='h5'>{I18n.t('save')}</Text>
                                        </Button>
                                    </View>
                                </View>
                            </Card>
                        </Content>
                    </SafeAreaView>
                </>
            )}
        </Formik>
    )
}

export default ReportBugView;