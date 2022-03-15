import React from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import DashboardHeader from './DashboardHeader';
import { useTheme } from '@ui-kitten/components';
import { components, I18n, utils } from '../../../common';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { SafeAreaView, Text, Card } = components;

const SupervisorSummaryView = (props) => {
    const { navigation } = props;
    const dashBoardOptions = [];

    dashBoardOptions.push(
        {
            "id": 1,
            "name": "customers",
            "prefix": "",
            "number": 15,
            "navigation": props.startEnrollmentSurvey
        }
    );
    dashBoardOptions.push(
        {
            "id": 3,
            "name": 'plan_enabled_customers',
            "prefix": "",
            "navigation": props.startEnrollmentSurvey,
            "number": 5
        }
    );
    dashBoardOptions.push(
        {
            "id": 2,
            "name": "dashboard_service",
            "prefix": "pending",
            "number": 10,
            "navigation": props.navigateToServiceTopBar
        }
    );
    dashBoardOptions.push(
        {
            "id": 4,
            "name": 'dashboard_complaints',
            "prefix": "pending",
            "navigation": props.navigateToComplaintsTopBar,
            "number": 10
        }
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        card: {
            alignSelf: 'stretch',
            justifyContent: 'space-evenly',
            height: convertHeight(150),
            width: convertWidth(157),
            margin: convertHeight(7),
        },
        mainContainer: {
            padding: 7
        },
        viewContainer: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        textStyle: {
            paddingVertical: 10,
            textAlign: 'center'
        },
        roundIcon: {
            height: convertHeight(75),
            width: convertHeight(75),
            borderWidth: convertWidth(3),
            borderColor: theme['text-primary-color'],
            borderRadius: convertHeight(75),
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    const renderItem = ({ item }) => {
        return (
            <Card shadow style={styles.card}>
                <TouchableOpacity
                    // onPress={() => { item.navigation(); props.drawerStatus(true); }}
                    style={styles.viewContainer}>
                    <View style={styles.roundIcon}>
                        <AnimatedNumbers
                            includeComma
                            animationDuration={1500}
                            animateToNumber={item.number}
                            fontStyle={{
                                fontSize: convertHeight(23),
                                fontWeight: 'bold'
                            }} />
                    </View>
                    <Text style={styles.textStyle} category='h5'>{item.prefix ? I18n.t(item.prefix) : ''} {I18n.t(item.name)}</Text>
                </TouchableOpacity>
            </Card>
        );
    }

    return (
        <>
            <SafeAreaView>
                <DashboardHeader title={I18n.t('home')} navigation={navigation} />
                <View style={styles.mainContainer}>
                    <FlatList
                        data={dashBoardOptions}
                        numColumns={2}
                        renderItem={(item) => renderItem(item)}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

export default SupervisorSummaryView;