import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import Svg, { Path } from 'react-native-svg';
import { components, I18n, utils } from '../../../common';
import { RESOURCE_MAPPING, ACTION_MAPPING } from '../../../common/constants';

import DashboardHeader from './DashboardHeader';

const { SafeAreaView, StyleService, useStyleSheet, Text, Card, FontelloIcon } = components;
const { dimensionUtils: { convertHeight, convertWidth }, permissionUtils: { hasAccessPermission } } = utils;

const McfSummaryView = (props) => {
    let { navigation, userRoles } = props;
    const styles = useStyleSheet(themedStyles);
    const theme = useTheme();
    const dashboardItems = [];
    if (hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.MCF_STOCK_IN_CARD)) {
        dashboardItems.push(
            { id: 1, label: I18n.t('stock_in'), iconName: 'mcf-stock-in', onPress: props.mcfStockIn }
        );
    }
    if (hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.MCF_STOCK_TRANSFER_CARD)) {
        dashboardItems.push(
            { id: 2, label: I18n.t('stock_transfer'), iconName: 'mcf-stock-transfer', onPress: props.mcfStockTransfer },
        );
    }
    if (hasAccessPermission(userRoles, RESOURCE_MAPPING.MOBILE_HOME, ACTION_MAPPING.MOBILE_HOME.MCF_SALE_CARD)) {
        dashboardItems.push(
            { id: 2, label: I18n.t('sale'), iconName: 'mcf-sale', onPress: props.mcfSale },
        );
    }
    dashboardItems.push(
        { id: 3, label: I18n.t('segregation'), iconName: 'mcf-sale', onPress: props.mcfSegregation },
    );

    const _renderItems = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={item.onPress} key={index}>
                <Card style={styles.card}>
                    <Svg height={convertHeight(40)} viewBox="0 0 40 40">
                        <FontelloIcon name={item.iconName} size={convertHeight(35)} style={{ color: theme['color-basic-600'] }} />
                    </Svg>
                    <Text category='h5' style={styles.label} >{item.label}</Text>
                </Card>
            </TouchableOpacity>
        )
    }
    return (
        <>
            <SafeAreaView>
                <DashboardHeader navigation={navigation} />
                <View style={{ position: 'relative', top: -1 }}>
                    <Svg preserveAspectRatio="none" viewBox="0 0 360 626" style={{ position: 'absolute', flex: 1 }}>
                        <Path
                            fill={theme['color-basic-500']}
                            d="M0 0H360V294C360 294 326.723 294.39 300.5 297.5C224.427 306.522 151.416 358.396 75 353C32.8048 350.021 0 325.5 0 325.5V0Z"
                        />
                    </Svg>
                    <Svg preserveAspectRatio="none" viewBox="0 0 360 626" style={{ flex: 1 }}>
                        <Path
                            fill={theme['color-basic-600']}
                            d="M0 0H360V293.5C360 293.5 313.5 288 279 294C203.568 307.119 148.5 332 68.5 332C26.2081 332 0 312.244 0 312.244V0Z"
                        />
                    </Svg>
                </View>
                <View style={styles.flatListContainer}>
                    <View style={styles.viewContainer}>
                        <Text appearance='alternative' category='h4'>{I18n.t('select_your_option')}</Text>
                    </View>
                    <FlatList
                        numColumns={2}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={dashboardItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={(item) => _renderItems(item)} />
                </View>
            </SafeAreaView>
        </>
    );
}

const themedStyles = StyleService.create({
    mainContainer: {
        backgroundColor: '#F7F9FC',
        bottom: 0
    },
    flatListContainer: {
        position: 'absolute',
        bottom: convertWidth(10),
        height: convertHeight(570),
        justifyContent: 'center',
        alignItems: 'center',
        padding: convertWidth(12)
    },
    label: {
        color: 'text-black-color',
        padding: convertWidth(10),
        fontSize: convertWidth(12),
        textAlign: 'center'
    },
    preview: {
        alignSelf: 'center',
        height: convertHeight(400),
        width: '100%',
        alignItems: 'center',
        resizeMode: 'contain'
    },
    preview1: {
        alignSelf: 'center',
        height: convertHeight(380),
        width: '100%',
        alignItems: 'center',
    },
    viewContainer: {
        padding: convertWidth(20),
        width: '100%',
        marginTop: convertWidth(13)
    },
    card: {
        alignSelf: 'stretch',
        height: convertHeight(140),
        width: convertWidth(140),
        margin: convertWidth(13),
        borderRadius: convertWidth(15),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3

    },
    iconStyle: {
        width: convertWidth(40),
        height: convertHeight(40)
    }
});

export default McfSummaryView;
