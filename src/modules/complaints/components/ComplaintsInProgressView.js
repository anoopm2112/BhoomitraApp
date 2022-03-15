import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';
import { useTheme } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import { components, I18n, utils } from '../../../common';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Text, Icon, Card } = components;

const ComplaintsInProgressView = (props) => {
    const isFocused = useIsFocused();
    const firstUpdate = useRef(true);
    const {
        incompleteComplaints: { refreshing, data },
        startHeaderQRCodeScanning, icons, photos,
        loadComplaintPhotos, loadIncompleteServices,
        loadComplaintIcons, resetComplaintPhotos, animationData

    } = props;

    useEffect(() => {
        if (isFocused) {
            loadIncompleteServices();
            loadComplaintPhotos();
            loadComplaintIcons();
        } else {
            firstUpdate.current = true;
            resetComplaintPhotos();
        }
    }, [isFocused]);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        isFocused && loadComplaintPhotos({ partialRefresh: true });
    }, [data]);

    const renderItem = ({ item, index, separators }) => {
        const customerPhoto = photos[item.customerEnrollmentId];
        return (
            <AnimatedView
                key={item.customerNumber}
                useNativeDriver
                animation={animationData ? 'fadeInLeft' : undefined}
                duration={500}
            >
                <View style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card]}>
                    <TouchableOpacity onPress={() => { startHeaderQRCodeScanning(item) }}>
                        <View style={{ paddingHorizontal: convertWidth(13), borderBottomWidth: 0.5, borderColor: theme['border-basic-lite-color'] }}>
                            <View style={styles.viewContainer}>
                                <View style={{ justifyContent: 'center' }}>
                                    {customerPhoto ?
                                        <Image source={{ uri: `data:image/*;base64,${customerPhoto}` }} style={styles.userIcon} /> :
                                        <Icon name={'account-circle'} pack="material-community" style={[styles.userIcon, { color: theme['color-basic-1000'] }]} />
                                    }
                                </View>
                                <View style={{ justifyContent: 'center', width: convertWidth(250) }}>
                                    <Text category='h5' style={{ flexShrink: 1, fontWeight: 'bold' }} numberOfLines={2}>{item.name || '--'}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>{item.wardId}-</Text>
                                        <Text>{item.ward}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.secondViewContainer}>
                                <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('customer_number')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.customerNumber}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('property_name')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.propertyName}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('location')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.address ? item.address : item.formattedAddress ? item.formattedAddress : I18n.t('no_data_available')}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                    <View style={styles.keyTextStyle}>
                                        <Text category='h5'>{I18n.t('reported_at')}</Text>
                                    </View>
                                    <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                    <Text category='h5' style={styles.textStyle}>
                                        {item.complaintExecutionDate}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <FlatList
                                style={{ paddingVertical: convertHeight(10) }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={item.complaints}
                                keyExtractor={(item) => item.complaintId.toString()}
                                renderItem={(item) => _renderCircleListRow(item)} />
                        </View>
                    </TouchableOpacity>
                </View>
            </AnimatedView>
        );
    };

    const _renderCircleListRow = ({ item, index }) => {
        return (
            <View key={item.complaintId} style={{ paddingHorizontal: 10, borderRightWidth: 1, borderColor: theme['border-basic-lite-color'] }}>
                {
                    icons[item.id] ?
                        <Image source={{ uri: `data:image/*;base64,${icons[item.id]['icon']}` }} style={styles.complaintIcon} /> :
                        <Icon name="image-off-outline" pack="material-community" style={[styles.complaintIcon, { color: theme['color-basic-600'] }]} />
                }
            </View>
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
            margin: convertWidth(6),
        },
        mainContainer: {
            padding: convertWidth(6),
            flex: 1
        },
        viewContainer: {
            paddingBottom: convertHeight(10),
            borderBottomWidth: convertWidth(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: theme['border-basic-lite-color']
        },
        complaintIcon: {
            width: convertHeight(22),
            height: convertHeight(28)
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: convertHeight(10)
        },
        secondViewContainer: {
            paddingVertical: convertWidth(8)
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left'
        },
        iconStyle: {
            width: convertHeight(18),
            height: convertHeight(18),
            marginRight: convertWidth(5)
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: theme['color-basic-100'],
            paddingTop: convertHeight(13)
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
        userIcon: {
            width: convertWidth(45),
            height: convertWidth(45),
            borderRadius: convertWidth(45 / 2)
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        keyTextStyle: {
            width: convertWidth(135)
        }
    });

    return (
        <>
            <SafeAreaView>
                <View style={styles.mainContainer}>
                    <FlatList
                        data={data}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => renderItem(item)}
                        keyExtractor={(item) => `${item.customerNumber}_${item.complaintExecutionDate}`}
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

export default ComplaintsInProgressView;
