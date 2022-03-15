import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { components, I18n, utils, constants } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import * as yup from 'yup';

const { Modal, Header, SafeAreaView, Input, Content, Card, Text, Button, Picker, Dropdown, Icon } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { ORGANIZATION_TYPE } = constants;

const AddRrfStockInView = (props) => {
    const { stockInItems = [], mcfItemNames: { data = [] }, mcfAssociations: { associations = [] }, userInfo: { id } } = props;
    const { Item } = Picker;
    const theme = useTheme();
    const isFocused = useIsFocused();
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const [itemData, setItemId] = useState();
    const showModal = (modal) => {
        toggleModalVisibility(modal);
    };

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.setStockInItemData([]);
                    props.getMcfItemName();
                    props.getAssociations(ORGANIZATION_TYPE.STOCK_IN);
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
        labelHead: {
            color: theme['text-black-color'],
            fontSize: convertWidth(16),
            fontWeight: 'bold',
            marginBottom: convertWidth(13)
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
            fontSize: convertWidth(13),
            color: theme['text-black-color'],
            width: convertWidth(100)
        },
        iconStyle: {
            width: convertHeight(25),
            height: convertHeight(25),
            color: theme['color-basic-600']
        },
        errorText: {
            marginTop: convertHeight(4)
        },
        alertIcon: {
            width: convertWidth(10),
            height: convertHeight(10),
            marginRight: convertWidth(8),
            marginTop: convertHeight(8)
        },
        labelAdd: {
            color: theme['color-basic-600'],
            fontSize: convertWidth(15),
        },
        icon: {
            width: convertHeight(20),
            height: convertHeight(20),
        },
        circle: {
            width: convertHeight(25),
            height: convertHeight(25),
            borderRadius: convertWidth(25),
            borderWidth: 1,
            borderColor: theme['color-basic-600'],
            justifyContent: 'center', alignItems: 'center'
        }
    });

    const validationSchema = yup.object().shape({
        serviceProvider: yup
            .string()
            .required(I18n.t('this_field_is_required')),
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('rrf_stock_in')} />
            <Formik
                initialValues={{ serviceProvider: '', rrfStockRemarks: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    let data = {
                        remarks: values.rrfStockRemarks,
                        organizationServiceProviderId: values.serviceProvider,
                        transactedBy: id,
                        items: stockInItems
                    };
                    props.addRrfStockIn(data);
                }}
            >
                {({ resetForm, handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        <Content>
                            <View style={styles.content} >
                                <Card shadow style={styles.card}>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('mcf_service_provider')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        selectedValue={values.serviceProvider}
                                                        onValueChange={(itemValue) => {
                                                            setFieldValue('serviceProvider', itemValue);
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
                                                status={(errors.serviceProvider && touched.serviceProvider) ? 'danger' : 'basic'}
                                                caption={(errors.serviceProvider && touched.serviceProvider) ? <Text style={styles.errorText} category='c1' status='danger'>{errors.serviceProvider}</Text> : null}
                                                captionIcon={(errors.serviceProvider && touched.serviceProvider) ? <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> : null}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: convertHeight(15) }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('mcf_stock_remarks')}</Text>}
                                            size='large'
                                            onChangeText={handleChange('rrfStockRemarks')}
                                            value={values.rrfStockRemarks}
                                            multiline={true}
                                            placeholder={I18n.t('type_here')}
                                        />
                                    </View>
                                    {
                                        stockInItems !== undefined && stockInItems.length > 0 &&
                                        <Card
                                            shadow style={{
                                                marginTop: convertWidth(20),
                                                paddingVertical: convertWidth(15)
                                            }}>
                                            {stockInItems.map((item, index) => {
                                                return (
                                                    <View key={index} style={{ flexDirection: 'row', marginTop: convertWidth(8) }}>
                                                        <View>
                                                            <Text category='h5' style={styles.item} >{item.itemName}</Text>
                                                            {item.itemSubCategoryName && <Text category='h6' style={styles.item} >({item.itemSubCategoryName})</Text>}
                                                        </View>

                                                        <Text category='h5' style={{ paddingHorizontal: convertWidth(5) }} > : </Text>
                                                        <Text category='h5' style={styles.item}>{item.quantityInKg}{I18n.t('kg')}</Text>
                                                        <TouchableOpacity onPress={() => props.navigateToAddItemStockIn({ item: item, title: 'rrf_stock_in' })} style={[styles.circle]}>
                                                            <Icon name='pencil-outline' pack="material-community" style={[styles.icon, { color: theme['color-basic-600'] }]} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => { setItemId(item); showModal(true) }} style={[styles.circle, { marginLeft: convertWidth(10) }]}>
                                                            <Icon name='delete-empty-outline' pack="material-community" style={[styles.icon, { color: theme['color-danger-500'], marginRight: convertWidth(0) }]} />
                                                        </TouchableOpacity>

                                                    </View>
                                                )
                                            })
                                            }
                                        </Card>
                                    }
                                    <View style={{ height: convertHeight(100) }} />
                                    <View style={{ bottom: convertHeight(70), marginTop: convertWidth(1), marginBottom: convertWidth(10), flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Button
                                            appearance='outline'
                                            size='small'
                                            style={{ width: convertWidth(130) }}
                                            onPress={() => {
                                                resetForm({});
                                                props.setStockInItemData([]);
                                                if (stockInItems.length === 0) {
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
                                </Card>
                            </View>
                        </Content>
                    </>
                )}
            </Formik>
            <TouchableOpacity
                onPress={() => { props.navigateToAddItemStockIn({ title: 'rrf_stock_in' }); }}
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
                    props.removeItem(itemData);
                    showModal(false);
                }}
            />
        </SafeAreaView>
    );
}

export default AddRrfStockInView;
