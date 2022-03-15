import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { createAnimatableComponent } from 'react-native-animatable';
import _ from 'lodash';
import { useTheme } from '@ui-kitten/components';
import { components, I18n, utils } from '../../../common';
import { DYNAMIC_TYPES, DYNAMIC_TYPES_TO_QUESTION_TYPES } from '../constants';
import renderElements from '../utils/doneViewCardListUtil';

const { SafeAreaView, Header, Card } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const AnimatedCard = createAnimatableComponent(Card);

const SurveyDoneDetailsView = (props) => {
    const { item, label, listViewKeys } = props.route.params.data;
    const { animationData } = props;
    const { dataSources = {}, details = [] } = item;
    const renderObjs = [];
    Object.keys(listViewKeys).forEach(key => {
        const renderObj = _.find(details, (detail) => {
            return detail.key === key && detail.type !== null && detail.value !== null;
        });
        if (renderObj) {
            if (DYNAMIC_TYPES.hasOwnProperty(renderObj.type)) {
                renderObj.type = DYNAMIC_TYPES_TO_QUESTION_TYPES[renderObj.type] || 'UNKNOWN';
            }
            renderObjs.push(renderObj);
        }
    });

    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            alignSelf: 'stretch',
            flex: 1,
            margin: convertWidth(6),
        },
        mainContainer: {
            padding: 7,
            flex: 1
        },
        viewContainer: {
            height: convertHeight(65),
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: theme['border-basic-lite-color']
        },
        userIcon: {
            width: convertWidth(45),
            height: convertWidth(45),
            marginRight: convertWidth(10),
            borderRadius: convertWidth(45 / 2)
        },
        secondViewContainer: {
            paddingVertical: 10
        },
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        keyTextStyle: {
            width: convertWidth(135)
        },
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t(label)} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <AnimatedCard shadow useNativeDriver animation={animationData ? 'fadeInLeft' : undefined} duration={500} style={styles.card}>
                    <View style={styles.secondViewContainer}>
                        {renderElements({ renderObjs, dataSources })}
                    </View>
                </AnimatedCard >
            </ScrollView>
        </SafeAreaView>
    );
}

export default SurveyDoneDetailsView;