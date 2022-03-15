import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, Keyboard
} from 'react-native';
import SelectMultiple from 'react-native-select-multiple';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Text } from '../components';
import { useTheme } from '@ui-kitten/components';
import { dimensionUtils } from '../utils';

const { convertHeight, convertWidth } = dimensionUtils;

const MultiSelectAutoComplete = ({ data = [], selectedItems = [], triggerLength = 1,
    onChangeText, placeholder = "", onSelectionsChange, indicator, onCloseDropDown }) => {
    const [items, setItems] = useState([]);
    const [showDropDown, setShowDropDown] = useState(false);
    const InputRef = useRef();

    useEffect(() => {
        if (data.length > 0) {
            setItems(data);
        }
        if (items && items.length > 0) {
            setShowDropDown(true);
        } else {
            setShowDropDown(false);
        }
    }, [data, items]);

    useEffect(() => {
        if (onCloseDropDown === true) {
            setShowDropDown(false);
        }
    });

    const handleOnChangeText = (searchText) => {
        if (searchText && searchText.length >= triggerLength) {
            onChangeText && onChangeText(searchText);
        } else {
            setShowDropDown(false);
        }
    };

    const handleDeleteItem = id => {
        const filteredData = selectedItems.filter(item => item.value !== id);
        onSelectionsChange && onSelectionsChange(filteredData);
    };

    const renderIcon = () => (
        <ActivityIndicator size='small' animating={indicator} color='#AAA' />
    );

    const theme = useTheme();

    const styles = StyleSheet.create({
        mainContainer: {
            marginTop: convertWidth(5)
        },
        renderLabel: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        submitButton: {
            height: convertHeight(40),
            backgroundColor: 'green',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5
        },
        btnText: {
            color: '#FFF',
            fontWeight: 'bold'
        },
        selectedItemContainer: {
            marginTop: convertHeight(7),
            marginRight: convertWidth(4),
            flexDirection: 'row',
            height: convertHeight(30),
            width: convertWidth(110),
            backgroundColor: theme['color-success-transparent-300'],
            borderRadius: convertWidth(5),
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: convertWidth(5)
        }
    });

    return (
        <View style={styles.mainContainer}>
            <Input
                ref={InputRef}
                onChangeText={(searchText) => handleOnChangeText(searchText)}
                placeholder={placeholder}
                accessoryRight={renderIcon} />
            {showDropDown && <View style={{ borderWidth: 1, borderColor: "#F0F0F0", borderRadius: 5 }}>
                <SelectMultiple
                    items={items.map((option) => ({ label: option.name, value: option.id }))}
                    selectedItems={selectedItems}
                    flatListProps={{
                        keyboardShouldPersistTaps: 'handled'
                    }}
                    onSelectionsChange={(selectedItems) => {
                        InputRef.current.clear();
                        Keyboard.dismiss();
                        onSelectionsChange && onSelectionsChange(selectedItems);
                    }}
                    rowStyle={{ height: convertHeight(10), borderRadius: 3 }}
                    selectedRowStyle={{ backgroundColor: theme['color-success-transparent-100'] }}
                    selectedLabelStyle={{ fontWeight: 'bold', color: theme['color-success-500'], fontSize: convertHeight(15) }}
                    selectedCheckboxStyle={{ tintColor: theme['color-success-500'] }}
                    labelStyle={{ color: theme['text-black-color'], fontSize: convertHeight(16) }}
                    checkboxStyle={{ tintColor: theme['text-black-color'] }}
                />
            </View>}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={selectedItems}
                renderItem={({ item }) => (
                    <View key={item.value} style={styles.selectedItemContainer}>
                        <Text numberOfLines={1} style={{ width: convertWidth(70), fontWeight: 'bold', color: theme['text-black-color'] }}>{item.label}</Text>
                        <TouchableOpacity onPress={() => {
                            handleDeleteItem(item.value);
                        }}>
                            <MaterialCommunityIcons name="close-circle" size={18} color={theme['text-black-color']} />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.value}
            />
        </View>
    );
};

export default MultiSelectAutoComplete;
