import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { components, I18n, utils, } from '../../../common';
import { Formik } from 'formik';
import { useTheme } from '@ui-kitten/components';
import moment from 'moment';
import _ from 'lodash';

const { Header, SafeAreaView, useStyleSheet, Input, Content, StyleService, Card, Text, Modal, Icon, Button, Picker, CalenderPicker, Dropdown } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const ServiceNewRequestView = (props) => {
    const { route: { params: { data: { payload: { data: specialServiceRequestId } } } = {} } = {} } = props;
    const { specialService: { specialService } = {} } = props;
    const { updatedData: { ospscId, comment: updatedComment, requestedDate } = {} } = props;
    const { language: { locale = {} } } = props;

    const now = new Date();
    const tomorrow = new Date(now);
    const minDate = new Date(now);

    minDate.setDate(minDate.getDate() + 1);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setDate(tomorrow.getDate() + 30);


    const [selectedService, setSelectedService] = useState(specialServiceRequestId != undefined ? ospscId : '');
    const [newSheduleDate, setNewShelueDate] = useState(specialServiceRequestId != undefined ? requestedDate.split('T')[0] : '');
    const [newRequestedDate, setNewRequestedDate] = useState(specialServiceRequestId != undefined ? requestedDate : '');

    const [comment, setComment] = useState();
    const [selectedServiceItem, setSelectedServiceItem] = useState(selectedServiceItemUpdated);
    const [showModalVisibility, toggleModalVisibility] = useState(false)

    const showModal = (modal) => {
        toggleModalVisibility(modal)
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = (visible) => {
        setDatePickerVisibility(visible);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // const styles = useStyleSheet(themedStyles);
    let selectedServiceItemUpdated = '';

    useEffect(() => {
        selectedServiceItemUpdated = _.find(specialService, function (o) { return o.id == ospscId; });
        setSelectedServiceItem(selectedServiceItemUpdated);
    }, []);

    const { Item } = Picker;
    const theme = useTheme();

    const styles = StyleSheet.create({
        content: {
            paddingHorizontal: convertWidth(13),
            paddingVertical: convertHeight(16),
            justifyContent: 'space-around',
            backgroundColor: theme['color-basic-200']
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
            width: convertHeight(50),
            height: convertHeight(50),
            marginRight: convertWidth(5),
            color: theme['color-basic-600']
        },
    });

    return (

        <Formik
            initialValues={{ comment: specialServiceRequestId != undefined ? updatedComment : '', selectedService: ospscId, newSheduleDate: requestedDate }}
            onSubmit={values => {
                let data = {
                    comment: values.comment,
                    selectedService: selectedServiceItem,
                    newSheduleDate: newSheduleDate,
                    specialServiceRequestId: specialServiceRequestId,
                    newRequestedDate: newRequestedDate
                };
                props.updateServiceRequest(data);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                    <SafeAreaView>
                        <Header title={I18n.t('new_special_service')} />
                        <View style={styles.content} >
                            <Card shadow style={styles.card}>
                                <Text category='h5' style={styles.labelHead}>{I18n.t('new_special_service_request')}</Text>
                                <View style={{ justifyContent: 'space-between' }}>
                                    <Text category='h5' style={styles.label1}>{I18n.t('special_service')}</Text>
                                    <View style={{ marginTop: convertHeight(8) }}>
                                        <Dropdown
                                            picker={
                                                <Picker
                                                    numberOfLines={2}
                                                    key={selectedService}
                                                    selectedValue={selectedService}
                                                    onValueChange={(itemValue, itemIndex) => {
                                                        setSelectedService(itemValue);
                                                        setSelectedServiceItem(specialService[itemIndex - 1]);
                                                        setFieldValue('selectedService', ospscId);
                                                    }}
                                                    mode="dropdown">
                                                    {
                                                        [
                                                            <Picker.Item key={0} label={I18n.t('select_special')} value="select" />,
                                                            ...specialService.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                                                        ]
                                                    }
                                                </Picker>
                                            }
                                        />
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'space-between', marginTop: convertHeight(15) }}>
                                    <Text category='h5' style={styles.label}>{I18n.t('select_special_service_date')}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                        <Input
                                            style={{ width: convertWidth(260) }}
                                            size='large'
                                            disabled={true}
                                            onChangeText={handleChange('newSheduleDate')}
                                            value={newSheduleDate ? moment(newSheduleDate).format("DD/MM/YYYY") : I18n.t('choose_servie_date')}
                                        />
                                        <TouchableOpacity style={{ paddingLeft: 5 }} onPress={() => showDatePicker(true)}>
                                            <Icon name='calendar-month' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(10) }]} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ marginVertical: convertHeight(15) }}>
                                    <Input
                                        label={<Text category='h5' style={styles.label} >{I18n.t('comment')}</Text>}
                                        size='large'
                                        onChangeText={handleChange('comment')}
                                        value={values.comment}
                                        multiline={true}
                                        status={(errors.firstName && touched.firstName) ? 'danger' : 'basic'}
                                    />
                                </View>
                                <View style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button
                                        appearance='outline'
                                        size='small'
                                        style={{ width: convertWidth(130) }}
                                        onPress={props.fetchServices}
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
                            <Modal visible={showModalVisibility}
                                message={I18n.t('do_you_want_to_cancel_the_schedule')}
                                type='confirm'
                                onCancel={() => showModal(false)}
                                onOk={() => showModal(false)}
                            />
                            <CalenderPicker visible={isDatePickerVisible}
                                minDate={minDate}
                                maxDate={tomorrow}
                                onCancel={() => hideDatePicker(false)}
                                locale={locale}
                                onDaySelect={(response) => {
                                    setNewRequestedDate(response.timestamp);
                                    setNewShelueDate(response.dateString);
                                    hideDatePicker(false);
                                }}
                            />
                        </View>
                    </SafeAreaView>
                </>
            )}
        </Formik>
    );
}

export default ServiceNewRequestView;
