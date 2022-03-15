import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { createAnimatableComponent } from 'react-native-animatable';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from "@react-native-community/netinfo";

const { dimensionUtils: { convertHeight, convertWidth }, dateUtils: { getViewFormattedDate } } = utils;
const { SafeAreaView, Text, Card, Header } = components;
const AnimatedCard = createAnimatableComponent(Card);

const ServiceHistoryView = (props) => {
    const { animationData, serviceHistory: { data, refreshing } } = props;
    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                props.fetchServiceHistory();
            }
        });
    }, []);

    const renderItem = ({ item }) => {
        return (
            <AnimatedCard shadow useNativeDriver animation={animationData ? 'fadeInLeft' : undefined} duration={500} style={styles.card} key={item}>
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text category='h5' style={styles.dateShow}>
                            {_.has(item, 'servicedAt') ? getViewFormattedDate(item.servicedAt) : ''}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                        <View style={styles.keyTextStyle}>
                            <Text category='h5'>{I18n.t('service_history_service_type')}</Text>
                        </View>
                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                        <Text category='h5' style={styles.textStyle}>
                            {_.has(item, 'serviceType') ? item.serviceType?.name : ''}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                        <View style={styles.keyTextStyle}>
                            <Text category='h5'>{I18n.t('service_history_service_config')}</Text>
                        </View>
                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                        <Text category='h5' style={styles.textStyle}>
                            {_.has(item, 'serviceConfig') ? item.serviceConfig?.name : ''}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                        <View style={styles.keyTextStyle}>
                            <Text category='h5'>{I18n.t('service_history_service_residence_category')}</Text>
                        </View>
                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                        <Text category='h5' style={styles.textStyle}>
                            {_.has(item, 'residenceCategory') ? item.residenceCategory?.name : ''}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                        <View style={styles.keyTextStyle}>
                            <Text category='h5'>{I18n.t('service_history_service_serviced_by')}</Text>
                        </View>
                        <Text category='h5' style={styles.fullColonSpace}>:</Text>
                        <Text category='h5' style={styles.textStyle}>
                            {_.has(item, 'servicedBy') ? item.servicedBy?.name : ''}
                        </Text>
                    </View>
                    {
                        _.has(item, 'serviceType') && item.serviceType.id === 2 &&
                        <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                            <View style={styles.keyTextStyle}>
                                <Text category='h5'>{I18n.t('service_history_service_bundled_config')} :</Text>
                            </View>
                            <Text category='h5' style={styles.fullColonSpace}>:</Text>
                            <Text category='h5' style={styles.textStyle}>
                                {_.has(item, 'bundledServiceConfig') ? item.bundledServiceConfig?.name : ''}
                            </Text>
                        </View>
                    }
                </View>
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
        card: {
            alignSelf: 'stretch',
            flex: 1,
            padding: convertWidth(15),
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
            textAlign: 'left'
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        keyTextStyle: {
            width: convertWidth(125)
        },
        dateShow: {
            fontStyle: 'italic',
            textAlign: 'right',
            color: theme['color-info-500'],
            textDecorationLine: 'underline'
        }
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('service_history')} />
            <View style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    onRefresh={() => props.fetchServiceHistory()}
                    refreshing={refreshing}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={emptyList}
                />
            </View>
        </SafeAreaView>
    );
};

export default ServiceHistoryView;
