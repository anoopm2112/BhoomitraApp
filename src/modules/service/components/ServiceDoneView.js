import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { useTheme } from '@ui-kitten/components';
import { components, I18n, utils } from '../../../common';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Text, Icon, Card, Header } = components;

const ServiceDoneView = (props) => {

    const { doneServices: { refreshing, data }, navigation } = props;

    useEffect(() => {
        const focusUnsubscribe = navigation.addListener('focus', () => {
            props.loadDoneServices();
        });

        return focusUnsubscribe;
    }, [navigation]);

    const serviceListArray = [{ "id": 434 }, { "id": 435 }, { "id": 431 }, { "id": 439 }, { "id": 438 }, { "id": 446 }];

    const renderItem = ({ item, index }) => (
        <Card key={index} shadow style={styles.card}>
            <TouchableOpacity onPress={props.navigateToServiceBarcode}>
                <View style={styles.viewContainer}>
                    <View style={{ justifyContent: 'center' }}>
                        <Icon name="account-circle" pack="material-community" style={[styles.profileIcon, { color: theme['color-basic-1000'] }]} />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text category='h5' style={{ fontWeight: "bold", paddingBottom: 3 }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{item.number}</Text>
                            <View style={styles.verticleLine}></View>
                            <Text>{item.place_name}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.secondViewContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.keyTextStyle}>
                            <Text category='h5'>{I18n.t('name_of_Institution')}</Text>
                        </View>
                        <Text category='h5' style={{ paddingHorizontal: 5 }}>:</Text>
                        <Text category='h5' style={styles.textStyle}>
                            {item.company}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.keyTextStyle}>
                            <Text category='h5'>{I18n.t('building_type')}</Text>
                        </View>
                        <Text category='h5' style={{ paddingHorizontal: 5 }}>:</Text>
                        <Text category='h5' style={styles.textStyle}>
                            {item.building}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.keyTextStyle}>
                            <Text category='h5'>{I18n.t('trading_type')}</Text>
                        </View>
                        <Text category='h5' style={{ paddingHorizontal: 5 }}>:</Text>
                        <Text category='h5' style={styles.textStyle}>
                            {item.treading}
                        </Text>
                    </View>
                    <Text category='h5' style={styles.textStyle}>{item.address}</Text>
                </View>

            </TouchableOpacity>
            <View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={serviceListArray}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={_renderCircleListRow} />
            </View>
        </Card>
    );

    const _renderCircleListRow = () => {
        return (
            <TouchableOpacity>
                <Svg height={convertHeight(70)} width={convertWidth(60)}>
                    <Circle cx={convertWidth(22)} cy={convertHeight(38)} r={convertHeight(20)} fill={theme['border-basic-lite-color']} />
                </Svg>
            </TouchableOpacity>
        );
    };

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View>
            : <View />
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            alignSelf: 'stretch',
            flex: 1,
            margin: 7,
        },
        mainContainer: {
            padding: 7,
            flex: 1
        },
        viewContainer: {
            height: convertHeight(65),
            borderBottomWidth: 1,
            flexDirection: 'row',
            borderColor: theme['border-basic-lite-color']
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: 10
        },
        secondViewContainer: {
            paddingTop: 10
        },
        userSvg: {
            position: 'relative',
        },
        userIcon: {
            position: 'absolute',
            top: convertHeight(22),
            left: convertWidth(25),
            width: convertHeight(25),
            height: convertHeight(25.07),
            resizeMode: 'contain'
        },
        verticleLine: {
            height: '100%',
            width: 2,
            backgroundColor: theme['border-basic-lite-color'],
            marginHorizontal: 10
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left'
        },
        profileIcon: {
            width: convertHeight(91),
            height: convertHeight(91),
        },
    });

    return (
        <>
            <SafeAreaView>
                <Header title={I18n.t('service_history')} />
                <View style={styles.mainContainer}>
                    <FlatList
                        data={data}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => renderItem(item)}
                        keyExtractor={(item) => item.id.toString()}
                        onRefresh={() => { }}
                        refreshing={refreshing}
                        onEndReached={() => { }}
                        ListEmptyComponent={emptyList}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default ServiceDoneView;
