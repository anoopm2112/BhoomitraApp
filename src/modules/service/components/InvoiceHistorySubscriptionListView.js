import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Platform, Image } from 'react-native';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from '@react-navigation/native';
import { View as AnimatedView } from 'react-native-animatable';
import { COLLECTION_TYPE, INVOICE_INTERVAL } from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { dimensionUtils: { convertHeight, convertWidth }, dateUtils: { convertToLocalDate } } = utils;
const { SafeAreaView, Text, Icon } = components;

const InvoiceHistorySubscriptionListView = (props) => {
    const { animationData, icons, userInfo: { additionalInfo: { customerNumber } }, customerInvoiceHistory: { data, refreshing } = {} } = props;
    const isFocused = useIsFocused();
    const [invoiceData, setInvoiceData] = useState([]);
    const [collectionList, setCollectionList] = useState([]);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.fetchCustomerInvoiceHistory();
                }
            }
        });
    }, [isFocused]);

    useEffect(() => {
        if (data !== undefined) {
            setInvoiceData(data[customerNumber]);
            const collectionType = _.filter(data[customerNumber], function (o) { return o.summary.collectionTypeId === COLLECTION_TYPE.SUBSCRIPTION; });
            setCollectionList(collectionType);
        }
    }, [data, customerNumber]);

    const theme = useTheme();

    const styles = StyleSheet.create({
        emptyList: {
            alignItems: 'center',
            paddingTop: 10
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
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
        mainContainer: {
            padding: convertWidth(7),
            flex: 1
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
            flex: 1,
            margin: convertWidth(6),
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingTop: convertHeight(13)
        },
        secondViewContainer: {
            paddingVertical: convertWidth(8)
        },
    });

    const renderItem = ({ item }) => {
        const invoiceNumberSections = item.invoiceNumber.split('-');
        const service = _.find(icons, function (o) { return o.id === item.summary.serviceConfigId; });
        return (
            <AnimatedView
                key={item.id}
                useNativeDriver
                animation={animationData ? 'fadeInLeft' : undefined}
                duration={500}
            >
                {
                    COLLECTION_TYPE.SUBSCRIPTION === item.summary.collectionTypeId &&
                    <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card]}>
                        <TouchableOpacity onPress={() => props.navigateToInvoiceSubscriptionDetails(item)}>
                            <View style={{ marginBottom: convertWidth(10), paddingHorizontal: convertWidth(13) }}>
                                <View style={styles.viewContainer}>
                                    <View style={{ justifyContent: 'center' }}>
                                        {
                                            service.icon ?
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
                                            <Text>{item.customerNumber ? item.customerNumber : ''}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.secondViewContainer}>
                                    <View style={styles.rowView}>
                                        <View style={styles.keyTextStyle}>
                                            <Text category='h5'>{I18n.t('subscribed_from')}</Text>
                                        </View>
                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                        <Text category='h5' style={styles.textStyle}>
                                            {item.summary.subscribedFrom ? convertToLocalDate(item.summary.subscribedFrom) : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.rowView}>
                                        <View style={styles.keyTextStyle}>
                                            <Text category='h5'>{I18n.t('subscribed_to')}</Text>
                                        </View>
                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                        <Text category='h5' style={styles.textStyle}>
                                            {item.summary.subscribedTo ? convertToLocalDate(item.summary.subscribedTo) : ''}
                                        </Text>
                                    </View>
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
                                            {item.dueDate ? convertToLocalDate(item.dueDate) : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.rowView}>
                                        <View style={styles.keyTextStyle}>
                                            <Text category='h5'>{I18n.t('invoice_period')}</Text>
                                        </View>
                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                        <Text category='h5' style={styles.textStyle}>
                                            {item.invoicePeriod ? item.invoicePeriod : ''}
                                        </Text>
                                    </View>

                                    <View style={styles.rowView}>
                                        <View style={styles.keyTextStyle}>
                                            <Text category='h5'>{I18n.t('invoice_interval')}</Text>
                                        </View>
                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                        {
                                            item.invoiceIntervalId &&
                                            <Text category='h5' style={styles.textStyle}>
                                                {
                                                    INVOICE_INTERVAL.MONTHLY === item.invoiceIntervalId ?
                                                        I18n.t('monthly') : I18n.t('date_wise')
                                                }
                                            </Text>
                                        }
                                    </View>
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
            {
                invoiceData !== undefined && invoiceData.length > 0 && _.isEmpty(collectionList) &&
                <View style={styles.emptyList}>
                    <Text category="h5">{I18n.t('no_data_available')}</Text>
                </View>
            }
            <View style={styles.mainContainer}>
                <FlatList
                    data={invoiceData}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item) => item.id.toString()}
                    onRefresh={() => props.fetchCustomerInvoiceHistory()}
                    refreshing={refreshing}
                    ListEmptyComponent={emptyList}
                    ListFooterComponent={() => <View style={{ height: convertHeight(70) }} />}
                />
            </View>
        </SafeAreaView>
    );
};

export default InvoiceHistorySubscriptionListView;
