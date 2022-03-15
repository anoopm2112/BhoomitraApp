import React, { useState, useEffect, useRef } from 'react';
import { ListItem } from '@ui-kitten/components';
import { StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { createAnimatableComponent } from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import { useNetInfo } from '@react-native-community/netinfo';
import _ from 'lodash';
import FieldSet from 'react-native-fieldset';
import { utils, components, I18n } from '../../../common';
import { PAYMENT_STATUS, COLLECTION_TYPE } from '../constants';
import { useTheme } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';

const { dimensionUtils: { convertWidth, convertHeight } } = utils;
const { SafeAreaView, Text, Header, Icon, Modal } = components;

const PaymentCollectionListView = (props) => {
    const [internetReachable, setInternetReachable] = useState(false);
    const [invoiceNumbers, setInvoiceNumbers] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const invoiceForDeletion = useRef({});
    const animationRefs = useRef({});
    const {
        queued, progress, processed, failed, icons,
        servicePayment: { collection: { configs } },
        populateAdvanceOutstandingPaymentData, setServicePaymentCollectionItem,
        navigateToPaymentCollection, generateServicePaymentCollectionData,
        resetServicePaymentCollectionData, unsetProcessed,
        loadServiceIcons, deleteInvoice, animationData
    } = props;
    const { initDone, items } = configs;
    const { data: { customerNumber, collectionTypeId } } = props.route.params;
    const itemsLength = Object.keys(items).length;
    const animation = 'bounceIn';

    const ArrowIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="chevron-right" pack="material-community" style={{ height: convertHeight(25), color: theme['color-basic-600'] }} />
    ));

    const AlertIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="alert-circle-outline" pack="material-community" style={{ height: convertHeight(28), color: theme['color-danger-500'] }} />
    ));

    const CheckBoxMarkedIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="checkbox-marked-circle" pack="material-community" style={{ height: convertHeight(28), color: theme['color-success-500'] }} />
    ));

    const DeleteHandler = React.forwardRef((props, ref) => (
        <TouchableOpacity onPress={() => {
            const { invoiceNumber } = props;
            invoiceForDeletion.current = { customerNumber, invoiceNumber, collectionTypeId };
            setShowConfirmModal(true);
        }}>
            <Icon ref={ref} name="delete-circle-outline" pack="material-community" style={[{ marginLeft: convertWidth(5), marginTop: convertHeight(6), height: convertHeight(22), color: theme['color-danger-600'] }]} />
        </TouchableOpacity>
    ));

    const AnimatedArrowIcon = createAnimatableComponent(ArrowIcon);
    const AnimatedAlertIcon = createAnimatableComponent(AlertIcon);
    const AnimatedCheckBoxMarkedIcon = createAnimatableComponent(CheckBoxMarkedIcon);

    const renderItem1 = ({ item, index }) => {
        const data = items[item] || [];
        return (
            <View style={{ marginTop: convertHeight(20), marginBottom: index === itemsLength - 1 ? convertHeight(20) : 0 }}>
                <FieldSet label={item}>
                    <FlatList
                        data={data}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => renderItem2(item)}
                        keyExtractor={(item) => item.invoiceNumber}
                        ListEmptyComponent={emptyList}
                    />
                </FieldSet>
            </View>
        )
    };

    const renderItem2 = ({ item, index }) => {
        const { invoicePaymentStatusId, invoiceNumber } = item;
        let status = 'danger';
        let statusText = I18n.t('unpaid');
        if (invoicePaymentStatusId === PAYMENT_STATUS.PARTIALLY_PAID) {
            status = 'warning';
            statusText = I18n.t('partially_paid');
        } else if (invoicePaymentStatusId === PAYMENT_STATUS.PAID) {
            status = 'success';
            statusText = I18n.t('paid');
        }
        return <ListItem
            disabled={
                internetReachable ?
                    (queued.includes(invoiceNumber) || progress.hasOwnProperty(invoiceNumber)) ?
                        true :
                        false :
                    false
            }
            style={styles.listRowView}
            onPress={() => {
                populateAdvanceOutstandingPaymentData(item);
                setServicePaymentCollectionItem(item);
                navigateToPaymentCollection();
            }}
            title={icons[item.summary.serviceConfigId] ? icons[item.summary.serviceConfigId]['name'] : ''}
            description={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text category='c1' status={status} style={[styles.statusText, { backgroundColor: theme['color-' + status + '-transparent-500'] }]}>{statusText}</Text>
                    {status === 'success' && !item.metadata.waitingForSync && <DeleteHandler invoiceNumber={item.invoiceNumber} />}
                </View>
            }
            accessoryRight={(props) => (
                <View style={{ flex: .20, alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' }}>{
                    internetReachable ?
                        queued.includes(invoiceNumber) ?
                            <MaterialIndicator size={convertHeight(25)} color={theme['color-basic-600']} /> :
                            progress.hasOwnProperty(invoiceNumber) ?
                                <Progress.Pie color={theme['color-basic-600']} progress={progress[invoiceNumber]} size={convertHeight(25)} /> :
                                processed.includes(invoiceNumber) ?
                                    <AnimatedCheckBoxMarkedIcon useNativeDriver animation={animationData ? animation : undefined} /> :
                                    failed.includes(invoiceNumber) ?
                                        <AnimatedAlertIcon useNativeDriver animation={animationData ? animation : undefined} /> :
                                        <AnimatedArrowIcon useNativeDriver onAnimationEnd={() => { animationRefs.current[invoiceNumber] = undefined }} animation={animationData ? animationRefs.current[invoiceNumber] : undefined} /> :
                        <ArrowIcon />
                }
                </View>
            )}
            accessoryLeft={() => {
                return icons[item.summary.serviceConfigId] ? <Image source={{ uri: `data:image/*;base64,${icons[item.summary.serviceConfigId]['icon']}` }} style={styles.leftIcon} /> :
                    <Icon name="image-off-outline" pack="material-community" style={[styles.leftIcon, { color: theme['color-basic-600'] }]} />
            }
            }
        />;
    };

    const emptyList = () => (
        <View style={styles.emptyList}>
            <Text category="h5">{I18n.t('no_data_available')}</Text>
        </View>
    );

    const netInfo = useNetInfo();
    const isFocused = useIsFocused();

    useEffect(() => {
        setInternetReachable(netInfo.isInternetReachable);
    }, [netInfo]);

    useEffect(() => {
        if (isFocused) {
            generateServicePaymentCollectionData({ customerNumber, collectionTypeId });
            loadServiceIcons();
        } else {
            resetServicePaymentCollectionData();
        }
    }, [isFocused]);

    useEffect(() => {
        _.forEach(invoiceNumbers, (invoiceNumber) => {
            if (progress.hasOwnProperty(invoiceNumber)) {
                animationRefs.current[invoiceNumber] = animation;
            }
        });
    }, [progress, invoiceNumbers]);

    useEffect(() => {
        const invoiceNumbers = Object.values(items).flat().map(item => item.invoiceNumber);
        setInvoiceNumbers(invoiceNumbers);
    }, [items]);

    useEffect(() => {
        _.forEach(invoiceNumbers, (invoiceNumber) => {
            if (processed.includes(invoiceNumber)) {
                setTimeout(() => {
                    unsetProcessed(invoiceNumber);
                }, 1000);
            }
        });
    }, [processed, invoiceNumbers]);

    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            maxHeight: convertHeight(300),
        },
        content: {
            alignSelf: 'stretch',
            padding: convertHeight(13),
            paddingTop: 0
        },
        leftIcon: {
            height: convertHeight(43),
            width: convertWidth(32),
            marginHorizontal: convertWidth(8)
        },
        rightIconStyle: {
            height: convertHeight(25),
            width: convertHeight(25),
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: convertWidth(7)
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: convertHeight(10)
        },
        listRowView: {
            marginTop: convertHeight(7),
            marginHorizontal: convertWidth(7),
            borderRadius: convertWidth(10),
            borderWidth: 2,
            borderColor: theme['border-basic-lite-color']
        },
        statusText: {
            borderRadius: 10,
            paddingHorizontal: convertWidth(15),
            paddingVertical: convertHeight(2),
            marginTop: convertHeight(5)
        }
    });

    return (
        <SafeAreaView>
            <Header title={collectionTypeId === COLLECTION_TYPE.COLLECTION ? I18n.t('payments_collection') : I18n.t('payments_subscription')} />
            {
                initDone ?
                    <FlatList
                        data={Object.keys(items)}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => renderItem1(item)}
                        keyExtractor={(item) => item}
                        ListEmptyComponent={emptyList}
                        style={styles.content}
                    />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: convertWidth(20) }}>
                            <View style={{ marginRight: convertWidth(8) }}>
                                <MaterialIndicator size={convertHeight(22)} color={theme['text-basic-color']} />
                            </View>
                            <Text style={{ flexShrink: 1 }} numberOfLines={2}>{I18n.t('please_wait')}</Text>
                        </View>
                    </View>
            }
            <Modal visible={showConfirmModal}
                type='confirm'
                message={I18n.t('confirm_delete_invoice')}
                okText={I18n.t('ok')}
                onOk={() => {
                    setShowConfirmModal(false);
                    deleteInvoice(invoiceForDeletion.current);
                    invoiceForDeletion.current = {};
                }}
                cancelText={I18n.t('cancel')}
                onCancel={() => {
                    setShowConfirmModal(false);
                    invoiceForDeletion.current = {};
                }}
            />
        </SafeAreaView>
    );
};

export default PaymentCollectionListView;
