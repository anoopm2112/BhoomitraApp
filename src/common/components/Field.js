import React from 'react';
import { StyleSheet, Platform, Keyboard, View } from 'react-native';
import { Field } from 'redux-form';
import { useTheme, Input, Text, Icon, Select, SelectItem, IndexPath, Autocomplete, AutocompleteItem } from '@ui-kitten/components';
import ModalPicker from './ModalPicker';
import I18n from '../i18n';
import { arrayUtils } from '../utils';

const showEvent = Platform.select({
    android: 'keyboardDidShow',
    default: 'keyboardWillShow',
});

const hideEvent = Platform.select({
    android: 'keyboardDidHide',
    default: 'keyboardWillHide',
});

const filterData = (query = '', data = []) => {
    if (query && query.trim()) {
        return (data || []).filter(item => item.label ? item.label.toLowerCase().includes(query.toLowerCase()) : false)
    }
    return data;
}

const renderField = ({ input, meta: { touched, error, warning }, type, ...rest }) => {
    const theme = useTheme();
    let hasError = false;
    if (typeof error !== 'undefined') {
        hasError = true;
    }
    if (type === 'input') {
        const { onChange, ...inputProps } = input;
        const [value, setValue] = React.useState('');
        React.useEffect(() => {
            setValue(input.value || '');
        }, [input.value || '']);

        return (<Input
            {...rest}
            {...inputProps}
            value={value}
            onChangeText={v => {
                onChange(v);
                setValue(v);
            }}
            status={hasError && touched ? 'danger' : !hasError && touched ? 'success' : 'primary'}
            caption={evaProps => {
                return (hasError && touched ? <Text {...evaProps} >{error}</Text> : <Text />);
            }
            }
        // captionIcon={evaProps => {
        //     return (hasError && touched ? <Icon {...evaProps} name="alert-triangle-outline" /> : null);
        // }
        // }
        />);
    } else if (type === 'dropdown') {
        const status = hasError && touched ? 'danger' : !hasError && touched ? 'success' : 'primary';
        const { onChange, value } = input;
        //Expected data format [ { label: 'label', value: ''} ]
        const { data = [], label, triggerOnChange } = rest || {};
        let selectDataset = (data || []).map(x => x.label);
        let selectedIndex = value ? ((data || []).findIndex(x => x.value === value)) : null;
        return (
            <>
                <Text style={styles.selectLabel}>{label}</Text>
                <Select
                    // label={evaProps => (<Text status={'primary'} style={[evaProps.style, styles.selectLabel]}>{label}</Text>)}
                    caption={evaProps => (hasError && touched ? <Text {...evaProps}>{error}</Text> : <Text />)}
                    style={styles.select}
                    selectedIndex={selectedIndex != null ? new IndexPath(selectedIndex) : null}
                    value={selectedIndex != null ? data[selectedIndex].label : null}
                    placeholder={evaProps => <Text {...evaProps}>{I18n.t('select')}</Text>}
                    onSelect={index => {
                        let value = data[index.row].value;
                        if (triggerOnChange && triggerOnChange instanceof Function) triggerOnChange(value);
                        onChange(value);
                    }}
                    status={status}>
                    {selectDataset.map((x, index) => <SelectItem key={index} title={evaProps => <Text {...evaProps}>{x}</Text>} />)}
                </Select>
            </>
        );
    } else if (type === 'autocomplete') {
        const status = hasError && touched ? 'danger' : !hasError && touched ? 'success' : 'primary';
        const { onChange, value } = input;
        //Expected data format [ { label: 'label', value: ''} ]
        const { data = [], label, triggerOnChange } = rest || {};

        const [dataset, setDataset] = React.useState(data);
        React.useEffect(() => {
            setDataset(data);
        }, [data]);

        const [placement, setPlacement] = React.useState('bottom');
        React.useEffect(() => {
            const keyboardShowListener = Keyboard.addListener(showEvent, () => {
                setPlacement('top');
            });

            const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
                setPlacement('bottom');
            });

            return () => {
                keyboardShowListener.remove();
                keyboardHideListener.remove();
            };
        });

        let selectDataset = (dataset || []).map(x => x.label);
        let selectedIndex = value ? ((dataset || []).findIndex(x => x.value === value)) : null;
        return (
            <View style={{ alignSelf: 'stretch' }}>
                <Text style={styles.selectLabel}>{label}</Text>
                <Autocomplete
                    caption={evaProps => (hasError && touched ? <Text {...evaProps}>{error}</Text> : <Text />)}
                    style={styles.underlined}
                    value={selectedIndex != null ? dataset[selectedIndex].label : null}
                    placeholder={I18n.t('select')}
                    placement={placement}
                    onChangeText={query => setDataset(filterData(query, data))}
                    onSelect={index => {
                        let value = dataset[index].value;
                        if (triggerOnChange && triggerOnChange instanceof Function) triggerOnChange(value);
                        onChange(value);
                    }}
                    status={status}>
                    {selectDataset.map((x, index) => <AutocompleteItem key={index} title={x} />)}
                </Autocomplete>
            </View >
        );
    } else if (type === 'modalpicker') {
        let { placeholder, data, label, triggerOnChange, disabled = false } = rest || {};
        const status = hasError && touched ? 'danger' : !hasError && touched ? 'success' : 'primary';
        let statusColor = theme['color-primary-default'];
        if (status === 'success') {
            statusColor = theme['color-success-default'];
        } else if (status === 'danger') {
            statusColor = theme['color-danger-default'];
        }
        let valueStyle = {
            fontSize: 14, //theme['text-label-font-size'],
            fontFamily: 'Montserrat-Regular', //theme['text-label-font-family'],
            fontWeight: '500', //theme['text-label-font-weight']
        };
        return (
            <View style={[{ borderColor: statusColor }, styles.modalPickerView, hasError && touched && { marginBottom: 30 }]}>
                <Text style={[styles.selectLabel, { marginBottom: 5 }]}>{label || placeholder}</Text>
                <ModalPicker
                    data={data}
                    onChange={item => {
                        if (triggerOnChange && triggerOnChange instanceof Function) triggerOnChange(item.value);
                        input.onChange(item.value);
                    }}
                    disabled={disabled}>
                    <View style={{ flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.modalPickerText, valueStyle, (!input || !input.value) && { color: theme['text-hint-color'] }]}>
                            {arrayUtils.getFilterLabel(data, input && input.value) || `${I18n.t('select')} ${placeholder || label}`}
                        </Text>
                        <Icon name='chevron-down-outline' fill={theme['color-primary-default']} style={{ width: 25, height: 25, opacity: 0.8 }} />
                    </View>
                </ModalPicker>
                {touched && error && <Text style={[styles.selectLabel, {
                    //fontSize: theme['text-caption-1-font-size'],
                    fontWeight: 'normal', //theme['text-caption-1-font-weight'],
                    fontFamily: 'Poppins-Regular', //theme['text-caption-1-font-family'],
                    fontSize: 12,
                    paddingVertical: 5,
                    color: statusColor
                }]}>{error}</Text>}
            </View>
        );
    } else {
        return <></>;
    }
};

export default ({ autoCapitalize = 'none', autoCorrect = false, secureTextEntry = false, mode = 'underlined', style = {}, ...props }) => {
    if (mode === 'underlined') {
        style = {
            ...style,
            ...styles.underlined
        };
    }
    return (
        <Field {...props} autoCapitalize={autoCapitalize} autoCorrect={autoCorrect} secureTextEntry={secureTextEntry} mode={mode} component={renderField} style={style} />
    );
};

const styles = StyleSheet.create({
    underlined: {
        ...Platform.select({
            ios: {
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRadius: 0
            },
            android: {
                // Unsupported because setting border right and left color is unsupported in
                // react native as of now
            },
        }),
    },
    select: {
        flex: 1,
        alignItems: 'flex-start'
    },
    selectLabel: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'flex-start',
        paddingBottom: 5
    },
    modalPickerView: {
        marginTop: 2,
        marginBottom: 20,
        // borderWidth: 1,
        ...Platform.select({
            ios: {
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderLeftColor: 'transparent'
            },
            android: {
                borderRadius: 13,
                paddingHorizontal: 5
            }
        }),
        flex: 1,
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
        height: 55
    },
    modalPickerText: {
        alignSelf: 'flex-start',
        textAlign: 'left'
    }
});
