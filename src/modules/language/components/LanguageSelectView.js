import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { components, utils, I18n } from '../../../common';
import { LANGUAGES } from '../constants';
import { useTheme } from '@ui-kitten/components';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Content, Layout, FontelloIcon, Text, Radio } = components;

export default LanguageSelectView = (props) => {

    const [languageId, setLanguageId] = useState(-1);
    const { language, languageSelect } = props;
    const theme = useTheme();

    useEffect(() => {
        setLanguageId(language.langId);
    }, [language]);

    return (
        <>
            <SafeAreaView>
                <Layout level='6' style={styles.layout}>
                    <View style={styles.logoContainer}>
                        <Svg height={convertHeight(180)} width={convertWidth(180)}>
                            <Circle cx={convertWidth(90)} cy={convertHeight(90)} r={convertHeight(78)} fill={theme['color-basic-800']} />
                        </Svg>
                        <View style={styles.languageIconWrapper}>
                            <FontelloIcon name='language' size={convertHeight(92.58)} />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        {
                            LANGUAGES.map((LANGUAGE, index) => {
                                return <Text key={index} appearance='alternative' category='h1'>{LANGUAGE.lang}</Text>
                            })
                        }
                    </View>
                    <View style={styles.selectContainer}>
                        <Content>
                            {
                                LANGUAGES.map((LANGUAGE, index) => {
                                    return <TouchableOpacity key={index} style={styles.selectButton} onPress={() => {
                                        setLanguageId(LANGUAGE.langId);
                                        I18n.locale = LANGUAGE.locale;
                                    }
                                    }>
                                        <Radio
                                            status={'white'}
                                            style={styles.selectRadio}
                                            checked={languageId === LANGUAGE.langId}
                                            onChange={() => {
                                                setLanguageId(LANGUAGE.langId);
                                                I18n.locale = LANGUAGE.locale;
                                            }}>
                                        </Radio>
                                        <Text appearance='alternative' category='h3'>{LANGUAGE.label}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </Content>
                    </View>
                    <View style={styles.nextButtonContainer}>
                        <TouchableOpacity onPress={() => languageSelect(languageId)}>
                            <Text appearance='alternative' category='h3'>{I18n.t('next')}</Text>
                        </TouchableOpacity>
                    </View>
                </Layout>
            </SafeAreaView>
        </>
    );

}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
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
        height: convertHeight(160)
    },
    selectContainer: {
        height: convertHeight(140)
    },
    selectButton: {
        height: convertHeight(50),
        borderRadius: convertWidth(5),
        borderColor: '#FFF',
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
    nextButtonContainer: {
        flex: 1,
        height: convertHeight(130),
        justifyContent: 'center',
        alignItems: 'flex-end'
    }
});
