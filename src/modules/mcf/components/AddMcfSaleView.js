import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { components, I18n, utils, constants } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import * as yup from 'yup';

const { Modal, Header, SafeAreaView, Input, Content, Card, Text, Button, Picker, Icon, Dropdown } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { ORGANIZATION_TYPE, VALIDATION_RULES } = constants;

const AddMcfSaleView = (props) => {
    const { saleItems = [], mcfAssociations: { associations = [] }, userInfo: { id, defaultOrganization: { name, id: organizationId } } } = props;
    const [vendorName, setVendorName] = useState('');
    const [vendorNameItem, setVendorNameItem] = useState('');
    const [errorText, setErrorText] = useState('');
    const [total, setTotal] = useState(0);
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const [itemData, setItemId] = useState();
    const showModal = (modal) => {
        toggleModalVisibility(modal);
    };
    const { Item } = Picker;
    const theme = useTheme();
    const isFocused = useIsFocused();
    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.getAssociations(ORGANIZATION_TYPE.SALE);
                    props.setSaleItemData([]);
                }
            }
        });
    }, []);

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
        labelHead: {
            color: theme['text-black-color'],
            fontSize: convertWidth(16),
            fontWeight: 'bold',
            marginBottom: convertWidth(13)
        },
        label1: {
            color: theme['text-black-color'],
            marginTop: convertWidth(12),
            fontSize: convertWidth(14)
        },
        buttonView: {
            alignSelf: 'stretch',
            justifyContent: 'flex-end',
            paddingHorizontal: convertWidth(13)
        },
        btnReshedule: {
            width: convertWidth(130),
            backgroundColor: theme['color-basic-600'],
            marginRight: convertWidth(100),
            borderWidth: 0
        },
        textStyleBtn: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(13),
            color: '#fff',
            fontWeight: 'bold'
        },
        iconStyle: {
            width: convertHeight(25),
            height: convertHeight(25),
            color: theme['color-basic-600']
        },
        errorText: {
            color: theme['color-danger-500'],
            marginTop: convertHeight(5),
        },
        floatingBtnStyle: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: convertWidth(8),
            right: convertWidth(14),
            height: convertHeight(37),
            borderRadius: convertWidth(20),
            borderWidth: 1,
            elevation: 5,
            borderColor: theme['color-basic-600'],
            backgroundColor: theme['color-basic-200']
        },
        item: {
            fontWeight: 'bold',
            fontSize: convertWidth(15),
            color: theme['text-black-color'],
            width: convertWidth(100)
        },
        labelAdd: {
            color: theme['color-basic-600'],
            fontSize: convertWidth(15),
        },
        circle: {
            width: convertHeight(25),
            height: convertHeight(25),
            borderRadius: convertWidth(25),
            borderWidth: 1,
            borderColor: theme['color-basic-600'],
            justifyContent: 'center', alignItems: 'center'
        },
        icon: {
            width: convertHeight(20),
            height: convertHeight(20),
        }
    });

    const calculateTotal = () => {
        let sum = 0;
        if (saleItems.length > 0) {
            sum = _.reduce(saleItems, function (sum, n) {
                return sum + n.total;
            }, 0);
        }
        setTotal(sum);
        return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const validationSchema = yup.object().shape({
        handedOverContact: yup
            .string().matches(VALIDATION_RULES.PHONE_REG_EXP, I18n.t('please_enter_valid_phone_number')),
        receivedByContact: yup
            .string().matches(VALIDATION_RULES.PHONE_REG_EXP, I18n.t('please_enter_valid_phone_number'))
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('mcf_sale')} />
            <Formik
                validationSchema={validationSchema}
                initialValues={{
                    remarks: '',
                    quantity: '', handedOverName: '', handedOverDesignation: '',
                    handedOverContact: '', receivedByName: '', receivedByDesignation: '', receivedByContact: ''
                }}
                onSubmit={(values, { resetForm }) => {
                    let data = {
                        organizationId: organizationId,
                        remarks: values.remarks,
                        transactedById: id,
                        handedOverByName: values.handedOverName,
                        receivedByName: values.receivedByName,
                        total: total,
                        vendorId: vendorName,
                        handedOverByDesignation: values.handedOverDesignation,
                        handedOverByMobile: values.handedOverContact,
                        receivedByDesignation: values.receivedByDesignation,
                        receivedByMobile: values.receivedByContact,
                        items: saleItems
                    };
                    props.addMcfSale(data);
                }}
            >
                {({ resetForm, handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        <Content>
                            <View style={styles.content} >
                                <Card shadow style={styles.card}>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_name')}</Text>}
                                                size='large'
                                                value={name}
                                                disabled
                                            />
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('mcf_sale_vender_name')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={vendorName}
                                                        selectedValue={vendorName}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setVendorName(itemValue);
                                                            setErrorText('');
                                                            if (itemValue !== 0) {
                                                                setVendorNameItem(associations.length > 0 ? associations[itemIndex - 1] : '');
                                                            }
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                ...associations?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                        {errorText !== '' &&
                                            <Text category='h5' style={styles.errorText}>{errorText}</Text>
                                        }
                                    </View>

                                    {
                                        saleItems !== undefined && saleItems.length > 0 && saleItems.map((item, index) => {
                                            return (
                                                <Card
                                                    key={index}
                                                    shadow style={{ marginTop: convertWidth(20), paddingVertical: convertWidth(15) }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: "flex-end" }}>
                                                        <TouchableOpacity onPress={() => props.navigateToAddItem({ vendorId: vendorName, item: item, title: 'mcf_sale' })} style={[styles.circle]}>
                                                            <Icon name='pencil-outline' pack="material-community" style={[styles.icon, { color: theme['color-basic-600'] }]} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => { setItemId(item); showModal(true) }} style={[styles.circle, { marginLeft: convertWidth(10) }]}>
                                                            <Icon name='delete-empty-outline' pack="material-community" style={[styles.icon, { color: theme['color-danger-500'], marginRight: convertWidth(0) }]} />
                                                        </TouchableOpacity>

                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text category='h5' style={styles.item} >{item.itemName}</Text>
                                                        <Text category='h5' style={[styles.item, { width: convertWidth(300) }]} >{item.quantityInKg}{I18n.t('kg')} * ₹{item.rate}/{I18n.t('gm')}</Text>
                                                    </View>
                                                    <Text category='h5' style={styles.item} >({item.itemSubCategoryName})</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: convertWidth(5) }}>
                                                        <Text category='h5' style={{ fontSize: convertWidth(15), color: theme['text-black-color'] }} >{item.itemTypeName}</Text>
                                                        <Text category='h5' style={{ fontSize: convertWidth(20), color: theme['text-black-color'] }} >₹ {item.total}</Text>
                                                    </View>
                                                </Card>
                                            );
                                        })
                                    }

                                    <View style={{ marginTop: convertHeight(25) }}>
                                        <View style={{ height: convertWidth(3), width: convertWidth(305), backgroundColor: theme['color-basic-300'] }} />
                                        <View style={{ marginVertical: convertWidth(25), flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text category='h5' style={styles.labelTotalTxt} >{I18n.t('mcf_sale_total')}</Text>
                                            <Text category='h5' style={styles.labelTotal} >₹ {calculateTotal()}</Text>
                                        </View>
                                    </View>
                                </Card>
                                <View style={{ marginTop: convertWidth(30) }}>
                                    <Text category='h5' style={styles.labelHead} >{I18n.t('mcf_sale_handed_over_by')}</Text>
                                    <Card shadow style={styles.card}>
                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_sale_name')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('handedOverName')}
                                                value={values.handedOverName}
                                                placeholder={I18n.t('type_here')}
                                            />
                                        </View>
                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_sale_designation')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('handedOverDesignation')}
                                                value={values.handedOverDesignation}
                                                multiline={true}
                                                placeholder={I18n.t('type_here')}
                                            />
                                        </View>
                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_sale_contact')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('handedOverContact')}
                                                value={values.handedOverContact}
                                                keyboardType='phone-pad'
                                                placeholder={I18n.t('type_here')}
                                                maxLength={10}
                                            />
                                            {errors.handedOverContact && <Text category='h5' style={styles.errorText}>{errors.handedOverContact}</Text>}
                                        </View>
                                    </Card>
                                </View>
                                <View style={{ marginTop: convertWidth(30) }}>
                                    <Text category='h5' style={styles.labelHead} >{I18n.t('mcf_sale_received_by')}</Text>
                                    <Card shadow style={styles.card}>
                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_sale_name')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('receivedByName')}
                                                value={values.receivedByName}
                                                placeholder={I18n.t('type_here')}
                                            />
                                        </View>

                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_sale_designation')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('receivedByDesignation')}
                                                value={values.receivedByDesignation}
                                                placeholder={I18n.t('type_here')}
                                            />
                                        </View>
                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_sale_contact')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('receivedByContact')}
                                                value={values.receivedByContact}
                                                keyboardType='phone-pad'
                                                placeholder={I18n.t('type_here')}
                                                maxLength={10}
                                            />
                                            {errors.receivedByContact && <Text category='h5' style={styles.errorText}>{errors.receivedByContact}</Text>}
                                        </View>

                                    </Card>
                                </View>
                                <View style={{ marginVertical: convertWidth(15), marginBottom: convertHeight(80) }}>
                                    <Card shadow style={styles.card}>
                                        <View style={{ marginVertical: convertHeight(10) }}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('mcf_stock_remarks')}</Text>}
                                                size='large'
                                                onChangeText={handleChange('remarks')}
                                                value={values.remarks}
                                                multiline={true}
                                                placeholder={I18n.t('type_here')}
                                            />
                                        </View>
                                    </Card>
                                </View>
                                <View style={{ bottom: convertWidth(55), marginTop: convertWidth(15), marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button
                                        appearance='outline'
                                        size='small'
                                        style={{ width: convertWidth(130) }}
                                        onPress={() => {
                                            resetForm({});
                                            props.setSaleItemData([]);
                                            if (saleItems.length === 0) {
                                                props.navigation.goBack();
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
                        </Content>
                    </>
                )}
            </Formik>
            <TouchableOpacity
                onPress={() => {
                    if (vendorName !== '') {
                        props.navigateToAddItem({ vendorId: vendorName, title: 'mcf_sale' });
                    } else {
                        setErrorText(I18n.t('select_atleast_one_item'));
                    }
                }}
                activeOpacity={0.8}
                style={[styles.floatingBtnStyle, {
                    alignItems: 'center',
                    flexDirection: 'row',
                    bottom: convertHeight(25),
                    width: convertWidth(165),
                    height: convertWidth(45),
                    borderColor: theme['color-basic-600'],
                }
                ]}>
                <View style={{
                    width: convertHeight(25),
                    height: convertHeight(25),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Icon name='plus' pack="material-community" style={[styles.iconStyle]} />
                </View>
                <Text category="h5" style={styles.labelAdd} >{I18n.t('add_item')}<Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
            </TouchableOpacity>
            <Modal visible={showModalVisibility}
                message={I18n.t('do_you_want_to_remove_item')}
                type='confirm'
                onCancel={() => showModal(false)}
                onOk={() => {
                    props.removeSaleItem(itemData);
                    showModal(false);
                }}
            />
        </SafeAreaView>
    );
}

export default AddMcfSaleView;
