import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { Formik } from 'formik';
import moment from 'moment';
import { useTheme, Modal as UIKittenModal } from '@ui-kitten/components';
import { Table, Row, Rows } from 'react-native-table-component';
import * as yup from 'yup';
import _ from 'lodash';
import { RATE_TYPE, PAYMENT_MODE, PAYMENT_STATUS, COLLECTION_TYPE } from '../constants';
import { components, I18n, utils, constants } from '../../../common';

const { SafeAreaView, Content, Icon, Text, Button, useStyleSheet, StyleService, Input, Header, Card, Modal, Radio } = components;
const { dimensionUtils: { convertHeight, convertWidth }, window } = utils;
const { DATE_FORMAT } = constants;
const tableModalWidth = window.width - 30;

const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

const PaymentCollectionView = (props) => {
    const paymentCollectionValidationSchema = yup.object().shape({
        amount: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .required(I18n.t('enter_amount'))
            .min(0, I18n.t('amount_positive_number')),
        extraAmount: yup
            .number()
            .transform(value => (isNaN(value) ? undefined : value))
            .nullable(true)
            .min(0, I18n.t('amount_positive_number'))
    });
    const [showPaymentHistory, setShowPaymentHistory] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const styles = useStyleSheet(themedStyles);
    const amountInputRef = useRef();
    const { servicePayment: { syncingInvoices, payment: { specialService, advance }, paymentInProgress, collection: { item } } } = props;
    const {
        invoicePaymentStatusId, invoiceNumber, invoiceDate,
        totalPayable, netPayable, totalPaid,
        summary: { rateTypeId, fixedAmount, slabs, perUnitAmount, collectionTypeId },
        paymentHistory,
        metadata: { quantity }
    } = item;
    let tableHead, tableData;
    if (specialService) {
        tableHead = [I18n.t('date'), I18n.t('amount'), I18n.t('balance')];
        tableData = paymentHistory.map(entry => [
            moment(entry.transactedAt).format(DATE_FORMAT),
            '₹ ' + entry.amount,
            '₹ ' + entry.balance
        ]);
    } else {
        tableHead = [I18n.t('date'), I18n.t('amount'), I18n.t('advance'), I18n.t('balance')];
        tableData = paymentHistory.map(entry => [
            moment(entry.transactedAt).format(DATE_FORMAT),
            '₹ ' + entry.amount,
            '₹ ' + entry.advance,
            '₹ ' + entry.balance
        ]);
    }
    const invoiceNumberSections = invoiceNumber.split('-');
    const statusColor = invoicePaymentStatusId === PAYMENT_STATUS.UNPAID ? 'danger' :
        invoicePaymentStatusId === PAYMENT_STATUS.PARTIALLY_PAID ? 'warning' :
            'success';
    const statusLabel = statusColor === 'danger' ? I18n.t('unpaid') :
        statusColor === 'warning' ? I18n.t('partially_paid') :
            I18n.t('paid');
    let rateType, tariffLabel, tariff;
    switch (rateTypeId) {
        case RATE_TYPE.FIXED_RATE:
            rateType = I18n.t('fixed_rate');
            tariffLabel = I18n.t('fixed_amount');
            tariff = fixedAmount;
            break;
        case RATE_TYPE.SLAB_RATE:
            rateType = I18n.t('slab_rate');
            tariffLabel = I18n.t('price_per_unit');
            const slab = _.find(slabs, (slab) => {
                return slab.startVal <= quantity && quantity <= slab.endVal;
            });
            if (slab) {
                tariff = slab.pricePerUnit;
            } else {
                tariff = 0;
            }
            break;
        case RATE_TYPE.PER_UNIT_RATE:
            rateType = I18n.t('per_unit_rate');
            tariffLabel = I18n.t('per_unit_amount');
            tariff = perUnitAmount;
            break;
    }
    const paymentModeOptions = [
        {
            id: PAYMENT_MODE.ONLINE,
            text: 'online',
            disabled: true
        },
        {
            id: PAYMENT_MODE.OFFLINE,
            text: 'offline',
            disabled: false
        }
    ];

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );
        return () => {
            // Anything in here is fired on component unmount.
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        }
    }, []);

    const theme = useTheme();

    if (paymentInProgress) {
        return (
            <Content style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: convertWidth(20) }}>
                    <View style={{ marginRight: convertWidth(8) }}>
                        <MaterialIndicator size={convertHeight(22)} color={theme['text-basic-color']} />
                    </View>
                    <Text style={{ flexShrink: 1 }} numberOfLines={2}>{I18n.t('payment_in_progress')}</Text>
                </View>
            </Content>
        );
    }

    return (
        <Formik
            validationSchema={paymentCollectionValidationSchema}
            initialValues={{
                amount: specialService ? netPayable.toString() : '',
                extraAmount: '',
                paymentMode: PAYMENT_MODE.OFFLINE
            }}
            onSubmit={() => {
                setShowConfirmModal(true);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <>
                    <SafeAreaView>
                        <Header title={collectionTypeId === COLLECTION_TYPE.COLLECTION ? I18n.t('payments_collection') : I18n.t('payments_subscription')} />
                        <Content style={styles.content} >
                            <Card shadow style={styles.card}>
                                <View style={styles.textView}>
                                    <Text category='h5' style={styles.textLabel} >{I18n.t('status')}:</Text>
                                    <Text category='h5' status={statusColor} >{statusLabel}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text category='h5' style={styles.textLabel} >{I18n.t('invoice_number')}:</Text>
                                    <Text category='h5' style={styles.label} numberOfLines={1} >{invoiceNumberSections[0]}-{invoiceNumberSections[1]}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text category='h5' style={styles.textLabel} >{I18n.t('invoice_date')}:</Text>
                                    <Text category='h5' style={styles.label} >{moment(invoiceDate).format(DATE_FORMAT)}</Text>
                                </View>
                                {
                                    collectionTypeId === COLLECTION_TYPE.COLLECTION &&
                                    <View style={styles.textView}>
                                        <Text category='h5' style={styles.textLabel} >{I18n.t('special_service')}:</Text>
                                        <Text category='h5' style={styles.label} >{specialService ? I18n.t('yes') : I18n.t('no')}</Text>
                                    </View>
                                }
                                <View style={styles.textView}>
                                    <Text category='h5' style={styles.textLabel} >{I18n.t('rate_type')}:</Text>
                                    <Text category='h5' style={styles.label} >{rateType}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text category='h5' style={styles.textLabel} >{tariffLabel}:</Text>
                                    <Text category='h5' style={styles.label} >{'₹ ' + tariff}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text category='h5' style={styles.textLabel} >{I18n.t('waste_quantity')}:</Text>
                                    <Text category='h5' style={styles.label} >{quantity}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text category='h5' style={styles.textLabel} >{I18n.t('total_payable')}:</Text>
                                    <Text category='h5' style={styles.label} >{'₹ ' + totalPayable}</Text>
                                </View>
                                <View style={[styles.textView, { paddingBottom: statusColor === 'success' ? convertHeight(13) : 0 }]}>
                                    <Text category='h5' style={styles.textLabel} >{I18n.t('total_paid')}:</Text>
                                    <Text category='h5' style={styles.label} >{'₹ ' + totalPaid}</Text>
                                    {paymentHistory.length > 0 &&
                                        <TouchableOpacity onPress={() => setShowPaymentHistory(true)} style={{ flexDirection: 'row' }}>
                                            <Icon name='history' pack="material-community" style={styles.paymentHistoryText} />
                                            <Text category='h5' status='info' >{I18n.t('payment_history')}</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                                {
                                    statusColor !== 'success' &&
                                    <>
                                        <View style={styles.textView}>
                                            <Text category='h5' style={styles.textLabel} >{I18n.t('net_payable')}:</Text>
                                            <Text category='h4' style={styles.label} >{'₹ ' + netPayable}</Text>
                                        </View>
                                        {!specialService &&
                                            <View style={styles.textView}>
                                                <Text category='h5' style={styles.textLabel} >{I18n.t('advance')}:</Text>
                                                <Text category='h5' style={styles.label} >{'₹ ' + advance}</Text>
                                            </View>
                                        }
                                        <View style={[styles.textView, { flexDirection: 'column' }]}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('amount')}:</Text>}
                                                size='medium'
                                                disabled={specialService}
                                                status={(errors.amount && touched.amount) ? 'danger' : 'basic'}
                                                value={values.amount}
                                                caption={(errors.amount && touched.amount) ? errors.amount : ''}
                                                captionIcon={(errors.amount && touched.amount) ? AlertIcon : () => (<></>)}
                                                onChangeText={handleChange('amount')}
                                                onBlur={handleBlur('amount')}
                                                keyboardType={'numeric'}
                                                accessoryLeft={() => <Text >{'₹'}</Text>}
                                                ref={amountInputRef}
                                                returnKeyType='next'
                                            />
                                        </View>
                                        <View style={[styles.textView, { flexDirection: 'column' }]}>
                                            <Input
                                                label={<Text category='h5' style={styles.label} >{I18n.t('extra_amount')}:</Text>}
                                                size='medium'
                                                status={(errors.extraAmount && touched.extraAmount) ? 'danger' : 'basic'}
                                                value={values.extraAmount}
                                                caption={(errors.extraAmount && touched.extraAmount) ? errors.extraAmount : ''}
                                                captionIcon={(errors.extraAmount && touched.extraAmount) ? AlertIcon : () => (<></>)}
                                                onChangeText={handleChange('extraAmount')}
                                                onBlur={handleBlur('extraAmount')}
                                                keyboardType={'numeric'}
                                                accessoryLeft={() => <Text >{'₹'}</Text>}
                                                ref={amountInputRef}
                                                returnKeyType='next'
                                            />
                                        </View>
                                        <View style={{ paddingVertical: convertHeight(13) }}>
                                            <Text category='h5' style={styles.label} >{I18n.t('payment_mode')}:</Text>
                                            {
                                                paymentModeOptions.map((option, index) => {
                                                    const isActive = values['paymentMode'] === option.id;
                                                    return <View pointerEvents={(option.disabled || statusColor !== 'danger') ? 'none' : 'auto'} key={option.id} style={styles.optionView}>
                                                        <Radio
                                                            checked={isActive}
                                                            status={'basic'}
                                                            disabled={option.disabled}
                                                            onChange={() => {
                                                                setFieldValue('paymentMode', option.id);
                                                            }}
                                                        />
                                                        <Text onPress={() => {
                                                            setFieldValue('paymentMode', option.id);
                                                        }} style={{ marginLeft: convertWidth(5) }} category='s1' numberOfLines={2} status='basic'>
                                                            {I18n.t(option.text)}
                                                        </Text>
                                                    </View>
                                                })
                                            }
                                        </View>
                                    </>
                                }
                            </Card>
                            {/* {
                                statusColor === 'success' &&
                                <View style={styles.shareWrapperView}>
                                    <TouchableOpacity onPress={() => { }} activeOpacity={0.8} style={styles.shareView}>
                                        <Icon name='share-variant' pack="material-community" style={styles.shareIcon} />
                                    </TouchableOpacity>
                                </View>
                            } */}
                        </Content>
                        {
                            !isKeyboardVisible && statusColor !== 'success' &&
                            <View style={styles.buttonView}>
                                <Button
                                    appearance='outline'
                                    size='small'
                                    style={{ width: convertWidth(130) }}
                                    onPress={() => {
                                        props.navigateBack();
                                    }}
                                >
                                    <Text category='h5'>{I18n.t('cancel')}</Text>
                                </Button>
                                <Button
                                    appearance='filled'
                                    size='small'
                                    status="primary"
                                    style={styles.button}
                                    onPress={handleSubmit}
                                >
                                    <Text appearance='alternative' category='h5'>{I18n.t('pay_now')}</Text>
                                </Button>
                            </View>
                        }
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
                    </SafeAreaView>
                    <Modal visible={showConfirmModal}
                        type='confirm'
                        message={specialService ? I18n.t('confirm_payment', { amount: values.amount }) : I18n.t('confirm_payment', { amount: values.amount }) + ' ' + I18n.t('confirm_payment_balance_adjust')}
                        okText={I18n.t('confirm')}
                        onOk={() => {
                            setShowConfirmModal(false);
                            props.updatePaymentCollection(values);
                        }}
                        okDisabled={syncingInvoices.includes(invoiceNumber)}
                        okDisabledText={I18n.t('syncing')}
                        cancelText={I18n.t('cancel')}
                        onCancel={() => {
                            setShowConfirmModal(false);
                        }}
                    />
                </>
            )}
        </Formik>
    );
}

const themedStyles = StyleService.create({
    content: {
        paddingHorizontal: convertWidth(13),
        paddingVertical: convertHeight(7),
        justifyContent: 'space-between',
        backgroundColor: 'color-basic-200'
    },
    card: {
        alignSelf: 'stretch',
        paddingTop: 0
    },
    textLabel: {
        color: 'text-black-color',
        marginRight: convertWidth(5)
    },
    label: {
        color: 'text-black-color'
    },
    optionView: {
        flexDirection: 'row',
        paddingTop: convertHeight(10)
    },
    textView: {
        flexDirection: 'row',
        paddingTop: convertHeight(13)
    },
    paymentHistoryText: {
        paddingLeft: convertWidth(10),
        paddingRight: convertWidth(2),
        height: convertHeight(20),
        color: 'color-info-500'
    },
    shareWrapperView: {
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: convertHeight(20)
    },
    shareView: {
        width: convertWidth(42),
        height: convertWidth(42),
        borderWidth: 1,
        borderColor: 'color-basic-600',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: convertWidth(21),
        backgroundColor: 'color-basic-200',
        elevation: 5
    },
    shareIcon: {
        color: 'color-basic-600',
        width: convertWidth(25),
        height: convertWidth(25)
    },
    buttonView: {
        paddingVertical: convertHeight(15),
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        width: convertWidth(130),
        backgroundColor: 'color-basic-600',
        borderWidth: 0
    },
    tableModalView: {
        width: tableModalWidth,
        paddingHorizontal: convertWidth(10),
        paddingBottom: convertHeight(10)
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    tableHead: {
        height: convertHeight(40),
        backgroundColor: '#f1f8ff'
    },
    tableText: {
        marginVertical: convertHeight(6),
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: convertHeight(14)
    }
});

export default PaymentCollectionView;
