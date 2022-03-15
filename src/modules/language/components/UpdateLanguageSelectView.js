import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import { Svg, Circle } from 'react-native-svg';
import { components, utils, I18n } from '../../../common';
import { LANGUAGES } from '../constants';
import { useTheme } from '@ui-kitten/components';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Content, Layout, Icon, FontelloIcon, Text, Radio, Header, Button, Modal } = components;

export default UpdateLanguageSelectView = (props) => {

    const theme = useTheme();
    const [languageId, setLanguageId] = useState(-1);
    const [noInternetModal, setNoInternetModal] = useState(false);
    const { language, languageSelect } = props;
    const netInfo = useNetInfo();

    useEffect(() => {
        setLanguageId(language.langId);
    }, [language]);

    return (
        <>
            <SafeAreaView>
                <Header title={I18n.t('change_language')} accessoryRight={() => (<Text></Text>)} />
                <Layout level='1' style={styles.layout}>
                    <View style={styles.logoContainer}>
                        <Svg height={convertHeight(180)} width={convertWidth(180)}>
                            <Circle cx={convertWidth(90)} cy={convertHeight(90)} r={convertHeight(78)} fill={theme['border-basic-lite-color']} />
                        </Svg>
                        <View style={styles.languageIconWrapper}>
                            <FontelloIcon name='language' size={convertHeight(92.58)} style={{ color: theme['color-basic-1000'] }} />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        {
                            LANGUAGES.map((LANGUAGE, index) => {
                                return <Text key={index} style={{ color: theme['text-black-color'] }} appearance='alternative' category='h1'>{LANGUAGE.lang}</Text>
                            })
                        }
                    </View>
                    <View style={styles.selectContainer}>
                        <Content>
                            {
                                LANGUAGES.map((LANGUAGE, index) => {
                                    return <TouchableOpacity key={index} style={styles.selectButton} onPress={() => setLanguageId(LANGUAGE.langId)}>
                                        <Radio
                                            status={'black'}
                                            style={styles.selectRadio}
                                            checked={languageId === LANGUAGE.langId}
                                            onChange={() => setLanguageId(LANGUAGE.langId)}>
                                        </Radio>
                                        <Text appearance='alternative' style={styles.textStyles} category='h3'>{LANGUAGE.label}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </Content>
                    </View>
                    <View style={styles.saveButtonContainer}>
                        <Button
                            appearance='filled'
                            size='large'
                            onPress={() => {
                                if (netInfo && netInfo.isInternetReachable) {
                                    languageSelect(languageId);
                                } else {
                                    setNoInternetModal(true);
                                }
                            }}
                        >
                            <Text appearance='alternative' category='h3'>{I18n.t('save')}</Text>
                        </Button>
                    </View>
                </Layout>
                {
                    <Modal visible={noInternetModal}
                        message={I18n.t('no_internet')}
                        onOk={() => { setNoInternetModal(false); }}
                    />
                }
            </SafeAreaView>
        </>
    );

}

const styles = StyleSheet.create({
    layout: {
        height: convertHeight(640),
        paddingHorizontal: convertWidth(30)
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: convertHeight(210),
        position: 'relative'
    },
    languageIconWrapper: {
        position: 'absolute',
        top: convertHeight(60)
    },
    textContainer: {
        height: convertHeight(135)
    },
    selectContainer: {
        height: convertHeight(140)
    },
    selectButton: {
        height: convertHeight(50),
        borderRadius: convertWidth(5),
        borderColor: '#000',
        borderWidth: convertWidth(2),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: convertHeight(20)
    },
    selectRadio: {
        position: 'absolute',
        left: convertWidth(30)
    },
    saveButtonContainer: {
        height: convertHeight(70),
        justifyContent: 'flex-end',
        alignSelf: 'stretch',
        paddingBottom: convertHeight(12)
    },
    textStyles: {
        color: '#000'
    }
});