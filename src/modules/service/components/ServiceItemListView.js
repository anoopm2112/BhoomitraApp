import React, { useState, useEffect, useRef } from 'react';
import { ListItem } from '@ui-kitten/components';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import moment from 'moment';
import { MaterialIndicator } from 'react-native-indicators';
import { createAnimatableComponent } from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import { useNetInfo } from '@react-native-community/netinfo';
import _ from 'lodash';
import FieldSet from 'react-native-fieldset';
import { utils, components, I18n, constants } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';

const { DATE_FORMAT } = constants;
const { dimensionUtils: { convertWidth, convertHeight } } = utils;
const { SafeAreaView, Text, Header, Icon, Modal, Content } = components;

const ServiceItemListView = (props) => {
    const [internetReachable, setInternetReachable] = useState(false);
    const animationRefs = useRef({});
    const {
        queued, progress, processed, failed, icons,
        serviceItemList: { showResumeModal, configs },
        startServiceExecution, generateServiceExecutionSurveyDataMap,
        resetServiceExecutionSurveyDataMap, unsetProcessed,
        loadServiceIcons, animationData
    } = props;
    const { initDone, serviceExecutionSurveyDataMap } = configs;
    const { data: { customerProfile } } = props.route.params;
    const { services = {} } = customerProfile;
    const sortedServices = _(services)
        .toPairs()
        .orderBy((pair) => moment(pair[0], DATE_FORMAT), ['desc'])
        .fromPairs()
        .value();
    const servicesLength = Object.keys(sortedServices).length;
    const animation = 'bounceIn';

    const ArrowIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="chevron-right" pack="material-community" style={{ height: convertHeight(25), color: theme['color-basic-600'] }} />
    ));

    const AlertIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="alert-circle-outline" pack="material-community" style={{ height: convertHeight(28), color: theme['color-danger-500'] }} />
    ));

    const CheckBoxMarkedIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="checkbox-marked-circle" pack="material-community" style={{ height: convertHeight(28), color: theme['color-success-500'] }} />
    ));

    const AnimatedArrowIcon = createAnimatableComponent(ArrowIcon);
    const AnimatedAlertIcon = createAnimatableComponent(AlertIcon);
    const AnimatedCheckBoxMarkedIcon = createAnimatableComponent(CheckBoxMarkedIcon);

    const renderItem1 = ({ item: serviceExecutionDate, index }) => {
        const data = sortedServices[serviceExecutionDate] || [];
        data.forEach(entry => {
            entry.serviceExecutionDate = serviceExecutionDate;
        });
        return (
            <View style={{ marginTop: convertHeight(20), marginBottom: index === servicesLength - 1 ? convertHeight(20) : 0 }}>
                <FieldSet label={serviceExecutionDate}>
                    <FlatList
                        data={data}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => renderItem2(item)}
                        keyExtractor={(item) => item.serviceExecutionId.toString()}
                        ListEmptyComponent={emptyList}
                    />
                </FieldSet>
            </View>
        )
    };

    const renderItem2 = ({ item, index }) => {
        const surveyId = serviceExecutionSurveyDataMap[item.serviceExecutionId];
        return <ListItem
            disabled={
                internetReachable ?
                    surveyId ?
                        (queued.includes(surveyId) || progress.hasOwnProperty(surveyId)) :
                        false :
                    false
            }
            style={styles.listRowView}
            onPress={() => {
                startServiceExecution({ customerProfile, item });
            }}
            title={item.name}
            accessoryRight={(props) => (
                <View style={{ flex: .20, alignItems: 'center' }}>{
                    surveyId === undefined ?
                        <ArrowIcon /> :
                        internetReachable ?
                            queued.includes(surveyId) ?
                                <MaterialIndicator size={convertHeight(25)} color={theme['color-basic-600']} /> :
                                progress.hasOwnProperty(surveyId) ?
                                    <Progress.Pie color={theme['color-basic-600']} progress={progress[surveyId]} size={convertHeight(25)} /> :
                                    processed.includes(surveyId) ?
                                        <AnimatedCheckBoxMarkedIcon useNativeDriver animation={animationData ? animation : undefined} /> :
                                        failed.includes(surveyId) ?
                                            <AnimatedAlertIcon useNativeDriver animation={animationData ? animation : undefined} /> :
                                            <AnimatedArrowIcon useNativeDriver onAnimationEnd={() => { animationRefs.current[surveyId] = undefined }} animation={animationData ? animationRefs.current[surveyId] : undefined} /> :
                            <ArrowIcon />
                }
                </View>
            )}
            accessoryLeft={() => {
                return icons[item.id] ? <Image source={{ uri: `data:image/*;base64,${icons[item.id]['icon']}` }} style={styles.leftIcon} /> :
                    <Icon name="image-off-outline" pack="material-community" style={[styles.leftIcon, { color: theme['color-basic-600'] }]} />
            }
            }
        />;
    };

    const emptyList = () => (
        <View style={styles.emptyList}>
            <Text category="h5">{I18n.t('no_data_available')}</Text>
        </View>
    );

    const netInfo = useNetInfo();
    const isFocused = useIsFocused();

    useEffect(() => {
        setInternetReachable(netInfo.isInternetReachable);
    }, [netInfo]);

    useEffect(() => {
        if (isFocused) {
            generateServiceExecutionSurveyDataMap(customerProfile);
            loadServiceIcons();
        } else {
            resetServiceExecutionSurveyDataMap();
        }
    }, [isFocused]);

    useEffect(() => {
        _.forOwn(serviceExecutionSurveyDataMap, (surveyId, serviceExecutionId) => {
            if (progress.hasOwnProperty(surveyId)) {
                animationRefs.current[surveyId] = animation;
            }
        });
    }, [progress, serviceExecutionSurveyDataMap]);

    useEffect(() => {
        _.forOwn(serviceExecutionSurveyDataMap, (surveyId, serviceExecutionId) => {
            if (processed.includes(surveyId)) {
                setTimeout(() => {
                    unsetProcessed(surveyId);
                }, 1000);
            }
        });
    }, [processed, serviceExecutionSurveyDataMap]);

    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            maxHeight: convertHeight(300),
        },
        content: {
            alignSelf: 'stretch',
            padding: convertHeight(13),
            paddingTop: 0
        },
        leftIcon: {
            height: convertHeight(43),
            width: convertWidth(32),
            marginHorizontal: convertWidth(8)
        },
        rightIconStyle: {
            height: convertHeight(25),
            width: convertHeight(25),
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: convertWidth(7)
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: convertHeight(10)
        },
        listRowView: {
            marginTop: convertHeight(7),
            marginHorizontal: convertWidth(7),
            borderRadius: convertWidth(10),
            borderWidth: 2,
            borderColor: theme['border-basic-lite-color']
        }
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('services')} />
            {
                initDone ?
                    <FlatList
                        data={Object.keys(sortedServices)}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => renderItem1(item)}
                        keyExtractor={(item) => item}
                        ListEmptyComponent={emptyList}
                        style={styles.content}
                    />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: convertWidth(20) }}>
                            <View style={{ marginRight: convertWidth(8) }}>
                                <MaterialIndicator size={convertHeight(22)} color={theme['text-basic-color']} />
                            </View>
                            <Text style={{ flexShrink: 1 }} numberOfLines={2}>{I18n.t('please_wait')}</Text>
                        </View>
                    </View>
            }
            {
                <Modal visible={showResumeModal}
                    type='confirm'
                    message={I18n.t('confirm_survey_resume')}
                    okText={I18n.t('do_resume')}
                    onOk={() => {
                        props.doResume();
                    }}
                    cancelText={I18n.t('dont_resume')}
                    onCancel={() => {
                        props.dontResume();
                    }}
                />
            }
        </SafeAreaView>
    );
};

export default ServiceItemListView;
