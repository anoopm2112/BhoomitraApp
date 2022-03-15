import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { I18n, utils, components, constants } from '../../../common';
import moment from 'moment';
import _ from 'lodash';
import FieldSet from 'react-native-fieldset';
import { ListItem, useTheme } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIndicator } from 'react-native-indicators';
import { createAnimatableComponent } from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import { useNetInfo } from '@react-native-community/netinfo';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;
const { Text, Header, Icon, SafeAreaView, Modal } = components;
const { DATE_FORMAT } = constants;

const ComplaintItemListView = (props) => {
    const [internetReachable, setInternetReachable] = useState(false);
    const animationRefs = useRef({});

    const netInfo = useNetInfo();
    const isFocused = useIsFocused();

    const { data: { customerProfile } } = props.route.params;
    const {
        queued, progress, processed, failed, icons,
        complaintItemList: { showResumeModal, configs },
        startComplaintExecution, generateComplaintExecutionSurveyDataMap,
        resetComplaintExecutionSurveyDataMap, unsetProcessed,
        loadComplaintIcons, animationData
    } = props;
    const { initDone, complaintExecutionSurveyDataMap } = configs;
    const { complaints = {} } = customerProfile;

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

    useEffect(() => {
        setInternetReachable(netInfo.isInternetReachable);
    }, [netInfo]);

    useEffect(() => {
        if (isFocused) {
            generateComplaintExecutionSurveyDataMap(customerProfile);
            loadComplaintIcons();
        } else {
            resetComplaintExecutionSurveyDataMap();
        }
    }, [isFocused]);

    useEffect(() => {
        _.forOwn(complaintExecutionSurveyDataMap, (surveyId, serviceExecutionId) => {
            if (progress.hasOwnProperty(surveyId)) {
                animationRefs.current[surveyId] = animation;
            }
        });
    }, [progress, complaintExecutionSurveyDataMap]);

    useEffect(() => {
        _.forOwn(complaintExecutionSurveyDataMap, (surveyId, serviceExecutionId) => {
            if (processed.includes(surveyId)) {
                setTimeout(() => {
                    unsetProcessed(surveyId);
                }, 1000);
            }
        });
    }, [processed, complaintExecutionSurveyDataMap]);

    const sortedComplaints = _(complaints)
        .toPairs()
        .orderBy((pair) => moment(pair[0], DATE_FORMAT), ['desc'])
        .fromPairs()
        .value();

    const renderItem1 = ({ item, index }) => {
        return (
            <View style={{ paddingTop: convertHeight(20) }}>
                <FieldSet label={item}>
                    <FlatList
                        data={sortedComplaints[item]}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item) => renderItem2(item)}
                        keyExtractor={(item) => item.complaintId.toString()}
                        ListEmptyComponent={emptyList}
                    />
                </FieldSet>
            </View>
        )
    };

    const renderItem2 = ({ item, index }) => {
        const surveyId = complaintExecutionSurveyDataMap[item.complaintId];
        return (
            <ListItem
                disabled={
                    internetReachable ?
                        surveyId ?
                            (queued.includes(surveyId) || progress.hasOwnProperty(surveyId)) :
                            false :
                        false
                }
                style={styles.listRowView}
                onPress={() => {
                    startComplaintExecution({ customerProfile, item });
                }}
                title={item.name}
                description={item.comment}
                accessoryRight={(props) => (
                    <View style={{ flex: .20, alignItems: 'center' }}>
                        {
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
                }}
            />
        )
    };

    const emptyList = () => (
        <View style={styles.emptyList}>
            <Text category="h5">{I18n.t('no_data_available')}</Text>
        </View>
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        mainContainer: {
            alignSelf: 'stretch',
            padding: convertHeight(13),
            paddingTop: 0,
            backgroundColor: theme['color-basic-100'],
            marginBottom: convertHeight(60)
        },
        btn: {
            width: convertWidth(130),
            backgroundColor: theme['color-basic-600'],
            borderWidth: 0
        },
        btnContainer: {
            marginTop: convertHeight(8),
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        btnIcon: {
            width: convertHeight(22),
            height: convertHeight(22),
            color: theme['color-basic-100']
        },
        listRowView: {
            marginTop: convertHeight(7),
            marginHorizontal: convertWidth(7),
            borderRadius: convertWidth(10),
            borderWidth: 2,
            borderColor: theme['border-basic-lite-color']
        },
        leftIcon: {
            height: convertHeight(43),
            width: convertWidth(32),
            marginHorizontal: convertWidth(8)
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: convertHeight(10)
        },
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('complaints_small')} />
            {
                initDone ?
                    <View style={styles.mainContainer}>
                        <FlatList
                            data={Object.keys(sortedComplaints)}
                            showsVerticalScrollIndicator={false}
                            renderItem={(item) => renderItem1(item)}
                            keyExtractor={(item) => item}
                            ListEmptyComponent={emptyList}
                        />
                    </View> :
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

export default ComplaintItemListView;
