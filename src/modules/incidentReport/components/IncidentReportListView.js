import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, FlatList } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import { View as AnimatedView } from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import { components, utils, I18n } from '../../../common';
import { AppTour, AppTourSequence, AppTourView } from 'react-native-app-tour';

const { dimensionUtils: { convertHeight, convertWidth }, dateUtils: { convertToLocal } } = utils;
const { Header, Icon, Text, Card, TrackProgress, ScrollableImageView, Modal } = components;

const IncidentReportListView = (props) => {
    const { animationData, incidentReportList: { data = [], refreshing } = {} } = props;
    const { tourData: { appTour } = {} } = props;
    const [appTourTargets, addAppTourTargets] = useState([]);
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const theme = useTheme();
    const isFocused = useIsFocused();
    let addIncidentReportingRef = useRef();

    const showModal = (modal) => {
        toggleModalVisibility(modal);
    };

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isInternetReachable) {
                if (isFocused) {
                    props.fetchIncidentReportList();
                }
            }
        });
    }, [isFocused]);

    useEffect(() => {
        if (isFocused && appTour !== undefined && appTour.addIncidentReport) {
            let appTourSequence = new AppTourSequence();
            appTourTargets.forEach(appTourTarget => {
                appTourSequence.add(appTourTarget);
            });
            AppTour.ShowSequence(appTourSequence);
        }
    }, [isFocused, appTour]);

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
        }
    });

    const emptyList = () => (
        !refreshing ?
            <View style={styles.emptyList}>
                <Text category="h5">{I18n.t('no_data_available')}</Text>
            </View> : <View />
    );

    const renderItem = ({ item }) => {
        return (
            <AnimatedView key={item.id} useNativeDriver animation={animationData ? 'fadeInLeft' : undefined} duration={500}>
                <Card style={{ marginTop: convertHeight(7) }} shadow>
                    <View style={{ borderBottomWidth: 0.5, borderColor: theme['border-basic-lite-color'] }}>
                        <View style={{ paddingTop: convertWidth(10), marginBottom: convertWidth(20) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('incident_id')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.id ? item.id : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('incident_type')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.incidentConfig ? item.incidentConfig : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: convertHeight(7) }}>
                                <View style={styles.keyTextStyle}>
                                    <Text category='h5'>{I18n.t('reported_at')}</Text>
                                </View>
                                <Text category='h5' style={styles.fullColonSpace}>:</Text>
                                <Text category='h5' style={styles.textStyle}>
                                    {item.reportedDate ? convertToLocal(item.reportedDate) : ''} ({item.reportedDate ? moment(item.reportedAt).format('dddd') : ''})
                                </Text>
                            </View>
                            {/* {
                                item.processStatus && item.processStatus.length > 0 &&
                                <View style={{ marginTop: convertHeight(15) }}>
                                    <TrackProgress status={item.processStatus} />
                                </View>
                            } */}
                            {
                                item.photo !== '' &&
                                <View style={{ marginTop: convertHeight(15) }}>
                                    <ScrollableImageView source={item.photo} />
                                </View>
                            }
                        </View>
                    </View>
                </Card>
            </AnimatedView>
        );
    };

    return (
        <>
            <Header title={I18n.t('incidents_list')} />
            <View style={styles.mainContainer}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item) => item.id.toString()}
                    onRefresh={() => props.fetchIncidentReportList()}
                    refreshing={refreshing}
                    ListEmptyComponent={emptyList}
                    ListFooterComponent={() => <View style={{ height: convertHeight(70) }} />}
                />
            </View>
            <TouchableOpacity
                ref={ref => {
                    if (!ref) return;
                    addIncidentReportingRef = ref;
                    let props = {
                        order: 2,
                        title: I18n.t('tap_here_to_report_incident'),
                        outerCircleColor: theme['color-basic-1001'],
                        cancelable: true
                    };
                    if (appTour.addIncidentReport !== undefined && appTour.addIncidentReport) {
                        appTourTargets.push(AppTourView.for(addIncidentReportingRef, { ...props }));
                    }
                }}
                onPress={() => { props.navigateToAddNewIncidentReport(); }}
                activeOpacity={0.8}
                style={[styles.floatingBtnStyle, { bottom: convertHeight(25), width: convertWidth(42), height: convertWidth(42), borderColor: theme['color-basic-600'] }]} >
                <Icon name='plus' pack="material-community" style={[styles.iconStyle, { marginRight: convertWidth(0) }]} />
            </TouchableOpacity>

            <Modal visible={showModalVisibility}
                message={I18n.t('do_you_want_to_cancel_the_incident')}
                type='confirm'
                onCancel={() => showModal(false)}
                onOk={() => {
                    showModal(false);
                }}
            />
        </>
    )
}

export default IncidentReportListView;