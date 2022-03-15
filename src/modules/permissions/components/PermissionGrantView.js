import React from 'react';
import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { components, utils, I18n } from '../../../common';
import { default as theme } from '../../../common/eva/mapping';
import { useTheme } from '@ui-kitten/components';
import RNConfigReader from 'rn-config-reader';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Layout, Icon, Text, Modal, Content } = components;

class PermissionGrantView extends React.Component {

    render() {
        const { theme } = this.props;
        const { grandPermissions, denyPermissions, permissions, showGrantPermissionsModal,
            showAllowBlockedPermissionsModal, recheckPermissions } = this.props;
        const styles = StyleSheet.create({
            mainContainer: {

            },
            layout: {
                height: convertWidth(85),
                paddingLeft: convertWidth(19),
                justifyContent: 'center'
            },
            permissionContainer: {
                paddingHorizontal: convertWidth(19),
                paddingTop: convertWidth(25)
            },
            firstContainer: {
                flexDirection: 'row'
            },
            box: {
                width: convertWidth(40),
                height: convertWidth(40),
                backgroundColor: theme['color-basic-1000'],
                borderRadius: convertWidth(6),
                alignItems: 'center',
                justifyContent: 'center'
            },
            cameraIcon: {
                width: convertWidth(20),
                height: convertWidth(20),
                color: theme['color-basic-100']
            },
            locationIcon: {
                width: convertWidth(25.71),
                height: convertHeight(25.71),
                color: theme['color-basic-100']
            },
            internetIcon: {
                width: convertWidth(18),
                height: convertHeight(19.2),
                resizeMode: 'contain'
            },
            offlineIcon: {
                width: convertWidth(18),
                height: convertHeight(18.73),
                resizeMode: 'contain'
            },
            subTitle: {
                marginTop: convertHeight(5),
                paddingBottom: convertHeight(10)
            },
            textStyles: {
                fontFamily: theme['text-font-family'],
                color: theme['color-basic-1000'],
                paddingLeft: convertWidth(10),
                alignSelf: 'flex-end'
            },
            lineStyle: {
                borderWidth: convertWidth(1),
                borderColor: theme['border-basic-lite-color']
            },
            wrapperStyle: {
                paddingTop: convertHeight(13)
            },
            buttonContainer: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: convertWidth(25),
                marginTop: convertHeight(5)
            },
            denyView: {
                width: convertWidth(150),
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: convertWidth(8),
                paddingHorizontal: convertWidth(15),
                borderRadius: convertHeight(10)
            },
            denyText: {
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid'
            },
            grantPermissionView: {
                width: convertWidth(150),
                backgroundColor: theme['color-basic-600'],
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: convertWidth(8),
                paddingHorizontal: convertWidth(15),
                borderRadius: convertHeight(10)
            },
            continueButtonContainer: {
                backgroundColor: theme['color-basic-600'],
                width: convertWidth(150),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: convertWidth(5),
                height: convertHeight(40)
            }
        });

        return (
            <>
                <SafeAreaView>
                    <Content>
                        <View style={styles.mainContainer}>
                            <Layout level='6' style={styles.layout}>
                                <Text appearance="alternative" category="h3">{I18n.t("permission_title_h1")}</Text>
                                <Text appearance="alternative" category="h3">{I18n.t("permission_title_h2")}</Text>
                            </Layout>
                            <View style={styles.permissionContainer}>
                                <View>
                                    <View style={styles.firstContainer}>
                                        <View style={styles.box}>
                                            <Icon name='camera' pack="material-community" style={styles.cameraIcon} />
                                        </View>
                                        <Text style={styles.textStyles} appearance="alternative" category="h3">{I18n.t("camera_permission")}</Text>
                                    </View>
                                    <View style={styles.subTitle}>
                                        <Text category="p1">{I18n.t("camera_permission_desc")}</Text>
                                    </View>
                                    <View style={styles.lineStyle} />
                                </View>
                                <View style={styles.wrapperStyle}>
                                    <View style={styles.firstContainer}>
                                        <View style={styles.box}>
                                            <Icon name='map-marker-outline' pack='material-community' style={styles.locationIcon} />
                                        </View>
                                        <Text style={styles.textStyles} appearance="alternative" category="h3">{I18n.t("location_permission")}</Text>
                                    </View>
                                    <View style={styles.subTitle}>
                                        <Text category="p1">{I18n.t("location_permission_desc")}</Text>
                                    </View>
                                    <View style={styles.lineStyle} />
                                </View>
                            </View>
                            {
                                <Modal visible={permissions.showGrantPermissionsModal}
                                    message={I18n.t('must_grant_or_exit')}
                                    onOk={() => { showGrantPermissionsModal(false) }}
                                />
                            }
                            {
                                <Modal visible={permissions.showAllowBlockedPermissionsModal}
                                    type='confirm'
                                    message={I18n.t('allow_blocked_permissions')}
                                    okText={I18n.t('settings')}
                                    onOk={() => {
                                        showAllowBlockedPermissionsModal(false);
                                        recheckPermissions(true);
                                        Linking.openSettings();
                                    }}
                                    onCancel={() => { showAllowBlockedPermissionsModal(false) }}
                                />
                            }
                        </View>
                    </Content>
                    <View style={{ marginHorizontal: convertWidth(15) }}>
                        <Text category='label'>{I18n.t('terms_and_condition')}{' '}
                            <Text onPress={() => RNConfigReader.app_term_condition === '' ? '' : Linking.openURL(`${RNConfigReader.app_term_condition}`)} numberOfLines={2} status='info' style={styles.denyText} category='label'>{I18n.t('terms_of_service')}</Text>
                            <Text> & </Text>
                            <Text onPress={() => RNConfigReader.app_policy_privacy === '' ? '' : Linking.openURL(`${RNConfigReader.app_policy_privacy}`)} numberOfLines={2} status='info' style={styles.denyText} category='label'>{I18n.t('privacy_policy')}</Text>
                        </Text>
                    </View>
                    <View style={{ marginVertical: convertHeight(15), alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={grandPermissions} style={styles.continueButtonContainer}>
                            <Text numberOfLines={2} appearance='alternative' category='label'>{I18n.t('continue')}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </>
        );
    }

}


export default function (props) {
    const theme = useTheme();
    return <PermissionGrantView {...props} theme={theme} />;
}
