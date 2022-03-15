import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Platform, TouchableOpacity, Image } from 'react-native';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from '@react-navigation/native';
import { View as AnimatedView } from 'react-native-animatable';
import { COLLECTION_TYPE } from '../constants';

const { dimensionUtils: { convertHeight, convertWidth }, dateUtils: { convertToLocalDate } } = utils;
const { SafeAreaView, Text, Icon } = components;

const PaymentHistoryListView = (props) => {
    const { animationData, icons, customerPaymentHistoryList: { data, refreshing } } = props;
    const { customerPaymentHistory: { customerPaymentHistoryInvoiceDetails } } = props;
    const service = _.find(icons, function (o) { return o.id === data.serviceConfigId; });

    const onEndReached = () => {
        props.getPaymentHistory({ invoiceNumber: customerPaymentHistoryInvoiceDetails.invoiceNumber, reset: false });
    };

    const onRefresh = () => {
        props.getPaymentHistory({ invoiceNumber: customerPaymentHistoryInvoiceDetails.invoiceNumber, reset: true });
    };

    const theme = useTheme();

    const styles = StyleSheet.create({
        mainContainer: {
            padding: convertWidth(7),
            flex: 1
        },
        viewContainer: {
            paddingBottom: convertHeight(10)
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
        card: {
            alignSelf: 'stretch',
            flex: 1,
            margin: convertWidth(6),
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingTop: convertHeight(13),
            padding: 10
        },
        serviceIcon: {
            width: convertWidth(50),
            height: convertWidth(50),
            borderRadius: convertWidth(50 / 2),
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: 10
        },
        rowView: {
            flexDirection: 'row',
            marginTop: convertHeight(7)
        },
        keyTextStyle: {
            width: convertWidth(125)
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(10)
        },
        textStyle: {
            flexWrap: 'wrap',
            textAlign: 'left',
            fontSize: convertWidth(14),
            marginLeft: convertWidth(10),
            width: convertHeight(150)
        },
    });


    const renderItem = ({ item }) => {
        const service = _.find(icons, function (o) { return o.id === item.serviceConfigId; });
        return (
            <AnimatedView
                key={item.id}
                useNativeDriver
                animation={animationData ? 'fadeInLeft' : undefined}
                duration={500}
            >
                {COLLECTION_TYPE.COLLECTION === item.collectionTypeId &&
                    <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card]}>
                        <TouchableOpacity>
                            <View style={styles.viewContainer}>
                                <View style={{ justifyContent: 'center' }}>
                                    {
                                        service !== undefined && service.icon ?
                                            <Image
                                                source={{ uri: `data:image/*;base64,${service.icon}` }}
                                                style={styles.serviceIcon} /> :
                                            <Icon name="image-off-outline" pack="material-community" style={[styles.serviceIcon, { color: theme['color-basic-600'] }]} />
                                    }
                                </View>
                                <View style={styles.rowView}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('net_payable')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.netPayable ? '₹ ' + item.netPayable : '₹ 0'}
                                    </Text>
                                </View>
                                <View style={styles.rowView}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('amount')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.amount ? '₹ ' + item.amount : '₹ 0'}
                                    </Text>
                                </View>
                                <View style={styles.rowView}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('advance')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.advance ? '₹ ' + item.advance : '₹ 0'}
                                    </Text>
                                </View>
                                <View style={styles.rowView}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('balance')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.balance ? '₹ ' + item.balance : '₹ 0'}
                                    </Text>
                                </View>
                                <View style={styles.secondViewContainer}>
                                    {
                                        item.paidBy !== undefined && item.paidBy !== null &&
                                        <View style={styles.rowView}>
                                            <View style={styles.keyTextStyle}>
                                                <Text category='h5'>{I18n.t('paid_by')}</Text>
                                            </View>
                                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                            <Text category='h5' style={styles.textStyle}>
                                                {item.paidBy.name ? item.paidBy.name : ''}
                                            </Text>
                                        </View>
                                    }
                                    {
                                        item.paymentType !== undefined && item.paymentType !== null &&
                                        <View style={styles.rowView}>
                                            <View style={styles.keyTextStyle}>
                                                <Text category='h5'>{I18n.t('payment_type')}</Text>
                                            </View>
                                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                            <Text category='h5' style={styles.textStyle}>
                                                {item.paymentType.name ? item.paymentType.name : ''}
                                            </Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </AnimatedView>
        );
    };

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> : <View />
    );

    return (
        <SafeAreaView>
            <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card]}>
                <View style={{ marginBottom: convertWidth(10), paddingHorizontal: convertWidth(13) }}>

                    <View style={styles.secondViewContainer}>
                        <View style={styles.rowView}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('customer_number')}</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {customerPaymentHistoryInvoiceDetails.customerNumber ? customerPaymentHistoryInvoiceDetails.customerNumber : ''}
                            </Text>
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('invoice_number')}</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {customerPaymentHistoryInvoiceDetails.invoiceNumber ? customerPaymentHistoryInvoiceDetails.invoiceNumber : ''}
                            </Text>
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('invoice_due_date')}</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {customerPaymentHistoryInvoiceDetails.dueDate ? convertToLocalDate(customerPaymentHistoryInvoiceDetails.dueDate) : ''}
                            </Text>
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('invoice_date')}</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {customerPaymentHistoryInvoiceDetails.invoiceDate ? convertToLocalDate(customerPaymentHistoryInvoiceDetails.invoiceDate) : ''}
                            </Text>
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('invoice_period')}</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {customerPaymentHistoryInvoiceDetails.invoicePeriod ? customerPaymentHistoryInvoiceDetails.invoicePeriod : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.secondViewContainer}>
                        {
                            customerPaymentHistoryInvoiceDetails.paidBy !== undefined && customerPaymentHistoryInvoiceDetails.paidBy !== null &&
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('paid_by')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {customerPaymentHistoryInvoiceDetails.paidBy.name ? customerPaymentHistoryInvoiceDetails.paidBy.name : ''}
                                </Text>
                            </View>
                        }
                        {
                            customerPaymentHistoryInvoiceDetails.paymentType !== undefined && customerPaymentHistoryInvoiceDetails.paymentType !== null &&
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('payment_type')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {customerPaymentHistoryInvoiceDetails.paymentType.name ? customerPaymentHistoryInvoiceDetails.paymentType.name : ''}
                                </Text>
                            </View>
                        }
                    </View>
                    <View style={styles.thirdViewContainer}>
                        <View style={styles.rowView}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('total_payable')}</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {customerPaymentHistoryInvoiceDetails.totalPayable ? '₹ ' + customerPaymentHistoryInvoiceDetails.totalPayable : '₹0'}
                            </Text>
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('total_paid')}</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {customerPaymentHistoryInvoiceDetails.totalPaid ? '₹ ' + customerPaymentHistoryInvoiceDetails.totalPaid : '₹0'}
                            </Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item) => item.id.toString()}
                    onRefresh={() => onRefresh()}
                    refreshing={refreshing}
                    ListEmptyComponent={emptyList}
                    onEndReached={() => onEndReached()}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => <View style={{ height: convertHeight(70) }} />}
                />
            </View>
        </SafeAreaView>
    );
};

export default PaymentHistoryListView;
