import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, StatusBar } from 'react-native';
import { components, I18n } from '../../../common';
const { SafeAreaView, Layout, Text } = components;

export default class DummyView extends React.Component {

    render() {
        const { user } = this.props;
        return (
            <>
                <SafeAreaView>
                    <Layout level='2' style={styles.layoutStyle}>
                        <Text category="h1">{I18n.t('welcome')}</Text>
                        <Text category="h2">Dummy {(this.props.route.params && this.props.route.params.page) || 'Page'}</Text>
                    </Layout>
                </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    layoutStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});