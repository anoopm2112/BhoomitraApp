import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { components, I18n, utils, constants } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import * as yup from 'yup';

const { Header, SafeAreaView, Input, Content, Card, Text, Button, Picker, Dropdown, Icon } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { ORGANIZATION_TYPE, VALIDATION_RULES } = constants;

const AddItemStockInView = (props) => {
    const { itemSubCategories: { subCategory = [], refreshing }, mcfItemNames: { data = [] }
    } = props;
    const { route: { params: { data: { page, item, title } = {} } = {} } } = props;
    const [saleItemNameItem, setSaleItemNameItem] = useState(item?.itemName);
    const [itemSubCategoryName, setSubCategoryName] = useState(item?.itemSubCategoryName);
    const { Item } = Picker;
    const theme = useTheme();
    const isFocused = useIsFocused();
    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.getMcfItemName();
                    if (item) {
                        props.getItemSubCategories(item.itemId);
                    }
                }
            }
        });
    }, []);

    const AlertIcon = (props) => (
        <Icon {...props} name='alert-circle-outline' />
    );

    const styles = StyleSheet.create({
        content: {
            paddingHorizontal: convertWidth(13),
            paddingVertical: convertHeight(16),
            justifyContent: 'space-around',
            backgroundColor: theme['color-basic-200'],
            width: convertWidth(360)
        },
        card: {
            alignSelf: 'stretch',
            justifyContent: 'space-evenly'
        },
        label: {
            color: theme['text-black-color'],
            fontSize: convertWidth(14)
        },
        labelTotal: {
            color: theme['text-black-color'],
            fontSize: convertWidth(16)
        },
        labelTotalTxt: {
            color: theme['text-black-color'],
            fontSize: convertWidth(17),
            fontWeight: 'bold'
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

    const validationSchema = {
        item: yup
            .string()
            .required(I18n.t('select_atleast_one_item')),
        quantity: yup
            .string()
            .required(I18n.t('please_enter_quanity')),
    };
    if (page === undefined) {
        validationSchema.itemSubCategory = yup
            .string()
            .required(I18n.t('select_atleast_one_item'));
    }
    const itemValidationSchema = yup.object().shape(validationSchema);

    return (
        <SafeAreaView>
            <Header title={`${I18n.t('add_item')} ${I18n.t(title)}`} />
            <Formik
                validationSchema={itemValidationSchema}
                initialValues={{
                    quantity: item?.quantityInKg,
                    item: item?.itemId,
                    itemSubCategory: item?.itemSubCategoryId,
                    id: item?.id
                }}
                onSubmit={(values, { resetForm }) => {
                    let data = {
                        id: values.id,
                        itemId: values.item,
                        itemName: saleItemNameItem,
                        quantityInKg: values.quantity,
                        itemSubCategoryId: values.itemSubCategory,
                        itemSubCategoryName: itemSubCategoryName,
                        editItem: item
                    };
                    props.addStockInItem(data);
                    if (values.item && values.quantity) {
                        props.navigation.goBack();
                    }
                }}
            >
                {({ resetForm, handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        <Content>
                            <View style={styles.content} >
                                <Card shadow style={styles.card}>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('mcf_item_name')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        selectedValue={values.item}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setFieldValue('item', itemValue);
                                                            props.getItemSubCategories(itemValue);
                                                            if (itemValue) {
                                                                setSaleItemNameItem(data.length > 0 ? data[itemIndex - 1].name : '');
                                                            }
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                ...data?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                                status={(errors.item && touched.item) ? 'danger' : 'basic'}
                                                caption={(errors.item && touched.item) ? <Text style={styles.errorText} category='c1' status='danger'>{errors.item}</Text> : null}
                                                captionIcon={(errors.item && touched.item) ? <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> : null}
                                            />
                                        </View>
                                    </View>
                                    {
                                        page !== 'stockIn' &&
                                        <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                            <Text category='h5' style={styles.label}>{I18n.t('item_sub_category')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                            <View style={{ marginTop: convertHeight(8) }}>
                                                <Dropdown
                                                    picker={
                                                        <Picker
                                                            selectedValue={values.itemSubCategory}
                                                            onValueChange={(itemValue, itemIndex) => {
                                                                setFieldValue('itemSubCategory', itemValue);
                                                                if (itemValue !== 0) {
                                                                    setSubCategoryName(subCategory.length > 0 ? subCategory[itemIndex - 1].name : '');
                                                                }
                                                            }}
                                                            mode="dropdown">
                                                            {
                                                                [
                                                                    <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                    ...subCategory?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                                ]
                                                            }
                                                        </Picker>
                                                    }
                                                    status={(errors.itemSubCategory && touched.itemSubCategory) ? 'danger' : 'basic'}
                                                    caption={(errors.itemSubCategory && touched.itemSubCategory) ? <Text style={styles.errorText} category='c1' status='danger'>{errors.itemSubCategory}</Text> : null}
                                                    captionIcon={(errors.itemSubCategory && touched.itemSubCategory) ? <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> : null}
                                                />
                                            </View>
                                        </View>
                                    }
                                    <View style={{ marginTop: convertHeight(15), marginBottom: convertHeight(20) }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('mcf_stock_quantity')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>}
                                            size='large'
                                            onChangeText={handleChange('quantity')}
                                            value={values.quantity}
                                            keyboardType='number-pad'
                                            placeholder={I18n.t('type_here')}
                                            status={(errors.quantity && touched.quantity) ? 'danger' : 'basic'}
                                            caption={(errors.quantity && touched.quantity) ? errors.quantity : ''}
                                            captionIcon={(errors.quantity && touched.quantity) ? AlertIcon : () => (<></>)}
                                        />
                                    </View>
                                </Card>

                                <View style={{ marginTop: convertWidth(50), marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button
                                        appearance='outline'
                                        size='small'
                                        style={{ width: convertWidth(130) }}
                                        onPress={() => {
                                            resetForm({});
                                            props.navigation.goBack();
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
                                        <Text appearance='alternative' category='h5'>{I18n.t('add')}</Text>
                                    </Button>
                                </View>
                            </View>
                        </Content>
                    </>
                )}
            </Formik>
        </SafeAreaView>
    );
}

export default AddItemStockInView;
