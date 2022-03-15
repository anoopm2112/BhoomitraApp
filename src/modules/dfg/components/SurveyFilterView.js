import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';
import _ from 'lodash';
import { useTheme } from '@ui-kitten/components';
import * as AnimatedView from 'react-native-animatable';
import { components, utils, I18n } from '../../../common';

const { SafeAreaView, Text, Header, MultiSelectAutoComplete } = components;
const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const SurveyFilterView = (props) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [applyFilter, setApplyFilter] = useState(true);
    const isFocused = useIsFocused();
    const {
        completedSurveys: { filterDropDownData, filters, filterDropdownRefresh },
        setCompletedSurveysFilter, fetchCompletedSurveyFilterDropDownData,
        clearCompleteSurveyFilter, navigateBack, animationData
    } = props;
    const { listViewKeys } = props.route.params.data;
    const buttonsViewRef = useRef();

    const hideButtonsView = (ref, setKeyboardVisible) => {
        setTimeout(() => { setKeyboardVisible(true); }, 100);
        if (animationData) {
            ref.current.fadeOutDown();
        }
    }

    const showButtonsView = (ref) => {
        if (animationData) {
            ref.current.fadeInUp();
        }
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                hideButtonsView(buttonsViewRef, setKeyboardVisible);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                showButtonsView(buttonsViewRef);
            }
        );
        return () => {
            // Anything in here is fired on component unmount.
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        }
    }, []);

    useEffect(() => {
        if (!isFocused) {
            if (!applyFilter) {
                clearCompleteSurveyFilter();
            }
        }
    }, []);

    const handleOnChangeText = (searchKey, searchText) => {
        setApplyFilter(false);
        fetchCompletedSurveyFilterDropDownData({ key: searchKey, value: searchText });
    };

    const handleOnSelectionsChange = (searchKey, selectedItems) => {
        const values = selectedItems.map(selectedItem => selectedItem.value);
        setCompletedSurveysFilter({ [searchKey]: values })
    }

    const applyFilterChanges = () => {
        navigateBack();
        setApplyFilter(true);
    };

    const clearFilterChanges = () => {
        clearCompleteSurveyFilter();
    };

    const theme = useTheme();

    const styles = StyleSheet.create({
        filterBtn: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: convertWidth(18),
            height: convertHeight(37),
            bottom: convertHeight(10),
            borderRadius: convertWidth(5),
            borderWidth: 1,
            elevation: 5,
            backgroundColor: theme['color-basic-200'],
            margin: convertWidth(15)
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
        buttonView: {
            height: convertHeight(60),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: convertWidth(13),
            marginTop: convertHeight(10)
        },
    });

    return (
        <SafeAreaView>
            <Header title={I18n.t('filter')} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ marginBottom: convertHeight(65), paddingHorizontal: convertWidth(13), paddingTop: convertHeight(13) }}>
                    {Object.entries(_.omit(listViewKeys, ['ENROLLMENT_CUSTOMER_IMAGE'])).map(([searchKey, value]) => (
                        <View key={searchKey}>
                            <Text category="c1" style={styles.titleText}>{I18n.t(value)}</Text>
                            <MultiSelectAutoComplete
                                data={filterDropDownData[searchKey]}
                                selectedItems={filters[searchKey] ? filters[searchKey].map(item => ({ label: item, value: item })) : []}
                                triggerLength={3}
                                placeholder={I18n.t('placeholder_filter')}
                                onChangeText={(searchText) => handleOnChangeText(searchKey, searchText)}
                                onSelectionsChange={(selectedItems) => handleOnSelectionsChange(searchKey, selectedItems)}
                                indicator={filterDropdownRefresh.includes(searchKey)}
                                onCloseDropDown={applyFilter}
                            />
                        </View>
                    ))}
                </View>
            </KeyboardAwareScrollView>
            <AnimatedView.View useNativeDriver ref={buttonsViewRef} style={[styles.buttonView, { height: isKeyboardVisible ? 0 : convertHeight(60) }]}>
                <TouchableOpacity onPress={() => clearFilterChanges()} style={[styles.filterBtn, { left: convertWidth(0), borderColor: theme['color-danger-500'], }]}>
                    <Text style={{ flexShrink: 1, color: theme['color-danger-500'] }} numberOfLines={1}>{I18n.t('clear_filter')}</Text>
                </TouchableOpacity>
                {Object.keys(filters).length !== 0 && <TouchableOpacity onPress={() => applyFilterChanges()}
                    style={[styles.filterBtn, {
                        right: convertWidth(0),
                        borderColor: theme['color-basic-600'],
                        backgroundColor: theme['color-basic-100']
                    }]}>
                    <Text style={{ flexShrink: 1, color: theme['color-basic-600'] }} numberOfLines={1}>{'APPLY FILTERS'}</Text>
                </TouchableOpacity>}
            </AnimatedView.View>
        </SafeAreaView>
    );
};

export default SurveyFilterView;
