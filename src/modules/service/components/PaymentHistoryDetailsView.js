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
const { SafeAreaView, Text, Header, Icon } = components;

const PaymentHistoryDetailsView = (props) => {
    const { animationData, icons, customerPaymentHistory: { data, refreshing } } = props;
    const isFocused = useIsFocused();
    const [collectionList, setCollectionList] = useState([]);
    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.fetchCustomerPaymentHistory({ reset: true });
                }
            }
        });
    }, [isFocused]);

    useEffect(() => {
        const collectionType = _.filter(data, function (o) { return o.collectionTypeId === COLLECTION_TYPE.COLLECTION; });
        setCollectionList(collectionType);
    }, []);

    const onEndReached = () => {
        props.fetchCustomerPaymentHistory({ reset: false });
    };

    const onRefresh = () => {
        props.fetchCustomerPaymentHistory({ reset: true });
    };

    const theme = useTheme();

    const styles = StyleSheet.create({
        mainContainer: {
            padding: convertWidth(7),
            flex: 1
        },
        viewContainer: {
            paddingBottom: convertHeight(10),
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
                <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card]}>
                    <TouchableOpacity
                        onPress={() => props.fetchCustomerPaymentHistoryDetails({ invoiceNumber: item.invoiceNumber })}
                    >
                        <View style={styles.viewContainer}>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('customer_number')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.customerNumber ? item.customerNumber : ''}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('invoice_number')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.invoiceNumber ? item.invoiceNumber : ''}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('total_payable')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.totalPayable ? '₹ ' + item.totalPayable : '₹0'}
                                </Text>
                            </View>
                            <View style={styles.rowView}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('total_paid')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.totalPaid ? '₹ ' + item.totalPaid : '₹0'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
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
            <Header title={I18n.t('payment_history')} />
            <View style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item) => item.invoiceNumber.toString()}
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

export default PaymentHistoryDetailsView;
