import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';

const { SafeAreaView, Text, CustomIcon, Header, Icon, OverflowMenu, MenuItem, CheckBox, Card } = components;
const { window, dimensionUtils: { convertWidth, convertHeight } } = utils;

const NotificationView = (props) => {
    const { animationData } = props;
    const [switchBtnChange, setSwitchBtnChange] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [visible, setVisible] = useState(false);
    const { notificationData: { data, refreshing }, navigation, readNotificationMsg } = props;

    useEffect(() => {
        const focusUnsubscribe = navigation.addListener('focus', () => {
            props.loadNotification();
        });

        return focusUnsubscribe;
    }, [navigation]);

    const onItemSelect = (index) => {
        setSelectedIndex(index);
        setVisible(false);
    };

    const renderToggleButton = () => (
        <TouchableOpacity style={styles.notificationMenuIcon} activeOpacity={0.5} onPress={() => setVisible(true)}>
            <Icon style={{ height: convertHeight(22.22), color: theme['text-black-color'] }} name="dots-vertical" pack="material-community" />
        </TouchableOpacity>
    );

    const renderCheckboxButton = () => (
        <CheckBox checked={switchBtnChange} onChange={(checked) => setSwitchBtnChange(checked)} />
    );

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => readNotificationMsg({ switchMsg: false, data: item })} key={index} style={{ marginHorizontal: convertWidth(10), marginVertical: convertHeight(3) }} activeOpacity={0.9}>
            <Animatable.View useNativeDriver animation={animationData ? "fadeInRight" : undefined}>
                <Card shadow style={styles.card}>
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={1} category="h4">{item.header}</Text>
                        <Text category="h5" style={{ paddingVertical: convertHeight(5) }}>{item.message ? item.message : I18n.t('no_data_available')}</Text>
                    </View>
                    {!item.read && <View style={styles.notifyRound} />}
                </Card>
            </Animatable.View>
        </TouchableOpacity>
    );

    const _emptyList = () => (
        !refreshing ?
            <View style={{ height: (window.height - window.height / 3), alignItems: 'center', justifyContent: 'center' }}>
                <Text category="s1">{I18n.t('no_notification_available')}</Text>
                <CustomIcon name="bell-off" />
            </View> : <View />
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        mainContainer: {
            paddingTop: convertHeight(7),
            flex: 1
        },
        readAllMsg: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: convertWidth(7),
            paddingTop: convertHeight(7)
        },
        readAllMsgBtn: {
            fontStyle: 'italic',
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            paddingTop: convertHeight(9)
        },
        toggle: {
            margin: 2,
            flexDirection: "row",
            flex: 1,
            justifyContent: 'flex-end'
        },
        notificationMenuIcon: {
            width: convertWidth(30),
            height: convertWidth(30),
            borderRadius: convertWidth(30),
            justifyContent: 'center',
            alignItems: 'center'
        },
        notificationSubHeading: {
            paddingLeft: convertHeight(9),
            paddingTop: convertHeight(7),
            color: theme['text-disabled-color']
        },
        card: {
            marginVertical: convertHeight(7),
            borderRadius: convertHeight(15),
            backgroundColor: theme['color-basic-100'],
            padding: convertHeight(12)
        },
        titleContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
        notifyRound: {
            width: convertWidth(20),
            height: convertWidth(20),
            borderRadius: convertWidth(20 / 2),
            backgroundColor: theme['color-primary-400'],
            position: 'absolute',
            right: 0,
            top: convertWidth(-7)
        }
    });

    const readAllMsg = () => {
        readNotificationMsg({ switchMsg: true, data: data });
        setVisible(false);
    }

    return (
        <>
            <SafeAreaView>
                <Header title={I18n.t('notifications')} accessoryRight={() => (<Text></Text>)} />
                {!_.isEmpty(data) &&
                    <View style={styles.readAllMsg}>
                        <View style={{ flexDirection: 'row', paddingLeft: convertWidth(5), width: convertWidth(160) }}>
                            <Text category="h5" style={styles.notificationSubHeading} numberOfLines={3}>{I18n.t('notifications')} ( {data.length} )</Text>
                        </View>
                        <OverflowMenu
                            style={{ width: convertWidth(200) }}
                            anchor={renderToggleButton}
                            visible={visible}
                            selectedIndex={selectedIndex}
                            onSelect={onItemSelect}
                            onBackdropPress={() => setVisible(false)}>
                            <MenuItem onPress={() => readAllMsg()} title={I18n.t('read_all_msg')} />
                            <MenuItem accessoryRight={renderCheckboxButton} title={I18n.t('only_show_unread')} />
                        </OverflowMenu>
                    </View>}
                <View style={styles.mainContainer}>
                    <FlatList
                        data={data}
                        showsVerticalScrollIndicator={true}
                        renderItem={(item) => renderItem(item)}
                        keyExtractor={(item) => item.notificationId.toString()}
                        onRefresh={() => props.loadNotification()}
                        refreshing={refreshing}
                        ListEmptyComponent={_emptyList}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default NotificationView;
