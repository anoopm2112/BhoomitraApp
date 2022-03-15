import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { components, I18n, utils, constants } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import * as yup from 'yup';

const { Header, SafeAreaView, Input, Content, Card, Text, Button, Picker, Dropdown } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { ORGANIZATION_TYPE, VALIDATION_RULES } = constants;

const AddMcfSaleView = (props) => {
    const { route: { params: { data: { vendorId, title,
        item: {
            itemTypeId = '', itemTypeName = '', quantityInKg = '',
            itemId = '', itemName = '', rate: oldRate, total: oldTotal = 0,
            itemSubCategoryId: subCategoryId,
            itemSubCategoryName: subCategoryName, id = '', negativeRate = ''
        } = {} } = {} } = {} } } = props;
    const { rate: { price = oldRate, subcategoryPrice = 0 }, mcfItemNames: { data = [] },
        mcfItemTypes: { itemType = [] },
        itemSubCategories: { subCategory = [], refreshing },
    } = props;
    const { route: { params: { data: { item } } } } = props;
    const [saleItemType, setsaleItemType] = useState(itemTypeId);
    const [saleItemTypeItem, setSaleItemTypeItem] = useState(itemTypeName);
    const [saleItemId, setItemId] = useState(itemId);
    const [saleItemName, setItemName] = useState(itemName);
    const [saleItemNegativeRate, setNegativeRate] = useState(negativeRate);
    const [saleItemNameItem, setSaleItemNameItem] = useState();
    const [itemSubCategory, setSubCategory] = useState(subCategoryId);
    const [itemSubCategoryName, setSubCategoryName] = useState(subCategoryName);
    const [rate, setRate] = useState(price);
    const [total, setTotal] = useState(oldTotal);
    const [errorMsg, setErrorMsg] = useState('');
    const { Item } = Picker;
    const theme = useTheme();
    const isFocused = useIsFocused();

    useEffect(() => {
        setRate(price);
    }, [price]);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.getMcfItemTypes();
                    props.getMcfItemName();
                    props.resetRate();
                    if(item){
                        props.getItemSubCategories(itemId);
                    }
                }
            }
        });
    }, [isFocused]);

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
        }
    });

    const calculateTotal = (quantity, rate) => {
        let total = 0;
        if (quantity && rate) {
            total = quantity * 1000 * rate;
            if (saleItemNegativeRate) {
                total = - total;
            }
            setTotal(total);
            setErrorMsg('');
        }
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const validationSchema = yup.object().shape({
        handedOverContact: yup
            .string().matches(VALIDATION_RULES.PHONE_REG_EXP, I18n.t('please_enter_valid_phone_number')),
        receivedByContact: yup
            .string().matches(VALIDATION_RULES.PHONE_REG_EXP, I18n.t('please_enter_valid_phone_number'))
    });

    return (
        <SafeAreaView>
            <Header title={`${I18n.t('add_item')} ${I18n.t(title)}`} />
            <Formik
                validationSchema={validationSchema}
                initialValues={{
                    quantity: quantityInKg,
                    ratePerGram: rate
                }}
                onSubmit={(values, { resetForm }) => {
                    let data = {
                        id: id,
                        itemId: saleItemId,
                        itemName: saleItemName,
                        negativeRate: saleItemNegativeRate,
                        itemTypeId: saleItemType,
                        itemTypeName: saleItemTypeItem,
                        quantityInKg: values.quantity,
                        rate: rate,
                        total: total,
                        itemSubCategoryId: itemSubCategory,
                        itemSubCategoryName: itemSubCategoryName,
                        editItem: item
                    };
                    if (saleItemId && itemSubCategory && saleItemType && values.quantity && rate) {
                        props.addSaleItem(data);
                        setErrorMsg('')
                        props.navigation.goBack();
                    } else {
                        setErrorMsg(I18n.t('fill_required_fields'))
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
                                                        key={saleItemId}
                                                        selectedValue={saleItemId}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setItemId(itemValue);
                                                            props.getItemSubCategories(itemValue);
                                                            if (itemValue !== 0) {
                                                                setSaleItemNameItem(data.length > 0 ? data[itemIndex - 1] : '');
                                                                setItemName(data.length > 0 ? data[itemIndex - 1].name : '');
                                                                setNegativeRate(data.length > 0 ? data[itemIndex - 1].negativeRate : '')
                                                            }
                                                            if (vendorId && saleItemType && itemValue && itemSubCategory) {
                                                                let data = {
                                                                    vendorId: vendorId,
                                                                    saleItemType: saleItemType,
                                                                    saleItemId: itemValue,
                                                                    saleItemSubCategoryId: itemSubCategory
                                                                };
                                                                props.getRate(data);
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
                                            />
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('item_sub_category')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={itemSubCategory}
                                                        selectedValue={itemSubCategory}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setSubCategory(itemValue);
                                                            if (itemValue !== 0) {
                                                                setSubCategoryName(subCategory.length > 0 ? subCategory[itemIndex - 1].name : '');
                                                            }
                                                            if (vendorId && itemValue && saleItemId && saleItemType) {
                                                                let data = {
                                                                    vendorId: vendorId,
                                                                    saleItemType: saleItemType,
                                                                    saleItemId: saleItemId,
                                                                    saleItemSubCategoryId: itemValue
                                                                };
                                                                props.getRate(data);
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
                                            />
                                        </View>
                                    </View>

                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('mcf_sale_item_type')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={saleItemType}
                                                        selectedValue={saleItemType}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setsaleItemType(itemValue);
                                                            if (itemType !== undefined && itemType.length > 0 && itemValue) {
                                                                setSaleItemTypeItem(itemType.length > 0 ? itemType[itemIndex - 1].name : '');
                                                            }
                                                            if (vendorId && itemValue && saleItemId && itemSubCategory) {
                                                                let data = {
                                                                    vendorId: vendorId,
                                                                    saleItemType: itemValue,
                                                                    saleItemId: saleItemId,
                                                                    saleItemSubCategoryId: itemSubCategory
                                                                };
                                                                props.getRate(data);
                                                            }
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                ...itemType?.map(option => <Item key={option.id} label={option.name} value={option.id} />)

                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: convertHeight(15) }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('mcf_stock_quantity')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>}
                                            size='large'
                                            onChangeText={handleChange('quantity')}
                                            value={values.quantity}
                                            keyboardType='number-pad'
                                            placeholder={I18n.t('type_here')}
                                        />
                                    </View>
                                    <View style={{ marginTop: convertHeight(15), flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('item_rate')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>}
                                            size='large'
                                            value={rate === null ? '0' : rate?.toString()}
                                            disabled
                                        />
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('sub_category_rate')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>}
                                            size='large'
                                            value={subcategoryPrice === null ? '0' : subcategoryPrice?.toString()}
                                            disabled
                                        />
                                    </View>
                                    {errorMsg !== '' && <Text category='h5' style={{ color: theme['color-danger-500'], marginTop: convertHeight(10) }}>{errorMsg}</Text>}
                                    <View style={{ marginTop: convertHeight(25) }}>
                                        <View style={{ height: convertWidth(3), width: convertWidth(305), backgroundColor: theme['color-basic-300'] }} />
                                        <View style={{ marginVertical: convertWidth(25), flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text category='h5' style={styles.labelTotalTxt} >{I18n.t('mcf_sale_total')}</Text>
                                            <Text category='h5' style={styles.labelTotal} >₹ {calculateTotal(values.quantity, subcategoryPrice ? subcategoryPrice : rate)}</Text>
                                        </View>
                                    </View>
                                </Card>


                                <View style={{ marginTop: convertWidth(30), marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
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

export default AddMcfSaleView;
