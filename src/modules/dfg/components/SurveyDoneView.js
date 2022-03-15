import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, BackHandler, Image, LogBox, ActivityIndicator } from 'react-native';
import _ from 'lodash';
import { createAnimatableComponent } from 'react-native-animatable';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import { DYNAMIC_TYPES, DYNAMIC_TYPES_TO_QUESTION_TYPES } from '../constants';
import renderElements from '../../enrollment/utils/cardListUtil';
import IconBadge from 'react-native-icon-badge';
import { CUSTOMER_ENROLLMNET_UI_KEYS, SERVICE_EXECUTION_UI_KEYS } from '../../enrollment/constants';

const { dimensionUtils: { convertHeight, convertWidth }, userUtils: { hasGtRole } } = utils;
const { SafeAreaView, Text, Icon, Card, OverlayModal, Modal, Header } = components;

const AnimatedCard = createAnimatableComponent(Card);

const SurveyDoneView = (props) => {
    const {
        completedSurveys: {
            refreshing, data, showDownloadingSurveyDataModal, infoMessage, filters, startServiceEnrollmentDataModal
        },
        loadCompletedSurveys, editSyncedSurvey,
        startEnrollmentSurvey, toogleDownloadingSurveyDataModalVisibility,
        clearSurveyDataFetchMessage, navigateToSurveyFilter,
        toogleStartServiceEnrollmentDataModalVisibility,
        startQRCodeScanning, navigateToSurveyDoneDetails,
        initializer: { listViewKeys, label },
        userInfo, animationData
    } = props;


    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        if (Object.keys(filters).length === 0) {
            loadCompletedSurveys({ reset: true });
        } else {
            loadCompletedSurveys({ reset: true, filter: true });
        }
    }, [filters]);

    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            props.clearCompleteSurveyFilter();
            props.resetCompletedSurvey();
        }
    }, []);

    useEffect(() => {
        function handleBackButton() {
            if (showDownloadingSurveyDataModal) {
                toogleDownloadingSurveyDataModalVisibility(false);
                return true;
            } else if (startServiceEnrollmentDataModal) {
                toogleStartServiceEnrollmentDataModalVisibility(false);
                return true;
            }
            return false;
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            backHandler.remove();
        }
    }, [showDownloadingSurveyDataModal, startServiceEnrollmentDataModal]);

    const renderItem = ({ item }) => {
        const { details = [] } = item;
        const renderObjs = [];
        let customerPropertyName = {}, ward = {}, image = {};
        listViewKeys.forEach(key => {
            if (key === 'ENROLLMENT_CUSTOMER_PROPERTY_NAME') {
                customerPropertyName = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_PROPERTY_NAME']) || {};
            } else if (key === 'ENROLLMENT_CUSTOMER_WARD') {
                ward = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_WARD']) || {};
            } else if (key === 'ENROLLMENT_CUSTOMER_IMAGE') {
                image = _.find(details, ['key', 'ENROLLMENT_CUSTOMER_IMAGE']) || {};
            } else {
                const renderObj = _.find(details, (detail) => {
                    return detail.key === key && detail.type !== null && detail.value !== null;
                });
                if (renderObj) {
                    if (DYNAMIC_TYPES.hasOwnProperty(renderObj.type)) {
                        renderObj.type = DYNAMIC_TYPES_TO_QUESTION_TYPES[renderObj.type] || 'UNKNOWN';
                    }
                    renderObjs.push(renderObj);
                }
            }
        });
        return (
            <AnimatedCard shadow useNativeDriver animation={animationData ? 'fadeInLeft' : undefined} duration={500} style={styles.card}>
                <TouchableOpacity onPress={() => {
                    navigateToSurveyDoneDetails({
                        item: item,
                        label: label,
                        listViewKeys: label === 'enrollment_history' ? CUSTOMER_ENROLLMNET_UI_KEYS : SERVICE_EXECUTION_UI_KEYS
                    })
                }}
                // onPress={() => { editSyncedSurvey(item.id); }}
                >
                    {hasGtRole(userInfo) &&
                        <View style={renderObjs.length ? styles.viewContainer : [styles.viewContainer, { borderBottomWidth: 0 }]}>
                            {label === 'enrollment_history' && <View style={{ justifyContent: 'center' }}>
                                {image.value ?
                                    <Image style={styles.userIcon} source={{ uri: `data:image/*;base64,${image.value}` }} /> :
                                    <Icon name={'account-circle'} pack="material-community" style={[styles.userIcon, { color: theme['color-basic-1000'] }]} />}
                            </View>}
                            <View style={{ justifyContent: 'center', width: convertWidth(200) }}>
                                <Text category='h5' style={styles.textValue} numberOfLines={2}>
                                    {customerPropertyName.value ? customerPropertyName.value : I18n.t('name_not_available')}
                                </Text>
                                <Text>{(ward.value && ward.value.name) ? ward.value.name : I18n.t('ward_not_available')}</Text>
                            </View>
                            <View style={{ flex: 0.5 }}>
                            </View>
                        </View>}
                    <View style={styles.secondViewContainer}>
                        {renderElements({ renderObjs })}
                    </View>
                </TouchableOpacity>
            </AnimatedCard >
        );
    }

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View>
            : <View />
    );

    const onRefresh = () => {
        if (Object.keys(filters).length === 0) {
            loadCompletedSurveys({ reset: true });
        } else {
            loadCompletedSurveys({ reset: true, filter: true });
        }
    }

    const onEndReached = () => {
        if (Object.keys(filters).length === 0) {
            loadCompletedSurveys({ reset: false });
        } else {
            loadCompletedSurveys({ reset: false, filter: true });
        }
    };

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
            color: theme['color-basic-600']
        },
        card: {
            alignSelf: 'stretch',
            flex: 1,
            borderColor: theme['color-info-500'],
            margin: convertWidth(6),
            borderLeftWidth: convertWidth(7),
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
        emptyList: {
            alignItems: 'center',
            paddingTop: 10
        },
        secondViewContainer: {
            paddingVertical: 10
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
        userIcon: {
            width: convertWidth(45),
            height: convertWidth(45),
            marginRight: convertWidth(10),
            borderRadius: convertWidth(45 / 2)
        },
        textValue: {
            fontWeight: "bold",
            paddingBottom: convertHeight(3),
            flexShrink: 1
        },
        serviceIcon: {
            color: theme['color-primary-400'],
            width: convertHeight(25),
            height: convertHeight(25)
        },
        qrIcon: {
            color: theme['color-primary-400'],
            width: convertHeight(22),
            height: convertHeight(22)
        },
        filterBtn: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: convertWidth(8),
            height: convertHeight(37),
            bottom: convertHeight(10),
            borderRadius: convertWidth(5),
            borderWidth: 1,
            elevation: 5,
            backgroundColor: theme['color-basic-200']
        },
        titleText: {
            color: theme['text-black-color'],
            marginTop: 5
        },
        closeBtnIcon: {
            width: convertHeight(25),
            height: convertHeight(25),
            marginRight: convertWidth(0),
            color: theme['color-danger-500']
        },
        iconBadgeStyle: {
            minWidth: convertWidth(16),
            width: convertWidth(16),
            height: convertHeight(16),
            backgroundColor: '#F00',
            top: convertHeight(-8),
            left: convertWidth(5)
        },
        pullToRefresh: {
            height: convertHeight(25),
            backgroundColor: theme['color-basic-transparent-200'],
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        }
    });


    return (
        <SafeAreaView>
            <Header title={I18n.t(label)} />
            {!_.isEmpty(data) &&
                <View style={styles.pullToRefresh}>
                    <Icon name="arrow-down" pack="material-community" style={{ height: convertHeight(14), margin: convertWidth(5) }} />
                    <Text category="h5">{I18n.t('pullToRefresh')}</Text>
                </View>}
            <View pointerEvents={refreshing ? 'none' : 'auto'} style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item) => item.id}
                    onRefresh={() => onRefresh()}
                    refreshing={refreshing}
                    ListEmptyComponent={emptyList}
                    onEndReached={() => onEndReached()}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => <View style={{ height: convertHeight(60) }} />}
                />
            </View>
            <TouchableOpacity onPress={() => {
                navigateToSurveyFilter({
                    listViewKeys: label === 'enrollment_history' ? CUSTOMER_ENROLLMNET_UI_KEYS : SERVICE_EXECUTION_UI_KEYS
                })
            }} activeOpacity={0.8} style={[styles.floatingBtnStyle, { bottom: convertHeight(20), width: convertHeight(37), borderColor: Object.keys(filters).length != 0 ? theme['color-danger-500'] : theme['color-info-500'] }]}>
                <Icon name={Object.keys(filters).length != 0 ? 'filter-remove' : 'filter-menu'} pack="material-community" style={[styles.iconStyle, {
                    marginRight: convertWidth(0),
                    color: Object.keys(filters).length != 0 ? theme['color-danger-500'] : theme['color-info-500']
                }]} />
                {Object.keys(filters).length != 0 &&
                    <View style={{ position: 'absolute', top: convertHeight(5) }}>
                        <IconBadge
                            BadgeElement={
                                <Text appearance='alternative' category='c2'>{Object.keys(filters).length}</Text>
                            }
                            IconBadgeStyle={styles.iconBadgeStyle}
                        />
                    </View>}
            </TouchableOpacity>
            <OverlayModal visible={showDownloadingSurveyDataModal}>
                <Icon
                    fill='#4C5869'
                    name='cloud-download-outline'
                    style={
                        {
                            marginRight: convertWidth(8),
                            width: convertHeight(22),
                            height: convertHeight(22),
                        }
                    }
                />
                <Text style={{ flexShrink: 1 }} numberOfLines={1}>{I18n.t('downloading_survey_data')}</Text>
            </OverlayModal>
            <OverlayModal visible={startServiceEnrollmentDataModal}>
                <Icon
                    fill='#4C5869'
                    name='cloud-download-outline'
                    style={
                        {
                            marginRight: convertWidth(8),
                            width: convertHeight(22),
                            height: convertHeight(22),
                        }
                    }
                />
                <Text style={{ flexShrink: 1 }} numberOfLines={1}>{I18n.t('start_service_enrollment')}</Text>
            </OverlayModal>
            <Modal visible={infoMessage}
                message={I18n.t(infoMessage)}
                onOk={clearSurveyDataFetchMessage}
            />
        </SafeAreaView>
    );
};

export default SurveyDoneView;
