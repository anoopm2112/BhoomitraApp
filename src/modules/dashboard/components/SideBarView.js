import React, { useEffect, useState, useCallback } from 'react';
import { Linking, Image } from 'react-native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { useTheme } from '@ui-kitten/components';
import RNConfigReader from 'rn-config-reader';
import { components, utils, I18n, MODULE_ROUTE_KEYS } from '../../../common';
import { ROUTE_KEYS as DASHBOARD_ROUTE_KEYS } from '../../dashboard/constants';
import { ROUTE_KEYS as USER_ROUTE_KEYS } from '../../user/constants';
import { ROUTE_KEYS as HELP_SUPPORT_ROUTE_KEYS } from '../../helpSupport/constants';
import { CUSTOMER_ENROLLMNET_UI_KEYS, SERVICE_EXECUTION_UI_KEYS, CUSTOMER_ENROLLMENT_LIST_VIEW_KEYS, SERVICE_EXECUTION_LIST_VIEW_KEYS } from '../../enrollment/constants';
import { ROUTE_KEYS as SERVICE_ROUTE_KEYS } from '../../service/constants';
import { View, Text as RCTText } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RESOURCE_MAPPING, ACTION_MAPPING } from '../../../common/constants';
import { TEMPLATE_TYPES, TEMPLATE_TYPE_IDS, MODULE_TYPES } from '../../dfg/constants';
import DeviceInfo from 'react-native-device-info';

const { userUtils, dimensionUtils: { convertWidth, convertHeight }, permissionUtils: { hasAccessPermission } } = utils;

const { SafeAreaView, Drawer, Text, DrawerItem, Icon, FontelloIcon, IndexPath, StyleService, useStyleSheet, Content, Modal, DrawerGroup } = components;

const SideBarView = ({ user, ...props }) => {
    const theme = useTheme();
    const styles = useStyleSheet(themedStyles);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [drawerGroupItem, setDrawerGroup] = useState(false);

    useEffect(() => {
        let index = null;
        let currentRoute = props.sideBar.currentRoute;
        routes().some((route) => {
            if (route.name === currentRoute || (route.params && route.params.screen === currentRoute) || (route.subRoutes && route.subRoutes.indexOf(currentRoute) > -1)) {
                index = new IndexPath(route.key);
                return true;
            }
            return false;
        });
        setSelectedIndex(index);
    }, [props.sideBar.currentRoute, routes]);

    useEffect(() => {
        props.drawerStatus(true);
        if (props.needsUpdate !== undefined)
            if (props.needsUpdate) {
                setShowUpdateModal(true);
            }
    }, [props.needsUpdate]);

    const getDashboard = () => {
        if (userUtils.hasGtRole(user.info) || userUtils.hasSurveyorRole(user.info)) {
            return DASHBOARD_ROUTE_KEYS.SUMMARY;
        } else if (userUtils.hasMcfUserRole(user.info)) {
            return DASHBOARD_ROUTE_KEYS.MCFSUMMARY;
        } else if (userUtils.hasRrfUserRole(user.info)) {
            return DASHBOARD_ROUTE_KEYS.RRFSUMMARY;
        } else if (userUtils.hasCkcUserRole(user.info)) {
            return DASHBOARD_ROUTE_KEYS.CKCSUMMARY;
        } else {
            return DASHBOARD_ROUTE_KEYS.CUSTOMERSUMMARY;
        }
    };

    const routes = useCallback(() => {
        let key = 0;
        let menu = [
            {
                key: key++,
                title: I18n.t('home'),
                drawerIcon: () => <FontelloIcon name="home-select" size={convertHeight(22.22)} color={theme['color-basic-100']} style={styles.drawerItemIcon} />,
                name: getDashboard(),
                params: {}
            }
        ];

        if (hasAccessPermission(props.userRoles, RESOURCE_MAPPING.ENROLLMENT, ACTION_MAPPING.ENROLLMENT.ENROLLMENT_HISTORY)) {
            menu.push(
                {
                    key: key++,
                    title: I18n.t('enrollment_history'),
                    drawerIcon: () => <Icon style={[styles.drawerItemIcon, { height: convertHeight(22.22), color: theme['color-basic-100'] }]} name="account-details-outline" pack="material-community" />,
                    onPress: () => {
                        props.loadSurveyDoneView({
                            templateTypeIds: [TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.CUSTOMER_ENROLLMENT]],
                            uiKeys: Object.keys(CUSTOMER_ENROLLMNET_UI_KEYS),
                            listViewKeys: Object.keys(CUSTOMER_ENROLLMENT_LIST_VIEW_KEYS),
                            label: 'enrollment_history'
                        });
                    }
                }
            );
        }

        if (hasAccessPermission(props.userRoles, RESOURCE_MAPPING.SERVICE, ACTION_MAPPING.SERVICE.SERVICE_HISTORY)) {
            menu.push(
                {
                    key: key++,
                    title: I18n.t('service_history'),
                    drawerIcon: () => <Icon style={[styles.drawerItemIcon, { height: convertHeight(22.22), color: theme['color-basic-100'] }]} name="tools" pack="material-community" />,
                    onPress: () => {
                        props.loadSurveyDoneView({
                            moduleId: MODULE_TYPES.SERVICE,
                            // templateTypeIds: [
                            //     TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_INOCULUM_SUPPLY],
                            //     TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_MANURE_COLLECTION],
                            //     TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_PLASTIC_WASTE_COLLECTION],
                            //     TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_POULTRY_WASTE],
                            //     TEMPLATE_TYPE_IDS[TEMPLATE_TYPES.SERVICE_WET_WASTE_COLLECTION]
                            // ],
                            uiKeys: Object.keys(SERVICE_EXECUTION_UI_KEYS),
                            listViewKeys: Object.keys(SERVICE_EXECUTION_LIST_VIEW_KEYS),
                            label: 'service_history'
                        });
                    }
                }
            );
        }

        menu.push(
            {
                key: key++,
                title: I18n.t('settings'),
                drawerIcon: () => <FontelloIcon name="settings-sidebar" size={convertHeight(21.55)} color={theme['color-basic-100']} style={styles.drawerItemIcon} />,
                name: MODULE_ROUTE_KEYS.SETTINGS,
                params: {}
            },
            {
                key: key++,
                title: I18n.t('change_password'),
                drawerIcon: () => <FontelloIcon name="password-sidebar" size={convertHeight(21.55)} color={theme['color-basic-100']} style={styles.drawerItemIcon} />,
                name: MODULE_ROUTE_KEYS.USER,
                params: {
                    screen: USER_ROUTE_KEYS.CHANGE_PASSWORD
                }
            },
            {
                key: key++,
                title: I18n.t('help_support'),
                drawerIcon: () => <Icon name="face-agent" pack="material-community" style={[styles.drawerItemIcon, { height: convertHeight(22.22), color: theme['color-basic-100'] }]} />,
                subRoutes: [
                    {
                        key: key++,
                        title: I18n.t('send_feedback'),
                        drawerIcon: () => <Icon name="comment-quote" pack="material-community" style={[styles.drawerItemIcon, { height: convertHeight(16), color: theme['color-basic-100'] }]} />,
                        name: MODULE_ROUTE_KEYS.HELPSUPPORT,
                        params: {
                            screen: HELP_SUPPORT_ROUTE_KEYS.FEEDBACKSUPPORT
                        }
                    },
                    {
                        key: key++,
                        title: I18n.t('phone_support'),
                        drawerIcon: () => <Icon name="cellphone" pack="material-community" style={[styles.drawerItemIcon, { height: convertHeight(16), color: theme['color-basic-100'] }]} />,
                        name: MODULE_ROUTE_KEYS.HELPSUPPORT,
                        params: {
                            screen: HELP_SUPPORT_ROUTE_KEYS.PHONESUPPORT
                        }
                    },
                    {
                        key: key++,
                        title: I18n.t('email_support'),
                        drawerIcon: () => <Icon name="email" pack="material-community" style={[styles.drawerItemIcon, { height: convertHeight(16), color: theme['color-basic-100'] }]} />,
                        name: MODULE_ROUTE_KEYS.HELPSUPPORT,
                        params: {
                            screen: HELP_SUPPORT_ROUTE_KEYS.EMAILSUPPORT
                        }
                    },
                    {
                        key: key++,
                        title: I18n.t('faq'),
                        drawerIcon: () => <Icon name="frequently-asked-questions" pack="material-community" style={[styles.drawerItemIcon, { height: convertHeight(16), color: theme['color-basic-100'] }]} />,
                        name: userUtils.hasGtRole(user.info) || userUtils.hasSurveyorRole(user.info) ? DASHBOARD_ROUTE_KEYS.SUMMARY : DASHBOARD_ROUTE_KEYS.CUSTOMERSUMMARY,
                        params: {}
                    }
                ]
            },
            {
                key: key++,
                title: I18n.t('report_Bug'),
                drawerIcon: () => <Icon name="bug" pack="material-community" style={[styles.drawerItemIcon, { height: convertHeight(22.22), color: theme['color-basic-100'] }]} />,
                name: MODULE_ROUTE_KEYS.REPORTBUG,
                params: {}
            },
            {
                key: key++,
                title: I18n.t('about_us'),
                drawerIcon: () => <FontelloIcon name="aboutus-sidebar" size={convertHeight(19)} color={theme['color-basic-100']} style={styles.drawerItemIcon} />,
                name: MODULE_ROUTE_KEYS.ABOUTUS,
                params: {}
            },
            {
                key: key++,
                title: I18n.t('logout'),
                drawerIcon: () => <FontelloIcon name="logout-sidebar" size={convertHeight(19)} color={theme['color-basic-100']} style={styles.drawerItemIcon} />,
                onPress: props.logout
            }
        );

        return menu;
    }, [props.logout]);

    const DrawerHeader = () => {
        let style = styles.drawerHeaderView;
        if (useIsDrawerOpen()) {
            style.width = convertWidth(306);
        }
        return (
            <SafeAreaView forceInset={{ bottom: 'always' }} style={style}>
                <View style={styles.closeIconView}>
                    <TouchableOpacity onPress={props.navigation.closeDrawer}>
                        <FontelloIcon name="close-sidebar" size={convertHeight(15)} color={theme['color-basic-100']} style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.closeDrawer();
                        props.navigateToMyProfile();
                        props.drawerStatus(false);
                    }}
                    style={styles.userView}>
                    {user.info?.additionalInfo?.photo ?
                        <Image style={styles.iconStyle} source={{ uri: `data:image/*;base64,${user.info.additionalInfo.photo}` }} />
                        :
                        <Icon name={'account-circle'} pack="material-community" style={[styles.iconStyle, { color: theme['color-basic-1000'] }]} />
                    }
                    <RCTText numberOfLines={1} style={styles.userNameText}>{userUtils.getFullName(user).includes(undefined) ? '' : userUtils.getFullName(user)}</RCTText>
                </TouchableOpacity>
                {
                    <Modal visible={props.sideBar.logoutModal.enabled}
                        type='confirm'
                        message={props.sideBar.logoutModal.message ? I18n.t(props.sideBar.logoutModal.message) : ''}
                        okText={I18n.t('logout')}
                        onOk={() => {
                            props.doLogout();
                        }}
                        cancelText={I18n.t('cancel')}
                        onCancel={() => {
                            props.dontLogout();
                        }}
                    />
                }

                {
                    props.playstoreAppData !== undefined &&
                    <Modal visible={showUpdateModal}
                        cancelText={I18n.t('skip')}
                        okText={I18n.t('update_now')}
                        type={!props.playstoreAppData.updateApp ? 'confirm' : ''}
                        message={I18n.t('latest_version')}
                        onOk={() => { setShowUpdateModal(false); Linking.openURL(`${RNConfigReader.app_play_store_link}`); }}
                        onCancel={() => { props.playstoreAppData.updateApp ? setShowUpdateModal(true) : setShowUpdateModal(false); }}
                    />
                }
            </SafeAreaView>
        );
    }

    const DrawerFooter = (props) => (
        <>
            <Text category="c1" style={styles.footer} >{I18n.t(RNConfigReader.app_name_key)} © {new Date().getFullYear()}</Text>
            <Text category="c2" style={styles.footer} >Version {DeviceInfo.getVersion()}</Text>
            <Text category="c2" style={styles.footer} >Powered By</Text>
            <Text category="c1" style={[styles.footer, { paddingBottom: convertHeight(7) }]} >{I18n.t(RNConfigReader.app_powered_by)}</Text>
        </>
    );

    const onItemSelect = (index) => {
        const selectedRoute = routes()[index.row];
        if (selectedRoute.name) {
            props.navigation.navigate(selectedRoute.name, { ...selectedRoute.params });
            props.navigation.closeDrawer();
            props.drawerStatus(false);
        } else if (selectedRoute.onPress) {
            setSelectedIndex(index);
            selectedRoute.onPress();
            props.navigation.closeDrawer();
            props.drawerStatus(false);
        }
    };

    const createDrawerItemForRoute = (route) => {
        if (route.subRoutes) {
            return (
                <DrawerGroup onPressIn={() => setDrawerGroup(!drawerGroupItem)} key={route.key} accessoryLeft={route.drawerIcon}
                    style={[styles.submenuDrawerItem, {
                        marginTop: convertHeight(19),
                        borderTopStartRadius: convertWidth(5),
                        borderBottomLeftRadius: drawerGroupItem ?
                            convertWidth(0) :
                            convertWidth(5)
                    }]}
                    title={<Text category='h5' appearance='alternative'>{route.title}</Text>}>
                    {route.subRoutes.map((item, i) => {
                        return (
                            <DrawerItem
                                key={item.key}
                                accessoryLeft={item.drawerIcon}
                                title={<Text style={{ fontSize: convertHeight(12) }} appearance='alternative'>{item.title}</Text>}
                                style={[styles.submenuDrawerItem, {
                                    borderBottomLeftRadius:
                                        route.subRoutes.length - 1 === i ?
                                            convertWidth(5) :
                                            convertWidth(0)
                                }]}
                                onPress={() => {
                                    props.navigation.closeDrawer();
                                    props.navigation.navigate(item.name, { ...item.params })
                                }}
                            />
                        )
                    })}
                </DrawerGroup>
            );
        } else {
            return (
                <DrawerItem
                    key={route.key}
                    title={<Text category='h5' appearance='alternative'>{route.title}</Text>}
                    accessoryLeft={route.drawerIcon}
                    style={styles.drawerItem}
                />
            );
        }
    };

    return (
        <Drawer
            header={DrawerHeader}
            footer={DrawerFooter}
            appearance={'noDivider'}
            selectedIndex={selectedIndex}
            onSelect={onItemSelect}
            style={styles.drawer}>
            <Content>
                {routes().map(createDrawerItemForRoute)}
            </Content>
        </Drawer>
    );
};

const themedStyles = StyleService.create({
    drawerHeaderView: {
        height: convertHeight(320),
        backgroundColor: 'color-basic-600'
    },
    closeIconView: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: convertHeight(26),
        paddingRight: convertWidth(12)
    },
    closeIcon: {
        height: convertHeight(14),
        width: convertHeight(14),
    },
    userView: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        paddingLeft: convertWidth(15),
        height: convertHeight(100)
    },
    userSvg: {
        position: 'relative'
    },
    userIcon: {
        position: 'absolute',
        top: convertHeight(26),
        left: convertWidth(34),
        width: convertHeight(37.07),
        height: convertHeight(37.07),
        resizeMode: 'contain'
    },
    userNameText: {
        marginLeft: convertWidth(12),
        fontFamily: 'Roboto-Medium',
        fontSize: convertHeight(16),
        fontWeight: '500',
        color: '#FFF',
        flexShrink: 1
    },
    drawerItem: {
        marginTop: convertHeight(19),
        marginLeft: convertWidth(25),
        backgroundColor: 'rgba(255, 255, 244, 0.07)',
        borderRadius: convertWidth(5)
    },
    submenuDrawerItem: {
        marginLeft: convertWidth(25),
        backgroundColor: 'rgba(255, 255, 244, 0.07)',
        width: '91%',
    },
    drawerItemIcon: {
        marginLeft: convertWidth(8),
        marginRight: convertWidth(10),
        width: convertHeight(20),
        height: convertHeight(20)
    },
    drawer: {
        backgroundColor: 'color-basic-1000',
        height: convertHeight(260)
    },
    footer: {
        backgroundColor: 'color-basic-1000',
        color: 'color-primary-300',
        textAlign: 'center'
    },
    iconStyle: {
        width: convertWidth(80),
        height: convertHeight(80),
        borderRadius: convertHeight(80 / 2)
    }
});

export default SideBarView;
