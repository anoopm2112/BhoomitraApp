import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { components, I18n, MODULE_ROUTE_KEYS, utils } from '../../../common';
import { ROUTE_KEYS as USER_ROUTE_KEYS } from '../../user';
import { ROUTE_KEYS as LANG_ROUTE_KEYS } from '../../language';
import { ROUTE_KEYS as SETTINGS_ROUTE_KEYS } from '../constants';
import { userUtils } from '../../../common/utils';
import { ROLE_TYPES } from '../../../common/constants';

const {
    dimensionUtils: { convertHeight, convertWidth },
    permissionUtils: { hasAccessPermission }
} = utils;
const { SafeAreaView, List, ListItem, Icon, Header } = components;

const ArrowIcon = (props) => (
    <Icon name="chevron-right" pack="material-community" {...props} />
);

const arrowExcludedMenus = ['format-float-right', 'sync', 'animation'];

class SettingsView extends React.Component {

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }
    _renderItem({ item }) {
        return (
            <ListItem style={styles.listRowView}
                cardView={false}
                title={item.label}
                description={item.description}
                accessoryRight={!arrowExcludedMenus.includes(item.iconName) ? ArrowIcon : null}
                accessoryLeft={(props) => (
                    <Icon name={item.iconName} pack="material-community" {...props} />
                )}
                onPress={() => {
                    if (item.route) {
                        this.props.navigateTo(item.route, item.screen);
                    } else if (item.label === I18n.t('force_sync')) {
                        this.props.forceSync();
                    } else if (item.label === I18n.t('force_update')) {
                        this.props.forceUpdate();
                    }
                    else if (item.label === I18n.t('enable_animation') || item.label === I18n.t('disable_animation')) {
                        this.props.componentAnimation();
                    }
                }} />
        );
    }

    render() {
        const settingsRoutes = [
            { label: I18n.t('change_password'), iconName: 'lock-outline', route: MODULE_ROUTE_KEYS.USER, screen: USER_ROUTE_KEYS.CHANGE_PASSWORD },
            { label: I18n.t('change_language'), iconName: 'translate', route: MODULE_ROUTE_KEYS.LANGUAGE, screen: LANG_ROUTE_KEYS.LANGUAGE_UPDATE },
            { label: !this.props.animationData ? I18n.t('enable_animation') : I18n.t('disable_animation'), iconName: 'animation' },
        ];
        if (userUtils.hasAnyRole(this.props.userInfo, [ROLE_TYPES.ROLE_GT, ROLE_TYPES.ROLE_SURVEYOR])) {
            settingsRoutes.push(
                { label: I18n.t('force_sync'), iconName: 'sync', description: I18n.t('forcefully_upload_data') },
            );
            settingsRoutes.push(
                { label: I18n.t('force_update'), iconName: 'format-float-right', description: I18n.t('forcefully_downlod_data_config') },
            );
        }
        if (userUtils.hasDeveloperRole(this.props.userInfo)) {
            settingsRoutes.push(
                { label: I18n.t('developer_options'), iconName: 'wrench-outline', route: SETTINGS_ROUTE_KEYS.DEVELOPER_OPTIONS }
            );
        }
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <Header title={I18n.t('settings')} />
                    <List
                        style={styles.container}
                        data={settingsRoutes}
                        renderItem={this._renderItem}
                    />
                </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    listRowView: {
        marginTop: convertHeight(7),
        marginHorizontal: convertWidth(7)
    }
});

export default SettingsView;
