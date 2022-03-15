import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { createAnimatableComponent } from 'react-native-animatable';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import { useState } from 'react';
import NetInfo from "@react-native-community/netinfo";
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Text, Card, Modal, Button, TrackProgress } = components;

const AnimatedCard = createAnimatableComponent(Card);

const EnrollmentSubscriptionView = (props) => {
    const { animationData, subscription: { enrollmentSubscription } = {} } = props;
    const { data, refreshing } = enrollmentSubscription;
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const [subscriptionItem, setItem] = useState();

    const isFocused = useIsFocused();
    const showModal = (modal) => {
        toggleModalVisibility(modal);
    };

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.fetchSubscription();
                }
            }
        });
    }, [isFocused]);

    const getStatusColor = (id) => {
        if (id === 11) {
            // SubscriptionCancelled
            return theme['text-placeholder-color'];
        }
        if (id === 12) {
            // SubscriptionApproved
            return theme['color-success-500'];
        }
        if (id === 13) {
            // SubscriptionDeclined
            return theme['color-danger-500'];
        }
        if (id === 10) {
            // SubscriptionRequested
            return theme['color-warning-500'];
        }
        return theme['color-info-500'];
    };

    const renderSubscriptionItem = ({ item }) => {
        return (
            <AnimatedCard shadow useNativeDriver animation={animationData ? "fadeInLeft" : undefined} duration={500} style={[styles.card, { borderColor: getStatusColor(item.status !== undefined && item.status !== null ? item.status.id : ''), borderLeftWidth: convertWidth(7) }]} key={item}>
                <TouchableOpacity>
                    <View style={styles.viewContainer}>
                        <View>
                            {
                                item.status !== undefined && item.status != null &&
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ borderWidth: 2, borderColor: getStatusColor(item.status.id), borderRadius: 3, paddingHorizontal: convertWidth(10) }}>
                                        {_.has(item, 'showOptInButton') && !item.showOptInButton ?
                                            <Text category='h5' style={{ color: getStatusColor(item.status.id), fontStyle: 'italic', fontWeight: 'bold', padding: 3 }}>
                                                {_.has(item, 'status') ? item.status.name : 'No Request Found'}
                                            </Text> : null
                                        }
                                    </View>
                                </View>
                            }
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('subscription_service_type')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceType') ? item.serviceType.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('subscription_config')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceConfig') ? item.serviceConfig.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('subscription_interval')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceInterval') ? item.serviceInterval.name : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('subscription_service_provider')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {_.has(item, 'serviceProvider') ? item.serviceProvider.name : ''}
                                </Text>
                            </View>
                            {

                                item.paymentConfig !== undefined &&
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                        <View style={styles.keyTextStyle}>
                                            <Text category='h5'>{I18n.t('collection_type')}</Text>
                                        </View>
                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                        <Text category='h5' style={styles.textStyle}>
                                            {
                                                item.paymentConfig.collectionType !== undefined &&
                                                item.paymentConfig.collectionType.name
                                            }
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                        <View style={styles.keyTextStyle}>
                                            <Text category='h5'>{I18n.t('sub_rate_type')}</Text>
                                        </View>
                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                        <Text category='h5' style={styles.textStyle}>
                                            {
                                                item.paymentConfig.rateType !== undefined &&
                                                item.paymentConfig.rateType.name
                                            }
                                        </Text>
                                    </View>
                                    {
                                        item.paymentConfig.rateType !== undefined && item.paymentConfig.rateType.name === 'Slab Rate' && item.paymentConfig.slabs.length > 0 && item.paymentConfig.slabs.map((item, index) => {
                                            return (
                                                <Card key={index} shadow style={{ marginTop: convertWidth(20), paddingVertical: convertWidth(15) }}>
                                                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                                        <View style={styles.keyTextStyle}>
                                                            <Text category='h5'>{I18n.t('slab_name')}</Text>
                                                        </View>
                                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                                        <Text category='h5' style={styles.textStyle}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                                        <View style={styles.keyTextStyle}>
                                                            <Text category='h5'>{I18n.t('price_per_unit')}</Text>
                                                        </View>
                                                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                                        <Text category='h5' style={styles.textStyle}>
                                                            {item.pricePerUnit}
                                                        </Text>
                                                    </View>
                                                </Card>
                                            );

                                        })
                                    }
                                    {
                                        item.paymentConfig.rateType !== undefined && item.paymentConfig.rateType.name === 'Per Unit Rate' &&
                                        <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                            <View style={styles.keyTextStyle}>
                                                <Text category='h5'>{I18n.t('price_per_unit')}</Text>
                                            </View>
                                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                            <Text category='h5' style={styles.textStyle}>
                                                {item.paymentConfig.perUnitAmount}
                                            </Text>
                                        </View>
                                    }
                                    {
                                        item.paymentConfig.rateType !== undefined && item.paymentConfig.rateType.name === 'Fixed Rate' &&
                                        <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                            <View style={styles.keyTextStyle}>
                                                <Text category='h5'>{I18n.t('fixed_amount')}</Text>
                                            </View>
                                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                            <Text category='h5' style={styles.textStyle}>
                                                {item.paymentConfig.fixedAmount}
                                            </Text>
                                        </View>
                                    }
                                </View>
                            }
                            {
                                item.processStatus && item.processStatus.length > 0 &&
                                <View style={{ marginTop: convertHeight(15) }}>
                                    <TrackProgress status={item.processStatus} />
                                </View>
                            }
                        </View>
                        <View style={styles.btnView}>
                            {
                                _.has(item, 'showOptInButton') && item.showOptInButton &&
                                <Button appearance='filled' size='small' status="success" style={styles.btnCancel}
                                    onPress={() => { setItem(item); showModal(true); }}
                                >
                                    <Text category='h5' style={styles.textStyleBtn}>{I18n.t('opt_in')}</Text>
                                </Button>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </AnimatedCard >
        );
    };

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> : <View />
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        card: {
            alignSelf: 'stretch',
            flex: 1,
            margin: convertWidth(6),
        },
        labelHead: {
            fontSize: convertWidth(16),
            fontWeight: 'bold',
            marginBottom: convertWidth(13),
            margin: convertWidth(10)
        },
        mainContainer: {
            padding: convertWidth(6),
            flex: 1
        },
        viewContainer: {
            borderBottomWidth: 1,
            borderColor: theme['border-basic-lite-color']
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
        textStyleService: {
            flexWrap: 'wrap',
            width: convertWidth(200),
            textAlign: 'left',
            fontSize: convertWidth(14)
        },
        textStyleBtn: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(13),
            color: theme['color-basic-100'],
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
        iconStyle: {
            width: convertHeight(18),
            height: convertHeight(18),
            marginRight: convertWidth(5)
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
            marginTop: convertWidth(10),
            paddingBottom: convertWidth(10),
            justifyContent: 'flex-end',
            flexDirection: 'row'
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        keyTextStyle: {
            width: convertWidth(125)
        },
        statusShow: {
            fontStyle: 'italic',
            textAlign: 'right',
            color: theme['color-info-500'],
            textDecorationLine: 'underline'
        }
    });

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderSubscriptionItem(item)}
                    onRefresh={() => props.fetchSubscription()}
                    refreshing={refreshing}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.1}
                    ListEmptyComponent={emptyList}
                />
            </View>
            <Modal visible={showModalVisibility}
                message={I18n.t('do_you_want_to_opt_the_subscription')}
                type='confirm'
                onCancel={() => showModal(false)}
                onOk={() => {
                    props.optInOptOrOut(subscriptionItem);
                    showModal(false);
                }}
            />
        </SafeAreaView>
    );
};

export default EnrollmentSubscriptionView;
