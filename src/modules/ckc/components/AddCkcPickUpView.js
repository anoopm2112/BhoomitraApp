import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { components, I18n, utils, constants } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import * as yup from 'yup';
import moment from 'moment';
import _ from 'lodash';

const { Modal, Header, SafeAreaView, Input, Content, Card, Text, Button, Picker, CalenderPicker, Dropdown, Icon } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { ORGANIZATION_TYPE, VALIDATION_RULES } = constants;

const AddCkcPickUpView = (props) => {
    const { stockInItems = [], goDownsName: { goDowns = [] }, mcfRrfName: { mcfRrf = [] }, lsgiName: { name = [] }, lsgiType: { type = [] },
        userInfo: { id, defaultOrganization, organizations = [] } } = props;
    const [lsgiType, setLsgiType] = useState('');
    const [lsgiName, setLsgiName] = useState('');
    const [mcfRrfName, setMcfRrf] = useState('');
    const [goDown, setGoDown] = useState('');
    const [district, setDistrict] = useState('');
    const [districtId, setDistrictId] = useState('');
    const { language: { locale = {} } } = props;
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const [itemData, setItemId] = useState();
    const showModal = (modal) => {
        toggleModalVisibility(modal);
    };
    const now = new Date();
    const { Item } = Picker;
    const theme = useTheme();
    const isFocused = useIsFocused();

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    let dis = _.find(organizations, function (o) { return o.id === defaultOrganization.id; });
                    if (dis) {
                        let name = '';
                        let districtId = '';
                        if (dis.district !== undefined) {
                            name = dis.district.name;
                            districtId = dis.district.id;
                        }
                        setDistrict(name);
                        setDistrictId(districtId);
                        props.getGoDown(districtId);
                    }
                    props.setStockInItemData([]);
                    props.getCkcLsgiType();
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
        iconStyle: {
            width: convertHeight(25),
            height: convertHeight(25),
            color: theme['color-basic-600']
        },
        errorText: {
            color: theme['color-danger-500']
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
            color: theme['text-black-color'],
            width: convertWidth(100)
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

    const [date, setDate] = useState(now);
    const [dateString, setDateString] = useState(now);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const showDatePicker = (visible) => {
        setDatePickerVisibility(visible);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const incidentReportValidationSchema = yup.object().shape({
        handedOverContact: yup
            .string().matches(VALIDATION_RULES.PHONE_REG_EXP, I18n.t('please_enter_valid_phone_number')),
        receivedByContact: yup
            .string().matches(VALIDATION_RULES.PHONE_REG_EXP, I18n.t('please_enter_valid_phone_number'))
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('pick_up_head')} />
            <Formik
                validationSchema={incidentReportValidationSchema}
                initialValues={{
                    district: '', vehicleNumber: '',
                    quantity: '', handedOverName: '', handedOverDesignation: '',
                    handedOverContact: '', receivedByName: '', receivedByDesignation: '', receivedByContact: ''
                }}
                onSubmit={(values, { resetForm }) => {
                    let data = {
                        remarks: values.remarks,
                        transactedById: id,
                        handedOverByName: values.handedOverName,
                        receivedByName: values.receivedByName,
                        pickupVehicleNumber: values.vehicleNumber,
                        lsgiId: lsgiName,
                        lsgiTypeId: lsgiType,
                        mcfOrRrfId: mcfRrfName,
                        handedOverByDesignation: values.handedOverDesignation,
                        handedOverByMobile: values.handedOverContact,
                        receivedByDesignation: values.receivedByDesignation,
                        receivedByMobile: values.receivedByContact,
                        districtId: districtId,
                        godownId: goDown,
                        pickupDate: moment(dateString).format(),
                        items: stockInItems
                    };
                    props.savePickUp(data);
                }}
            >
                {({ resetForm, handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        <Content>
                            <View style={styles.content} >
                                <Card shadow style={styles.card}>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Text category='h5' style={styles.label}>{I18n.t('date')}</Text>
                                            <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                                <Input
                                                    style={{ width: convertWidth(260) }}
                                                    size='large'
                                                    disabled={true}
                                                    onChangeText={handleChange('newSheduleDate')}
                                                    value={date ? moment(date).format("DD/MM/YYYY") : I18n.t('date')}
                                                />
                                                <TouchableOpacity style={{ paddingLeft: 5 }} onPress={() => showDatePicker(true)}>
                                                    <Icon name='calendar-month' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(10) }]} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: convertHeight(15) }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('district')}</Text>}
                                            onChangeText={handleChange('district')}
                                            value={district}
                                            disabled
                                        />
                                    </View>

                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('lsgi_type')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={lsgiType}
                                                        selectedValue={lsgiType}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setLsgiType(itemValue);
                                                            setLsgiName('');
                                                            setMcfRrf('');
                                                            props.resetMcfRrfName();
                                                            props.resetLsgiName();
                                                            if (itemValue) {
                                                                props.getCkcLsgiName({ itemValue, districtId });
                                                            }
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                ...type?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('lsgi_name')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={lsgiName}
                                                        selectedValue={lsgiName}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setLsgiName(itemValue);
                                                            setMcfRrf('');
                                                            if (itemValue) {
                                                                props.getMcfRrfName(itemValue);
                                                            }
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                ...name?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('mcf_rrf_name')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={mcfRrfName}
                                                        selectedValue={mcfRrfName}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setMcfRrf(itemValue);
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                ...mcfRrf?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={{ marginTop: convertHeight(15) }}>
                                        <Input
                                            label={<Text category='h5' style={styles.label} >{I18n.t('vehicle_name')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>}
                                            size='large'
                                            onChangeText={handleChange('vehicleNumber')}
                                            value={values.vehicleNumber}
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
                                                            {item.itemSubCategoryName && <Text category='h5' style={styles.item} >{item.itemSubCategoryName}</Text>}
                                                            {item.itemTypeName && <Text category='h5' style={styles.item} >({item.itemTypeName})</Text>}
                                                        </View>
                                                        <Text category='h5' style={{ paddingHorizontal: convertWidth(5) }} > : </Text>
                                                        <Text category='h5' style={styles.item}>{item.quantityInKg}{I18n.t('kg')}</Text>
                                                        <TouchableOpacity onPress={() => props.navigateToAddItemCkcPickUp({ item: item, title: 'pick_up_head' })} style={[styles.circle]}>
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
                                    <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15), marginBottom: convertWidth(22) }}>
                                        <Text category='h5' style={styles.label}>{I18n.t('godown')} <Text style={{ color: theme['color-danger-300'] }}>*</Text></Text>
                                        <View style={{ marginTop: convertHeight(8) }}>
                                            <Dropdown
                                                picker={
                                                    <Picker
                                                        key={goDown}
                                                        selectedValue={goDown}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                            setGoDown(itemValue);
                                                        }}
                                                        mode="dropdown">
                                                        {
                                                            [
                                                                <Picker.Item key={0} label={I18n.t('select_mcf')} value={0} />,
                                                                ...goDowns?.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                            ]
                                                        }
                                                    </Picker>
                                                }
                                            />
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
                                                maxLength={10}
                                                placeholder={I18n.t('type_here')}
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
                                <View style={{ bottom: convertHeight(70), marginTop: convertWidth(15), marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
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
                                <CalenderPicker visible={isDatePickerVisible}
                                    maxDate={now}
                                    onCancel={() => hideDatePicker(false)}
                                    locale={locale}
                                    onDaySelect={(response) => {
                                        setDate(response.timestamp);
                                        setDateString(response.dateString);
                                        hideDatePicker(false);
                                    }}
                                />
                            </View>
                        </Content>
                    </>
                )}
            </Formik>
            <TouchableOpacity
                onPress={() => {
                    props.navigateToAddItemCkcPickUp({ title: 'pick_up_head' });
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
                    props.removeItem(itemData);
                    showModal(false);
                }}
            />
        </SafeAreaView>
    );
}

export default AddCkcPickUpView;
