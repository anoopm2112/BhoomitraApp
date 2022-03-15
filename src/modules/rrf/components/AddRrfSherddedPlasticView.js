import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { components, I18n, utils } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import * as yup from 'yup';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';

const { Header, SafeAreaView, Input, Content, Card, Icon, Text, Button, Picker, Dropdown } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const AddRrfSherddedPlasticView = (props) => {
    const { mcfItemNames: { data = [] },
        itemSubCategories: { subCategory = [] },
        userInfo: { id, defaultOrganization }
    } = props;
    const [itemSubCategory, setSubCategory] = useState('');
    const theme = useTheme();
    const remarkInputRef = useRef();
    const { Item } = Picker;
    const isFocused = useIsFocused();

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.getMcfItemName();
                }
            }
        });
    }, []);

    let validationShape = {
        quantity: yup
            .string()
            .required(I18n.t('please_enter_quanity')),
        itemName: yup
            .string()
            .required(I18n.t('please_select_item')),
    };

    const validationForSherddedPlastic = yup.object().shape(validationShape);

    const styles = StyleSheet.create({
        content: {
            paddingHorizontal: convertWidth(13),
            paddingVertical: convertHeight(16),
            backgroundColor: theme['color-basic-200']
        },
        label: {
            color: theme['text-black-color'],
            fontSize: convertWidth(14)
        },
        item: {
            fontWeight: 'bold',
            fontSize: convertWidth(15),
            color: theme['text-black-color']
        },
        errorText: {
            marginTop: convertHeight(4)
        },
        alertIcon: {
            width: convertWidth(10),
            height: convertHeight(10),
            marginRight: convertWidth(8),
            marginTop: convertHeight(8)
        }
    });

    const AlertIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );

    return (
        <Formik validationSchema={validationForSherddedPlastic}
            initialValues={{
                quantity: '',
                remarks: '',
                itemName: '',
                itemSubCategory: ''
            }}
            onSubmit={(values, { resetForm }) => {
                let data = {
                    transactedBy: id,
                    organizationId: defaultOrganization.id,
                    itemId: values.itemName,
                    itemSubCategoryId: values.itemSubCategory,
                    quantityInKg: values.quantity,
                    remarks: values.remarks
                };
                props.saveShreddedPlastic(data);
            }}>
            {({ resetForm, handleChange, handleSubmit, handleBlur, values, errors, touched, setFieldValue }) => (
                <SafeAreaView>
                    <Header title={I18n.t('rrf_shredded_plastic')} />
                    <Content style={styles.content}>
                        <Card shadow style={{ width: '100%' }}>
                            <Text category='h5' style={styles.label}>{I18n.t('mcf_item_name')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                            <View style={{ marginTop: convertHeight(8) }}>
                                <Dropdown
                                    picker={
                                        <Picker selectedValue={values.itemName}
                                            onValueChange={(itemValue) => {
                                                setFieldValue('itemName', itemValue);
                                                props.getItemSubCategories(itemValue);
                                            }}
                                            mode="dropdown">
                                            {[
                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                ...data?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                            ]}
                                        </Picker>
                                    }
                                    status={(errors.itemName && touched.itemName) ? 'danger' : 'basic'}
                                    caption={(errors.itemName && touched.itemName) ? <Text style={styles.errorText} category='c1' status='danger'>{errors.itemName}</Text> : null}
                                    captionIcon={(errors.itemName && touched.itemName) ? <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> : null}
                                />
                            </View>
                            <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                <Text category='h5' style={styles.label}>{I18n.t('item_sub_category')}</Text>
                                <View style={{ marginTop: convertHeight(8) }}>
                                    <Dropdown
                                        picker={
                                            <Picker
                                                selectedValue={values.itemSubCategory}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setFieldValue('itemSubCategory', itemValue);
                                                }}
                                                mode="dropdown">
                                                {
                                                    [
                                                        <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                        ...subCategory?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                    ]
                                                }
                                            </Picker>
                                        } />
                                </View>
                            </View>
                            <View style={{ marginTop: convertHeight(8) }}>
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('mcf_stock_quantity')}<Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>}
                                    size='large'
                                    status={(errors.quantity && touched.quantity) ? 'danger' : 'basic'}
                                    onChangeText={handleChange('quantity')}
                                    value={values.quantity}
                                    multiline={true}
                                    keyboardType={'number-pad'}
                                    onBlur={handleBlur('quantity')}
                                    placeholder={I18n.t('type_here')}
                                    returnKeyType={'next'}
                                    onSubmitEditing={() => remarkInputRef.current.focus()}
                                    caption={(errors.quantity && touched.quantity) ? errors.quantity : ''}
                                    captionIcon={(errors.quantity && touched.quantity) ? AlertIcon : () => (<></>)}
                                />
                            </View>
                            <View style={{ marginTop: convertHeight(15) }}>
                                <Input
                                    label={<Text category='h5' style={styles.label} >{I18n.t('mcf_stock_remarks')}</Text>}
                                    size='large'
                                    status={(errors.remarks && touched.remarks) ? 'danger' : 'basic'}
                                    onChangeText={handleChange('remarks')}
                                    value={values.remarks}
                                    multiline={true}
                                    placeholder={I18n.t('type_here')}
                                    caption={(errors.remarks && touched.remarks) ? errors.remarks : ''}
                                    captionIcon={(errors.remarks && touched.remarks) ? AlertIcon : () => (<></>)}
                                />
                            </View>
                            <View style={{ marginTop: convertWidth(40), marginBottom: convertWidth(15), flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button onPress={() => { resetForm({}) }} appearance='outline' size='small' style={{ width: convertWidth(130) }}>
                                    <Text category='h5'>{I18n.t('cancel')}</Text>
                                </Button>
                                <Button onPress={handleSubmit} appearance='filled' size='small' status="primary" style={{ width: convertWidth(130), backgroundColor: theme['color-basic-600'], borderWidth: 0 }}>
                                    <Text appearance='alternative' category='h5'>{I18n.t('save')}</Text>
                                </Button>
                            </View>
                        </Card>
                    </Content>
                </SafeAreaView>
            )}
        </Formik>
    );
}

export default AddRrfSherddedPlasticView;
