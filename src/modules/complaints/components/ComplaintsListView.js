import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Platform } from 'react-native';
import { components, I18n, utils } from '../../../common';
import { useTheme } from '@ui-kitten/components';
import _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import { View as AnimatedView } from 'react-native-animatable';
import moment from 'moment';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';

const { dimensionUtils: { convertHeight, convertWidth }, dateUtils: { convertToLocal } } = utils;
const { SafeAreaView, Text, Icon, Card, Modal, TrackProgress, Header, ScrollableImageView } = components;

const ComplaintsListView = (props) => {
    const { animationData, allComplaints: { data = [], refreshing } = {} } = props;
    const { tourData: { appTour } = {} } = props;
    const [appTourTargets, addAppTourTargets] = useState([]);
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const [complaintId, setComplaintId] = useState();
    const isFocused = useIsFocused();
    let addComplaintRef = useRef();

    const showModal = (modal) => {
        toggleModalVisibility(modal);
    };

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.getAllComplaints();
                }
            }
        });
    }, [isFocused]);


    useEffect(() => {
        if (isFocused && appTour !== undefined && appTour.addComplaint) {
            let appTourSequence = new AppTourSequence();
            appTourTargets.forEach(appTourTarget => {
                appTourSequence.add(appTourTarget);
            });
            AppTour.ShowSequence(appTourSequence);
        }
    }, [isFocused, appTour]);

    const renderItem = ({ item }) => {
        return (
            <AnimatedView key={item.id} useNativeDriver animation={animationData ? 'fadeInLeft' : undefined} duration={500}>
                <Card style={{ marginTop: convertHeight(7), marginHorizontal: convertWidth(5) }} shadow>
                    <View style={{ paddingHorizontal: convertWidth(13), borderBottomWidth: 0.5, borderColor: theme['border-basic-lite-color'] }}>
                        <View style={{ paddingTop: convertWidth(10), marginBottom: convertWidth(10) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('complaint_id')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.complaintId ? item.complaintId : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('complaint_type')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.complaintConfigLabel ? item.complaintConfigLabel : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('reported_at')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.reportedAt ? convertToLocal(item.reportedAt) : ''} ({item.reportedAt ? moment(item.reportedAt).format('dddd') : ''})
                                </Text>
                            </View>
                            {
                                item.processStatus && item.processStatus.length > 0 &&
                                <View style={{ marginTop: convertHeight(15) }}>
                                    <TrackProgress status={item.processStatus} />
                                </View>
                            }
                            {
                                item.photo !== '' &&
                                <View style={{ marginTop: convertHeight(15) }}>
                                    <ScrollableImageView source={item.photo} />
                                </View>
                            }
                        </View>
                        {
                            item.status !== undefined && item.status.name === 'Raised' &&
                            <View style={{ alignItems: 'flex-end', paddingBottom: convertWidth(15) }}>
                                <TouchableOpacity onPress={() => { setComplaintId(item.complaintId); showModal(true); }}>
                                    <Icon name="trash-can" pack="material-community" style={styles.deleteIcon} />
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </Card>
            </AnimatedView>
        );
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
            margin: convertWidth(6),
        },
        mainContainer: {
            padding: 7,
            flex: 1
        },
        emptyList: {
            alignItems: 'center',
            paddingTop: 10
        },
        textStyle: {
            flexWrap: 'wrap',
            flex: 1,
            textAlign: 'left',
            fontSize: convertWidth(14)
        },
        iconStyle: {
            width: convertHeight(25),
            height: convertHeight(25),
            marginRight: convertWidth(5),
            color: theme['color-basic-600']
        },
        viewStyle: {
            borderRadius: convertWidth(5),
            backgroundColor: '#fff',
            paddingTop: convertHeight(13),
            borderLeftWidth: convertWidth(7),
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
        fullColonSpace: {
            paddingHorizontal: convertWidth(5)
        },
        keyTextStyle: {
            width: convertWidth(125)
        },
        deleteIcon: {
            color: theme['color-danger-500'],
            width: convertHeight(25),
            height: convertHeight(25)
        },
    });
    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> : <View />
    );

    return (
        <SafeAreaView>
            <Header title={I18n.t('customer_complaints')} />
            <View style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item) => item.complaintId.toString()}
                    onRefresh={() => props.getAllComplaints()}
                    refreshing={refreshing}
                    ListEmptyComponent={emptyList}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => <View style={{ height: convertHeight(70) }} />} />
            </View>
            <TouchableOpacity
                ref={ref => {
                    if (!ref) return;
                    addComplaintRef = ref;
                    let props = {
                        order: 2,
                        title: I18n.t('tap_here_to_raise_complaint'),
                        outerCircleColor: theme['color-basic-1001'],
                        cancelable: true
                    };
                    if (appTour.addComplaint !== undefined && appTour.addComplaint) {
                        appTourTargets.push(AppTourView.for(addComplaintRef, { ...props }));
                    }
                }}
                onPress={() => { props.newComplaint(); }}
                activeOpacity={0.8}
                style={[styles.floatingBtnStyle, { bottom: convertHeight(25), width: convertWidth(42), height: convertWidth(42), borderColor: theme['color-basic-600'] }]}>
                <Icon name='plus' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(0) }]} />
            </TouchableOpacity>

            <Modal visible={showModalVisibility}
                message={I18n.t('do_you_want_to_cancel_the_complaint')}
                type='confirm'
                onCancel={() => showModal(false)}
                onOk={() => {
                    showModal(false);
                    props.deleteComplaint(complaintId);
                }}
            />
        </SafeAreaView>
    );
};

export default ComplaintsListView;
