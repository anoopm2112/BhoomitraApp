import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { components, I18n, utils } from '../../../common';
const { dimensionUtils: { convertHeight, convertWidth }, userUtils: { } } = utils;
const { SafeAreaView, Header, Text, Content, Toggle } = components;

export default DeveloperOptionsView = (props) => {

    const { developerOptions: { validations, autoSync }, setDeveloperOptions } = props;
    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" />
            <Header title={I18n.t('settings')} />
            <Content style={styles.container}>
                <View style={styles.card}>
                    <Text category='h5' style={styles.txt}>{I18n.t('enable_validation')}</Text>
                    <Toggle
                        style={styles.toggle}
                        status='primary'
                        checked={validations}
                        onChange={(checked) => setDeveloperOptions({ validations: checked })}
                    >
                    </Toggle>
                </View>
                <View style={styles.card}>
                    <Text category='h5' style={styles.txt}>{I18n.t('enable_background_syncing')}</Text>
                    <Toggle
                        style={styles.toggle}
                        status='primary'
                        checked={autoSync}
                        onChange={(checked) => setDeveloperOptions({ autoSync: checked })}
                    >
                    </Toggle>
                </View>
            </Content>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        paddingHorizontal: convertWidth(13),
        paddingVertical: convertHeight(13),
    },
    toggle: {
        margin: 2,
        flexDirection: "row",
        flex: 1,
        justifyContent: 'flex-end'
    },
    card: {
        flexDirection: 'row',
        marginBottom: convertHeight(15)
    },
    txt: {
        textAlign: 'center',
        marginTop: convertHeight(5)
    }
});