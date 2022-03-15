import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '@ui-kitten/components';
import I18n from '../i18n';
import * as utils from '../utils';

const { dimensionUtils: { convertHeight, convertWidth } } = utils;

const SearchableDropDown = ({ data, onSelect, dataValue }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(dataValue);

    useEffect(() => {
        if (dataValue) {
            setValue(dataValue);
        }
    }, [dataValue]);

    const Styles = StyleSheet.create({
        dropDown: {
            borderColor: theme['color-basic-300'],
            backgroundColor: theme['color-basic-200'],
            fontSize: convertHeight(14),
            height: convertHeight(45),
        },
        dropDownContainer: {
            borderColor: theme['color-basic-300'],
            fontSize: convertHeight(14)
        },
        placeholder: {
            color: theme['text-placeholder-color'],
            fontSize: convertHeight(14),
        }
    });

    return (
        <DropDownPicker
            flatListProps={{
                keyboardShouldPersistTaps: 'handled'
            }}
            listMode="SCROLLVIEW"
            placeholder={I18n.t('please_select_option')}
            searchPlaceholder={I18n.t('placeholder_filter')}
            searchable
            style={Styles.dropDown}
            dropDownContainerStyle={Styles.dropDownContainer}
            placeholderStyle={Styles.placeholder}
            textStyle={{ fontSize: convertHeight(14) }}
            dropDownMaxHeight={convertHeight(240)}
            open={open}
            value={value}
            items={data}
            setOpen={setOpen}
            setValue={setValue}
            schema={{ label: 'name', value: 'id' }}
            onSelectItem={(item) => onSelect(item)}
            ListEmptyComponent={({
                listMessageContainerStyle, listMessageTextStyle, ActivityIndicatorComponent, loading, message
            }) => (
                <View style={listMessageContainerStyle}>
                    {loading ? (
                        <ActivityIndicatorComponent />
                    ) : (
                            <Text style={listMessageTextStyle}>
                                {I18n.t('no_result')}
                            </Text>
                        )}
                </View>
            )}
        />
    );
}

export default SearchableDropDown;