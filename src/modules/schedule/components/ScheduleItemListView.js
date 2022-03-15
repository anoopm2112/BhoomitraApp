import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Platform } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Text, Modal, Button, Header, CalenderPicker } = components;

const ScheduleItemListView = (props) => {
    const { animationData, scheduleList: { schedules: { data, refreshing } } = {} } = props;
    const { language: { locale = {} } } = props;

    const isFocused = useIsFocused();

    const [newSheduleDate, setNewShelueDate] = useState();
    const [sheduleItem, setShelueItem] = useState();
    const [markedDates, setMarkedDates] = useState();
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const [showModalVisibilityConfirmationModal, toggleModalVisibilityConfirmationModal] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const now = new Date();
    const tomorrow = new Date(now);
    const minDate = new Date(now);

    minDate.setDate(minDate.getDate() + 1);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setDate(tomorrow.getDate() + 30);

    const showModal = (modal) => {
        toggleModalVisibility(modal)
    };

    const showDatePicker = (visible, item) => {
        let markedDates = {};
        const disabledDates = item.disabledDates;
        disabledDates !== null && disabledDates.forEach(disabledDate => {
            if (disabledDate) {
                let disDate = disabledDate.split('T');
                markedDates[disDate[0]] = { disabled: true, disableTouchEvent: true };
            }
        });
        setShelueItem(item);
        let nextExecutionDate = item.nextExecutionDate.split('T');
        let successiveNextExecutionDate = item.nextExecutionDate.split('T');
        markedDates[nextExecutionDate[0]] = { disabled: true, disableTouchEvent: true };
        markedDates[successiveNextExecutionDate[0]] = { disabled: true, disableTouchEvent: true };
        setMarkedDates(markedDates);
        setDatePickerVisibility(visible);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false)
    };

    const reschedule = () => {
        let schedule = {
            scheduleId: sheduleItem.scheduleId,
            date: newSheduleDate
        };
        props.reschedule(schedule);
    };

    const getStatusColor = (id) => {
        if (id === 2) {
            // ServiceScheduled
            return theme['color-info-500'];
        }
        if (id === 3) {
            // ServiceRescheduled
            return theme['color-success-500'];
        }
        if (id === 4) {
            // ServiceCancelled
            return theme['text-placeholder-color'];
        }
        // ServiceSkipped
        return theme['color-warning-500'];
    }

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.fetchSchedules();
                }
            }
        });
    }, [isFocused]);

    const renderItem = ({ item }) => {
        return (
            <AnimatedView key={item.id} useNativeDriver animation={animationData ? 'fadeInLeft' : undefined} duration={500}>
                <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card, { borderColor: getStatusColor(item.status.id) }]}>
                    <View style={{ paddingHorizontal: convertWidth(13), borderBottomWidth: 0.5, borderColor: theme['border-basic-lite-color'] }}>
                        <View style={styles.secondViewContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {
                                    _.has(item, 'status') &&
                                    <View style={{ borderWidth: 2, borderColor: getStatusColor(item.status.id), borderRadius: 3, paddingHorizontal: convertWidth(10) }}>
                                        <Text category='h5' style={{ color: getStatusColor(item.status.id), fontStyle: 'italic', fontWeight: 'bold', padding: 3 }}>
                                            {item.status.name}
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ borderBottomWidth: 1, borderColor: theme['border-basic-lite-color'], marginVertical: 10 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('schedule_id')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.scheduleId}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('schedule_service_provider')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceProvider') ? item.serviceProvider.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('schedule_service_residence_category')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'residenceCategory') ? item.residenceCategory.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('schedule_service_config')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceConfig') ? item.serviceConfig.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('schedule_next_executionDate')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                {
                                    item.nextExecutionDate !== null &&
                                    <Text category='h5' style={styles.textStyle}>
                                        {moment(item.nextExecutionDate).format("DD/MM/YYYY")} ({moment(item.nextExecutionDate).format('dddd')})
                                </Text>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('schedule_service_interval')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceInterval') ? item.serviceInterval.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('schedule_gt_name')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'gtName') ? item.gtName.name : ''}
                                </Text>
                            </View>
                        </View>
                        <View style={{ paddingBottom: convertWidth(10) }}>
                            <View style={styles.btnView}>
                                {
                                    _.has(item, 'enableSkip') && item.enableSkip &&
                                    <Button appearance='outline' size='small' status="danger" style={styles.btnCancel}
                                        onPress={() => { setShelueItem(item); showModal(true) }}
                                    >
                                        <Text category='h5' style={styles.textStyleBtn}>{I18n.t('schedule_skip')}</Text>
                                    </Button>
                                }
                                {
                                    _.has(item, 'enableCancel') && item.enableCancel &&
                                    <Button appearance='outline' size='small' status="danger" style={styles.btnCancel}
                                        onPress={() => { setShelueItem(item); showModal(true) }}
                                    >
                                        <Text category='h5' style={styles.textStyleBtn}>{I18n.t('cancel')}</Text>
                                    </Button>
                                }
                                {
                                    _.has(item, 'enableReschedule') && item.enableReschedule &&
                                    <Button appearance='filled' size='small' status="primary" style={styles.btnReshedule}
                                        onPress={() => showDatePicker(true, item)}
                                    >
                                        <Text category='h5' style={styles.textStyleBtnRe}>{I18n.t('reschedule')}</Text>
                                    </Button>
                                }
                            </View>
                        </View>
                        {/* <View style={{ paddingBottom: convertWidth(10) }}>
                            {
                                _.has(item, 'enableSkipOrCancel') && item.enableSkipOrCancel &&
                                <View style={styles.btnView}>
                                    <Button appearance='outline' size='small' status="danger" style={styles.btnCancel}
                                        onPress={() => { setShelueItem(item); showModal(true) }}
                                    >
                                        {
                                            item.enableReschedule ?
                                                <Text category='h5' style={styles.textStyleBtn}>{I18n.t('schedule_skip')}</Text> :
                                                <Text category='h5' style={styles.textStyleBtn}>{I18n.t('cancel')}</Text>
                                        }
                                    </Button>
                                    {
                                        _.has(item, 'enableReschedule') && item.enableReschedule &&
                                        <Button appearance='filled' size='small' status="primary" style={styles.btnReshedule}
                                            onPress={() => showDatePicker(true, item)}
                                        >
                                            <Text category='h5' style={styles.textStyleBtnRe}>{I18n.t('reschedule')}</Text>
                                        </Button>
                                    }
                                </View>
                            }
                        </View> */}
                    </View>
                </View>
            </AnimatedView>
        );
    }

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> : <View />
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            alignSelf: 'stretch',
            flex: 1,
            margin: convertWidth(6)
        },
        mainContainer: {
            padding: 7,
            flex: 1
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: 10
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(14)
        },
        textStyleBtn: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(13),
            color: theme['color-basic-600'],
            fontWeight: 'bold'
        },
        textStyleBtnRe: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(13),
            color: '#fff',
            fontWeight: 'bold'
        },
        btnCancel: {
            width: convertWidth(130),
            borderColor: theme['color-basic-600']
        },
        btnReshedule: {
            width: convertWidth(130),
            backgroundColor: theme['color-basic-600'],
            borderWidth: 0
        },
        btnView: {
            paddingTop: convertWidth(10),
            justifyContent: 'space-between',
            flexDirection: 'row'
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingTop: convertHeight(13),
            borderLeftWidth: convertWidth(7),
        },
        iOSShadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
        },
        androidShadow: {
            elevation: 3,
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        keyTextStyle: {
            width: convertWidth(125)
        }
    });


    return (
        <SafeAreaView>
            <Header title={I18n.t('customer_schedules')} />
            <View
                style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={() => props.fetchSchedules()}
                    refreshing={refreshing}
                    ListEmptyComponent={emptyList}
                />
            </View>

            <Modal visible={showModalVisibility}
                message={I18n.t('do_you_want_to_cancel_the_schedule')}
                type='confirm'
                onCancel={() => showModal(false)}
                onOk={() => {
                    showModal(false);
                    props.deleteSchedule(sheduleItem.scheduleId);
                }
                }
            />

            <CalenderPicker visible={isDatePickerVisible}
                current={Date()}
                minDate={minDate}
                maxDate={tomorrow}
                markedDates={markedDates}
                onCancel={() => hideDatePicker(false)}
                locale={locale}
                onDaySelect={(response) => {
                    setNewShelueDate(response);
                    toggleModalVisibilityConfirmationModal(true)
                }}
            />

            <Modal visible={showModalVisibilityConfirmationModal}
                message={I18n.t('do_you_want_to_reschedule')}
                type='confirm'
                onCancel={() => toggleModalVisibilityConfirmationModal(false)}
                onOk={() => {
                    toggleModalVisibilityConfirmationModal(false);
                    hideDatePicker(false);
                    reschedule()
                }
                }
            />
        </SafeAreaView>
    );
};

export default ScheduleItemListView;
