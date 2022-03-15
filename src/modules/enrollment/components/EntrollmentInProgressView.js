import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Platform, Image } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { useIsFocused } from '@react-navigation/native';
import { View as AnimatedView } from 'react-native-animatable';
import { useNetInfo } from '@react-native-community/netinfo';
import _ from 'lodash';
import { CUSTOMER_ENROLLMENT_LIST_VIEW_KEYS } from '../constants';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import renderElements from '../utils/cardListUtil';
import * as Progress from 'react-native-progress';

const { dimensionUtils: { convertHeight, convertWidth }, userUtils: { hasGtRole } } = utils;
const { SafeAreaView, Text, Icon, Modal } = components;

const EntrollmentInProgressView = (props) => {

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [allInprogressConfirmDelete, setAllInprogressConfirmDelete] = useState(false);
    const [surveyId, setSurveyId] = useState(undefined);
    const [visited, setVisited] = useState([]);
    const [internetReachable, setInternetReachable] = useState(false);

    const animatedViewRefsMap = useRef({});
    const flatListRef = useRef();

    const {
        animationData,
        queued, progress, processed, failed,
        incompleteSurveys: { refreshing, data, showResumeModal, surveysToBeDeleted },
        startEnrollmentSurvey, navigation, clearSurveysToBeDeleted, unsetProcessed
    } = props;

    const DeleteHandler = (props) => (
        <TouchableOpacity
            onPress={() => {
                setSurveyId(props.itemId);
                setConfirmDelete(true);
            }}
        >
            <Icon name="trash-can" pack="material-community" style={styles.deleteIcon} />
        </TouchableOpacity>
    );

    const CheckBoxMarkedIcon = React.forwardRef((props, ref) => (
        <Icon ref={ref} name="checkbox-marked-circle" pack="material-community" style={{ height: convertHeight(28), color: theme['color-success-500'] }} />
    ));

    const renderItem = ({ item, index }) => {
        const { details = [] } = item;
        const renderObjs = [];
        let customerPropertyName = {}, ward = {}, image = {};
        Object.keys(CUSTOMER_ENROLLMENT_LIST_VIEW_KEYS).forEach(key => {
            if (key === 'ENROLLMENT_CUSTOMER_PROPERTY_NAME') {
                customerPropertyName = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_NAME']) || {};
            } else if (key === 'ENROLLMENT_CUSTOMER_WARD') {
                ward = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_WARD']) || {};
            } else if (key === 'ENROLLMENT_CUSTOMER_IMAGE') {
                image = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_IMAGE']) || {};
            } else {
                const renderObj = _.find(details, (detail) => {
                    return detail.key === key && detail.type !== null && detail.value !== null;
                })
                renderObj && renderObjs.push(renderObj);
            }
        });
        if (progress.hasOwnProperty(item.id) && !visited.includes(item.id)) {
            setVisited([...visited, item.id]);
            flatListRef.current.scrollToIndex({ animated: true, viewOffset: convertHeight(100), index, viewPosition: 0.5 });
        }
        return (
            <AnimatedView
                pointerEvents={
                    internetReachable ?
                        (queued.includes(item.id) || progress.hasOwnProperty(item.id)) ?
                            'none' :
                            'auto' :
                        'auto'
                }
                useNativeDriver
                animation={animationData ? 'fadeInLeft' : undefined}
                duration={500}
                ref={ref => animatedViewRefsMap.current[item.id] = ref}
                style={[Platform.OS === 'android' ? styles.androidShadow : styles.iOSShadow, styles.viewStyle, styles.card, { borderColor: !item.completed ? theme['color-warning-500'] : failed.includes(item.id) ? theme['color-danger-500'] : theme['color-success-500'] }]}
            >
                <TouchableOpacity onPress={() => {
                    startEnrollmentSurvey(item.id);
                }}>
                    <View style={renderObjs.length ? styles.viewContainer : [styles.viewContainer, { borderBottomWidth: 0 }]}>
                        <View style={{ justifyContent: 'center' }}>
                            {image.value ?
                                <Image style={styles.userIcon} source={{ uri: `data:image/*;base64,${image.value}` }} /> :
                                <Icon name={'account-circle'} pack="material-community" style={[styles.userIcon, { color: theme['color-basic-1000'] }]} />}
                        </View>
                        <View style={{ justifyContent: 'center', width: convertWidth(200) }}>
                            <Text category='h5' style={{ flexShrink: 1 }} numberOfLines={2}>
                                {customerPropertyName.value ? customerPropertyName.value : I18n.t('name_not_available')}
                            </Text>
                            <Text>{(ward.value && ward.value.name) ? ward.value.name : I18n.t('ward_not_available')}</Text>
                        </View>
                        <View>
                            <View style={{ flex: 40, justifyContent: 'center' }}>
                                {
                                    internetReachable ?
                                        queued.includes(item.id) ?
                                            <MaterialIndicator size={convertHeight(25)} color={theme['color-basic-600']} /> :
                                            progress.hasOwnProperty(item.id) ?
                                                <Progress.Pie color={theme['color-basic-600']} progress={progress[item.id]} size={convertHeight(25)} /> :
                                                processed.includes(item.id) ?
                                                    <CheckBoxMarkedIcon /> :
                                                    <DeleteHandler itemId={item.id} /> :
                                        <DeleteHandler itemId={item.id} />
                                }
                            </View>
                            <View style={{ flex: 60 }} />
                        </View>
                    </View>
                    <View style={styles.secondViewContainer}>
                        {renderElements({ renderObjs })}
                    </View>
                </TouchableOpacity>
            </AnimatedView>
        )
    }

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> :
            <View />
    );

    const netInfo = useNetInfo();
    const isFocused = useIsFocused();

    useEffect(() => {
        setInternetReachable(netInfo.isInternetReachable);
    }, [netInfo]);

    useEffect(() => {
        const processedData = processed.filter(item => _.findIndex(data, { 'id': item, 'completed': true }) > -1) || [];
        const combined = _.union(processedData, surveysToBeDeleted);
        if (combined.length) {
            if (isFocused) {
                const promises = [];
                combined.forEach(surveyId => {
                    if (animatedViewRefsMap.current[surveyId]) {
                        if (animationData) {
                            promises.push(animatedViewRefsMap.current[surveyId].fadeOutRight(500));
                        } else {
                            promises.push(animatedViewRefsMap.current[surveyId]);

                        }
                    }
                });
                if (promises.length) {
                    Promise.all(promises).then(() => {
                        combined.forEach(surveyId => {
                            delete animatedViewRefsMap.current[surveyId];
                            setVisited(visited.filter(item => item !== surveyId));
                            if (processed.includes(surveyId)) {
                                unsetProcessed(surveyId);
                            }
                        });
                        clearSurveysToBeDeleted(combined);
                        props.enrollmentInProgressAnimationStatus(false);
                    });
                }
            } else {
                processedData.forEach(surveyId => {
                    if (processed.includes(surveyId)) {
                        unsetProcessed(surveyId);
                    }
                });
                clearSurveysToBeDeleted(combined);
            }
        }
    }, [processed, surveysToBeDeleted, data, isFocused]);

    useEffect(() => {
        setVisited(visited.filter(item => progress.hasOwnProperty(item)));
    }, [progress]);

    useEffect(() => {
        const focusUnsubscribe = navigation.addListener('focus', () => {
            props.loadIncompleteSurveys();
        });

        return focusUnsubscribe;
    }, [navigation]);

    const theme = useTheme();

    const styles = StyleSheet.create({
        floatingBtnStyle: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: convertWidth(8),
            right: convertWidth(14),
            height: convertHeight(37),
            borderRadius: convertWidth(20),
            borderWidth: 1,
            elevation: 5,
            borderColor: theme['color-basic-600'],
            backgroundColor: theme['color-basic-200']
        },
        floatingTextStyle: {
            color: theme['color-basic-600'],
            paddingLeft: convertWidth(7),
            flexShrink: 1
        },
        iconViewStyle: {
            flex: 22,
            alignItems: 'center'
        },
        textViewStyle: {
            flex: 78
        },
        card: {
            alignSelf: 'stretch',
            flex: 1,
            margin: convertWidth(6),
            borderLeftWidth: convertWidth(7),
        },
        mainContainer: {
            padding: convertWidth(6),
            flex: 1
        },
        viewContainer: {
            height: convertHeight(65),
            borderBottomWidth: convertWidth(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: theme['border-basic-lite-color']
        },
        deleteIcon: {
            color: theme['color-danger-500'],
            width: convertHeight(25),
            height: convertHeight(25)
        },
        serviceIcon: {
            color: theme['color-primary-400'],
            width: convertHeight(25),
            height: convertHeight(25)
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: convertHeight(10)
        },
        secondViewContainer: {
            paddingVertical: convertWidth(8)
        },
        verticleLine: {
            height: '100%',
            width: convertWidth(2),
            backgroundColor: theme['border-basic-lite-color'],
            marginHorizontal: convertWidth(10)
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left'
        },
        iconStyle: {
            width: convertHeight(18),
            height: convertHeight(18),
            marginRight: convertWidth(5)
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingHorizontal: convertWidth(13),
            paddingTop: convertHeight(13)
        },
        iOSShadow: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
        },
        androidShadow: {
            elevation: 3,
        },
        userIcon: {
            width: convertWidth(45),
            height: convertWidth(45),
            borderRadius: convertWidth(45 / 2)
        }
    });

    return (
        <SafeAreaView>
            <View pointerEvents={refreshing ? 'none' : 'auto'} style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => renderItem({ item, index })}
                    keyExtractor={(item) => item.id}
                    onRefresh={() => { }}
                    ref={flatListRef}
                    refreshing={refreshing}
                    onEndReached={() => { }}
                    ListEmptyComponent={emptyList}
                    ListFooterComponent={() => <View style={{ height: hasGtRole(props.userInfo) ? convertHeight(160) : convertHeight(110) }} />}
                />
            </View>
            {
                hasGtRole(props.userInfo) ?
                    <TouchableOpacity onPress={() => { setAllInprogressConfirmDelete(true) }} activeOpacity={0.8} style={[styles.floatingBtnStyle, { bottom: convertHeight(68), width: convertWidth(42), height: convertWidth(42), borderColor: theme['color-danger-500'] }]}>
                        <Icon name='delete-empty' pack="material-community" style={[styles.iconStyle, { color: theme['color-danger-500'], marginRight: convertWidth(0) }]} />
                    </TouchableOpacity> : null
            }
            <TouchableOpacity onPress={() => {
                startEnrollmentSurvey();
            }}
                activeOpacity={0.8} style={[styles.floatingBtnStyle, { bottom: convertHeight(20), width: convertWidth(140) }]}>
                <View style={styles.iconViewStyle}>
                    <Icon name="account-details-outline" pack="material-community" style={{ height: convertHeight(20), color: theme['color-basic-600'] }} />
                </View>
                <View style={styles.textViewStyle}>
                    <Text category="h5" numberOfLines={1} style={styles.floatingTextStyle}>{I18n.t('enrollment')}</Text>
                </View>
            </TouchableOpacity>
            {
                <Modal visible={confirmDelete}
                    type='confirm'
                    message={I18n.t('confirm_inprogress_delete')}
                    okText={I18n.t('delete')}
                    onOk={() => {
                        props.removeInprogressData(surveyId);
                        setSurveyId(undefined);
                        setConfirmDelete(false);
                    }}
                    onCancel={() => { setConfirmDelete(false); }}
                />
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
            {
                <Modal visible={allInprogressConfirmDelete}
                    type='confirm'
                    message={I18n.t('confirm_remove_all_inprogress_data')}
                    okText={I18n.t('delete')}
                    onOk={() => {
                        props.removeInprogressData();
                        setAllInprogressConfirmDelete(false);
                    }}
                    cancelText={I18n.t('cancel')}
                    onCancel={() => {
                        setAllInprogressConfirmDelete(false);
                    }}
                />
            }
        </SafeAreaView>
    );
};

export default EntrollmentInProgressView;
