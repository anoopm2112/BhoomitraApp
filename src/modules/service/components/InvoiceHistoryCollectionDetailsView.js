import React, { useState } from 'react';
import { StyleSheet, View, Platform, Image } from 'react-native';
import { components, I18n, utils, constants } from '../../../common';
import { useTheme, Modal as UIKittenModal } from '@ui-kitten/components';
import { Table, Row, Rows } from 'react-native-table-component';
import { INVOICE_INTERVAL, PAYMENT_STATUS } from '../constants';
import _ from 'lodash';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { window, dimensionUtils: { convertHeight, convertWidth }, dateUtils: { convertToLocalDate } } = utils;
const { SafeAreaView, Text, Card, Header, Icon, Button, Content } = components;
const { DATE_FORMAT } = constants;

const InvoiceHistoryCollectionDetailsView = (props) => {
    const { icons, route: { params: { data } } } = props;
    const invoiceNumberSections = data.invoiceNumber.split('-');
    const service = _.find(icons, function (o) { return o.id === data.summary.serviceConfigId; });
    const tableHead = [I18n.t('date'), I18n.t('amount'), I18n.t('advance'), I18n.t('balance')];
    const tableData = data.paymentHistory !== undefined && data.paymentHistory.map(entry => [
        moment(entry.transactedAt).format(DATE_FORMAT),
        '₹ ' + entry.amount,
        '₹ ' + entry.advance,
        '₹ ' + entry.balance
    ]);
    const tableModalWidth = window.width - 30;
    const [showPaymentHistory, setShowPaymentHistory] = useState(false);

    const theme = useTheme();

    const styles = StyleSheet.create({
        fullColonSpace: {
            paddingHorizontal: convertWidth(10)
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(14),
            marginLeft: convertWidth(10)
        },
        keyTextStyle: {
            width: convertWidth(125)
        },
        paymentHistoryText: {
            paddingLeft: convertWidth(10),
            paddingRight: convertWidth(2),
            height: convertHeight(20),
            color: theme['color-info-500']
        },
        backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        tableHead: {
            height: convertHeight(40),
            backgroundColor: '#f1f8ff'
        },
        viewContainer: {
            paddingBottom: convertHeight(10),
            borderBottomWidth: convertWidth(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: theme['border-basic-lite-color']
        },
        rowView: {
            flexDirection: 'row',
            marginTop: convertHeight(7)
        },
        tableText: {
            marginVertical: convertHeight(6),
            textAlign: 'center',
            fontFamily: 'Roboto-Regular',
            fontWeight: '400',
            fontSize: convertHeight(14)
        },
        tableModalView: {
            width: tableModalWidth,
            paddingHorizontal: convertWidth(10),
            paddingBottom: convertHeight(10)
        },
        serviceIcon: {
            width: convertWidth(50),
            height: convertWidth(50),
            borderRadius: convertWidth(50 / 2),
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
            margin: convertWidth(6)
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingTop: convertHeight(13),
        },
        secondViewContainer: {
            paddingVertical: convertWidth(8),
            borderBottomWidth: 0.8,
            borderColor: theme['border-basic-lite-color'],
            paddingBottom: convertWidth(15)
        },
        thirdViewContainer: {
            paddingVertical: convertWidth(8),
            paddingBottom: convertWidth(15)
        },
    });
    return (
        <SafeAreaView>
            <Header title={I18n.t('invoice_history')} />
            <Content>
                <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card]}>
                    <View style={{ marginBottom: convertWidth(10), paddingHorizontal: convertWidth(13) }}>
                        <View style={styles.viewContainer}>
                            <View style={{ justifyContent: 'center' }}>
                                {
                                    service != undefined && service.icon != undefined && service.icon != null ?
                                        <Image
                                            source={{ uri: `data:image/*;base64,${service.icon}` }}
                                            style={styles.serviceIcon} /> :
                                        <Icon name="image-off-outline" pack="material-community" style={[styles.serviceIcon, { color: theme['color-basic-600'] }]} />
                                }
                            </View>
                            <View style={{ justifyContent: 'center', width: convertWidth(250) }}>
                                <Text category='h5'
                                    style={{ flexShrink: 1, fontWeight: 'bold' }}
                                    numberOfLines={2}>
                                    {service ? service.name : ''}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>{data.customerNumber ? data.customerNumber : ''}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.secondViewContainer}>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('invoice_number')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {invoiceNumberSections[0]}-{invoiceNumberSections[1]}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('invoice_due_date')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.dueDate ? convertToLocalDate(data.dueDate) : ''}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('invoice_period')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.invoicePeriod ? data.invoicePeriod : ''}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('invoice_interval')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                {
                                    data.invoiceIntervalId &&
                                    <Text category='h5' style={styles.textStyle}>
                                        {
                                            INVOICE_INTERVAL.MONTHLY === data.invoiceIntervalId ?
                                                I18n.t('monthly') : I18n.t('date_wise')
                                        }
                                    </Text>
                                }
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('invoice_payment_status')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                {
                                    data.invoicePaymentStatusId &&
                                    <Text category='h5' style={styles.textStyle}>
                                        {
                                            PAYMENT_STATUS.UNPAID === data.invoicePaymentStatusId ?
                                                I18n.t('unpaid') :
                                                PAYMENT_STATUS.PARTIALLY_PAID === data.invoicePaymentStatusId ?
                                                    I18n.t('partially_paid') :
                                                    PAYMENT_STATUS.PAID === data.invoicePaymentStatusId ?
                                                        I18n.t('paid') : ''
                                        }
                                    </Text>
                                }
                            </View>
                        </View>

                        <View style={styles.thirdViewContainer}>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('total_payable')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.totalPayable ? '₹ ' + data.totalPayable : ''}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('net_payable')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.netPayable ? '₹ ' + data.netPayable : '₹ 0'}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('total_paid')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h4' style={styles.textStyle}>
                                    {data.totalPaid ? '₹ ' + data.totalPaid : ''}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('outstanding_after_invoice_generation')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.outstandingAfterInvoiceGeneration ? '₹ ' + data.outstandingAfterInvoiceGeneration : '₹ 0'}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('outstanding_after_last_payment')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.outstandingAfterLastPayment ? '₹ ' + data.outstandingAfterLastPayment : '₹ 0'}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('advance_after_invoice_generation')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.advanceAfterInvoiceGeneration ? '₹ ' + data.advanceAfterInvoiceGeneration : '₹ 0'}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('advance_after_last_payment')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {data.advanceAfterLastPayment ? '₹ ' + data.advanceAfterLastPayment : '₹ 0'}
                                </Text>
                            </View>
                        </View>
                        {
                            data.paymentHistory !== undefined && data.paymentHistory.length > 0 &&
                            <TouchableOpacity
                                onPress={() => setShowPaymentHistory(true)}
                                style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Icon name='history' pack="material-community" style={styles.paymentHistoryText} />
                                <Text category='h5' status='info' >{I18n.t('payment_history')}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {
                    <UIKittenModal visible={showPaymentHistory} backdropStyle={styles.backdrop}>
                        <Card style={styles.tableModalView}>
                            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                                <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableText} />
                                <Rows data={tableData} textStyle={styles.tableText} />
                            </Table>
                            <Button size='small' onPress={() => setShowPaymentHistory(false)} status={'primary'} style={{ alignSelf: 'center', marginTop: convertHeight(10), width: convertWidth(100) }}>
                                {I18n.t('close')}
                            </Button>
                        </Card>
                    </UIKittenModal>
                }
            </Content>
        </SafeAreaView>
    );
};

export default InvoiceHistoryCollectionDetailsView;
