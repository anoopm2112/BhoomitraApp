import React from 'react';
import { StatusBar, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import RNConfigReader from 'rn-config-reader';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';

const { dimensionUtils: { convertHeight } } = utils
const { Icon, Content, Text, Card, SafeAreaView, Header } = components;

const AboutUsView = () => {
    const theme = useTheme();
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <Header title={I18n.t('about_us')} />
                <Content style={styles.mainContainer}>
                    <Card shadow style={styles.card}>
                        <View style={styles.container}>
                            <Icon name={'about-us'} pack="assets" />
                        </View>
                        <Text category="h3" style={styles.heading}>{I18n.t('aboutus_title')}</Text>
                        <Text style={{ textAlign: 'justify', paddingBottom: 10 }}>{I18n.t('aboutus_content')}</Text>
                        <View style={{ flexDirection: 'row', marginVertical: convertHeight(7), justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => RNConfigReader.app_term_condition === '' ? '' : Linking.openURL(`${RNConfigReader.app_term_condition}`)}>
                                <Text style={{ color: theme['color-info-500'], textDecorationLine: 'underline' }}>{I18n.t('terms_of_service')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => RNConfigReader.app_term_condition === '' ? '' : Linking.openURL(`${RNConfigReader.app_policy_privacy}`)}>
                                <Text style={{ color: theme['color-info-500'], textDecorationLine: 'underline' }}>{I18n.t('privacy_policy')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </Content>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: convertHeight(20),
    },
    mainContainer: {
        margin: 7,
    },
    heading: {
        paddingVertical: convertHeight(12),
        fontWeight: 'bold',
    },
    card: {
        alignSelf: 'stretch',
        flex: 1,
        margin: 7,
        marginBottom: 25
    }
});

export default AboutUsView;
