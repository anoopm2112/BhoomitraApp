import React from 'react';
import { StyleSheet, View } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';
import _ from 'lodash';
import { Button, Text, Input, Icon, FontelloIcon, Radio, Picker, Textarea, CheckBox, Camera, QRCodeScanner, Location, Dropdown, Datepicker, SearchableDropDown } from '../../../common/components';
import { QUESTION_TYPES, VALIDATION_TYPES } from '../constants';
import { I18n } from '../../../common';
import { convertHeight, convertWidth } from '../../../common/utils/dimensionUtil';
import { toDatePickerFormat, toDatePickerMaxDate } from '../../../common/utils/dateUtil';
import { dfgLock } from '../../../common/locks';
import { NativeDateService } from '@ui-kitten/components';

const updateFormData = ({ field, value, values, setFieldValue, setDataSource, setFieldTouched, dataSource, ...rest }) => {
    if (rest.optionsHavingNoNextRoutes) {
        if (rest.optionsHavingNoNextRoutes.hasOwnProperty(field) && rest.optionsHavingNoNextRoutes[field].includes(value)) {
            rest.setNextButtonLabel(I18n.t('finish'));
        } else {
            rest.setNextButtonLabel(I18n.t('next'));
        }
    }
    if (rest.optionsHavingConnectedQuestions && rest.optionsHavingConnectedQuestions.hasOwnProperty(field) && values[field] !== value) {
        rest.processConnectedQuestions({ question: field, value, values, setFieldValue, setFieldTouched });
    } else {
        setFieldValue(field, value);
    }
    if (!_.isEmpty(dataSource)) {
        setDataSource(dataSource);
    }
}

const optionWithIcon = ({ question, values, errors, setFieldValue, theme, ...rest }) => {
    const { options = [] } = question;
    return (<>
        <View style={styles.optionWithIconView}>
            {
                options.map(option => {
                    const isActive = values[question.id] === option.id;
                    const dataSource = {};
                    if (option.dataSourceName) {
                        dataSource[option.dataSourceName] = option.dataSourceId;
                    }
                    return <Button
                        key={option.id}
                        appearance={isActive ? 'filled' : 'outline'}
                        status={isActive ? 'basic' : 'primary'}
                        accessoryLeft={() => {
                            return getOptionIcon(theme, option.icon1, isActive);
                        }}
                        onPress={() => {
                            updateFormData({ field: question.id, value: option.id, values, setFieldValue, dataSource, ...rest });
                        }}
                        style={styles.optionWithIcon}
                    >
                        {
                            (props) =>
                                <Text {...props} numberOfLines={2}>
                                    {option.name}
                                </Text>
                        }
                    </Button>
                })
            }
        </View>
        <View style={{ flexDirection: 'row' }}>
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> :
                    null
            }
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> :
                    null
            }
        </View></>);
}

const option = ({ question, values, errors, setFieldValue, theme, ...rest }) => {
    const { options = [] } = question;
    return (<>
        <View>
            {
                options.map((option, index) => {
                    const isActive = values[question.id] === option.id;
                    const dataSource = {};
                    if (option.dataSourceName) {
                        dataSource[option.dataSourceName] = option.dataSourceId;
                    }
                    return <View key={option.id} style={index === (options.length - 1) ? styles.optionView : [styles.optionView, { paddingBottom: convertHeight(15) }]}>
                        <Radio
                            checked={isActive}
                            status={'basic'}
                            onChange={() => {
                                updateFormData({ field: question.id, value: option.id, values, setFieldValue, dataSource, ...rest });
                            }}
                        />
                        <Text onPress={() => {
                            updateFormData({ field: question.id, value: option.id, values, setFieldValue, dataSource, ...rest });
                        }} style={styles.optionText} category='s1' numberOfLines={2} status='basic'>
                            {option.name}
                        </Text>
                    </View>
                })
            }
        </View><View style={{ flexDirection: 'row' }}>
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Icon fill={theme['color-danger-500']} style={[styles.alertIcon, { marginRight: convertWidth(13), marginLeft: convertWidth(3) }]} name='alert-circle-outline' /> :
                    null
            }
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> :
                    null
            }
        </View></>);
}

const text = ({ question, values, errors, ...rest }) => {
    let nextElementRef = undefined;
    let currentElementIndex = rest.questionsRequiringRefs.indexOf(question.id);
    if (currentElementIndex >= 0 && currentElementIndex < rest.questionsRequiringRefs.length - 1) {
        nextElementRef = rest.autoFocusRefsMap.current[rest.questionsRequiringRefs[currentElementIndex + 1]];
    }
    const { validations = [] } = question;
    const maxLength = _.find(validations, ['type', VALIDATION_TYPES.IS_PHONE]) ? 10 : undefined;
    return (<Input
        status={(errors[question.id] && rest.touched[question.id]) ? 'danger' : 'basic'}
        value={values[question.id]}
        placeholder={question.placeholder}
        caption={(errors[question.id] && rest.touched[question.id]) ? errors[question.id] : null}
        captionIcon={(errors[question.id] && rest.touched[question.id]) ? (props) => <Icon {...props} name='alert-circle-outline' /> : null}
        onChangeText={rest.handleChange(question.id.toString())}
        onBlur={rest.handleBlur(question.id.toString())}
        ref={ref => rest.autoFocusRefsMap.current[question.id] = ref}
        returnKeyType={nextElementRef ? 'next' : 'done'}
        onSubmitEditing={() => {
            if (nextElementRef) {
                nextElementRef.focus();
            }
        }}
        keyboardType={validations.some(validation => {
            return validation.type === VALIDATION_TYPES.IS_PHONE ||
                validation.type === VALIDATION_TYPES.IS_DIGIT ||
                validation.type === VALIDATION_TYPES.IS_DECIMAL ||
                validation.type === VALIDATION_TYPES.IS_DIGIT_OR_DECIMAL
        }) ? 'numeric' : 'default'}
        blurOnSubmit={nextElementRef ? false : true}
        maxLength={maxLength}
    />);
}

const textarea = ({ question, values, errors, theme, ...rest }) => {
    return (<Textarea
        containerStyle={[styles.textareaContainer, { backgroundColor: theme['color-basic-200'], borderColor: theme['color-basic-300'] }]}
        style={[styles.textarea, { color: theme['text-basic-color'] }]}
        value={values[question.id]}
        onChangeText={rest.handleChange(question.id.toString())}
        onBlur={rest.handleBlur(question.id.toString())}
        status={(errors[question.id] && rest.touched[question.id]) ? 'danger' : 'basic'}
        caption={(errors[question.id] && rest.touched[question.id]) ? <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> : null}
        captionIcon={(errors[question.id] && rest.touched[question.id]) ? <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> : null}
        maxLength={500}
        placeholder={question.placeholder}
        placeholderTextColor={theme['text-hint-color']}
        underlineColorAndroid={'transparent'}
    />);
}

const dropdown = ({ question, values, errors, setFieldValue, theme, ...rest }) => {
    const { options = [] } = question;
    const { Item } = Picker;
    return (
        <Dropdown
            picker={
                <Picker
                    numberOfLines={2}
                    key={values[question.id]}
                    selectedValue={values[question.id]}
                    onValueChange={(value) => {
                        updateFormData({ field: question.id, value, values, setFieldValue, ...rest });
                    }}
                    mode="dropdown"
                >
                    {
                        [
                            <Item key={-1} label={I18n.t('select')} value={undefined} />,
                            ...options.map(option => <Item key={option.id} label={option.name} value={option.id} />)
                        ]
                    }
                </Picker>
            }
            status={(errors[question.id] && rest.touched[question.id]) ? 'danger' : 'basic'}
            caption={(errors[question.id] && rest.touched[question.id]) ? <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> : null}
            captionIcon={(errors[question.id] && rest.touched[question.id]) ? <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> : null}
        />
    );
}

const checkbox = ({ question, values, errors, setFieldValue, theme, ...rest }) => {
    const { options = [] } = question;
    const selectedOptions = values[question.id] || [];
    return (
        <>
            <View>
                {
                    options.map((option, index) => {
                        const isActive = selectedOptions.includes(option.id);
                        return <View key={option.id} style={index === (options.length - 1) ? styles.checkboxView : [styles.checkboxView, { paddingBottom: convertHeight(15) }]}>
                            <CheckBox
                                checked={isActive}
                                status={'basic'}
                                onChange={() => {
                                    const selectedItemIndex = selectedOptions.indexOf(option.id);
                                    if (selectedItemIndex > -1) {
                                        setFieldValue(`${question.id}[${selectedItemIndex}]`, undefined);
                                    } else {
                                        setFieldValue(`${question.id}[${selectedOptions.length}]`, option.id);
                                    }
                                }}
                            />
                            <Text onPress={() => {
                                const selectedItemIndex = selectedOptions.indexOf(option.id);
                                if (selectedItemIndex > -1) {
                                    setFieldValue(`${question.id}[${selectedItemIndex}]`, undefined);
                                } else {
                                    setFieldValue(`${question.id}[${selectedOptions.length}]`, option.id);
                                }
                            }}
                                style={styles.checkboxText} category='s1' numberOfLines={2} status='basic'>
                                {option.name}
                            </Text>
                        </View>
                    })
                }
            </View>
            <View style={{ flexDirection: 'row' }}>
                {
                    (errors[question.id]) ?
                        <Icon fill={theme['color-danger-500']} style={styles.alertIcon} name='alert-circle-outline' /> :
                        null
                }
                {
                    (errors[question.id]) ?
                        <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> :
                        null
                }
            </View>
        </>);
}

const image = ({ question, values, errors, setFieldValue, readOnly, theme, ...rest }) => (
    <>
        <Camera readOnly={readOnly} lock={dfgLock} value={values[question.id]} onImageTaken={(base64) => {
            setFieldValue(question.id, base64);
        }} />
        <View style={{ flexDirection: 'row' }}>
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Icon fill={theme['color-danger-500']} style={[styles.alertIcon, { marginRight: convertWidth(13), marginLeft: convertWidth(3) }]} name='alert-circle-outline' /> :
                    null
            }
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> :
                    null
            }
        </View>
    </>
);

const qrcode = ({ question, values, errors, setFieldValue, theme, setScanQrCodeAppTour, ...rest }) => (
    <>
        <QRCodeScanner onModalOk={() => setScanQrCodeAppTour()} onScanFinish={(response) => {
            setFieldValue(question.id, response);
        }} />
        <View style={{ flexDirection: 'row' }}>
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Icon fill={theme['color-danger-500']} style={[styles.alertIcon, { marginRight: convertWidth(13), marginLeft: convertWidth(3) }]} name='alert-circle-outline' /> :
                    null
            }
            {
                (errors[question.id] && rest.touched[question.id]) ?
                    <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> :
                    null
            }
        </View>
    </>
);

const location = ({ question, values, errors, setFieldValue, theme, ...rest }) => (
    <>
        <Location values={values[question.id]} onGetLocation={(response) => {
            setFieldValue(question.id, response);
        }} />
        <View style={{ flexDirection: 'row' }}>
            {
                (errors[question.id]) ?
                    <Icon fill={theme['color-danger-500']} style={[styles.alertIcon, { marginRight: convertWidth(13), marginLeft: convertWidth(3) }]} name='alert-circle-outline' /> :
                    null
            }
            {
                (errors[question.id]) ?
                    <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> :
                    null
            }
        </View>
    </>
);



const datePicker = ({ question, values, errors, locales, maxDate, setFieldValue, theme, ...rest }) => {
    const localeDateService = new NativeDateService(locales.locale, { i18n: locales, startDayOfWeek: 1 });
    const CalendarIcon = (props) => (
        <Icon {...props} name="calendar" pack="material-community" style={[styles.optionWithIconImage, { color: theme['color-basic-600'] }]} />
    );
    let newDate = new Date();
    const date = values[question.id] ? values[question.id] : new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const dateStringWithTime = toDatePickerFormat(date);
    const maxDateString = toDatePickerMaxDate(maxDate);
    return (
        <Datepicker
            status={(errors[question.id] && rest.touched[question.id]) ? 'danger' : 'basic'}
            placeholder={question.placeholder}
            caption={(errors[question.id] && rest.touched[question.id]) ? errors[question.id] : null}
            captionIcon={(errors[question.id] && rest.touched[question.id]) ? (props) => <Icon {...props} name='alert-circle-outline' /> : null}
            date={new Date(dateStringWithTime)}
            max={new Date(maxDateString)}
            min={new Date(1700, 0, 0)}
            dateService={localeDateService}
            accessoryRight={CalendarIcon}
            placement="bottom"
            onFocus={() => { }}
            onSelect={nextDate => {
                let selectedDate = new Date(Date.UTC(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()));
                setFieldValue(question.id, selectedDate);
            }}
        />
    );
};

const searchableDropdown = ({ question, values, errors, setFieldValue, theme, ...rest }) => {
    const { options = [] } = question;
    return (
        <View>
            <SearchableDropDown
                data={options}
                dataValue={values[question.id]}
                onSelect={(item) => {
                    if (item) {
                        updateFormData({ field: question.id, value: item.id, values, setFieldValue, ...rest });
                    }
                }}
            />
            <View style={{ flexDirection: 'row' }}>
                {
                    (errors[question.id]) ?
                        <Icon fill={theme['color-danger-500']} style={[styles.alertIcon, { marginRight: convertWidth(13), marginLeft: convertWidth(3) }]} name='alert-circle-outline' /> :
                        null
                }
                {
                    (errors[question.id]) ?
                        <Text style={styles.errorText} category='c1' status='danger'>{errors[question.id]}</Text> :
                        null
                }
            </View>
        </View>
    );
};

const getOptionIcon = (theme, icon1, isActive) => {
    return icon1 ?
        <FontelloIcon name={icon1} size={convertWidth(28)} style={{ color: isActive ? theme['color-basic-100'] : theme['color-basic-600'] }} /> :
        <Icon name="image-off" pack="material-community" style={[styles.optionWithIconImage, { color: isActive ? theme['color-basic-100'] : theme['color-basic-600'] }]} />
};

export default getElements = ({ question, index, connectedQuestionsToShow = [], animationData, ...rest }) => (
    question.isConnectedQuestion ?
        connectedQuestionsToShow.includes(question.id) ?
            <AnimatedView
                useNativeDriver
                animation={animationData ? 'fadeInLeft' : undefined}
                duration={500}
                key={question.id}
                style={index !== 0 ? styles.questionView : {}}
                ref={ref => rest.animatedViewRefsMap.current[question.id] = ref}
            >
                {
                    renderElement({ question, ...rest })
                }
            </AnimatedView> : null :
        <View
            key={question.id}
            style={index !== 0 ? styles.questionView : {}}
        >
            {
                renderElement({ question, ...rest })
            }
        </View>
);

const renderElement = ({ question, ...rest }) => (
    <>
        {
            question.showLabel &&
            <Text style={[styles.questionText, { color: rest.theme['text-black-color'] }]} category='label'>{question.question}</Text>
        }
        {
            question.type === QUESTION_TYPES.OPTION_WITH_ICON && optionWithIcon({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.TEXT && text({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.OPTION && option({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.SEARCHABLE_DROPDOWN && searchableDropdown({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.DROPDOWN && dropdown({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.TEXTAREA && textarea({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.CHECKBOX && checkbox({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.IMAGE && image({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.QR_CODE && qrcode({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.LOCATION && location({ question, ...rest })
        }
        {
            question.type === QUESTION_TYPES.DATE && datePicker({ question, ...rest })
        }
    </>
);

const styles = StyleSheet.create({
    optionWithIconView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    optionWithIcon: {
        width: convertWidth(148),
        height: convertHeight(38),
        paddingRight: convertWidth(30),
        marginBottom: convertHeight(15),
        justifyContent: 'flex-start'
    },
    optionWithIconImage: {
        width: convertWidth(28),
        height: convertWidth(28)
    },
    optionView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionText: {
        flexShrink: 1,
        marginLeft: convertWidth(5)
    },
    textareaContainer: {
        height: convertHeight(180),
        paddingHorizontal: convertWidth(16),
        borderWidth: convertWidth(1),
        borderRadius: convertWidth(5)
    },
    textarea: {
        textAlignVertical: 'top',
        height: convertHeight(170),
        fontSize: convertHeight(14),
        fontFamily: 'Roboto-Medium',
        fontWeight: '500'
    },
    checkboxView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxText: {
        flexShrink: 1,
        marginLeft: convertWidth(5)
    },
    questionView: {
        marginTop: convertHeight(15)
    },
    questionText: {
        marginBottom: convertHeight(10)
    },
    alertIcon: {
        width: convertWidth(10),
        height: convertHeight(10),
        marginRight: convertWidth(8),
        marginTop: convertHeight(8)
    },
    errorText: {
        marginTop: convertHeight(4)
    },
    dropdown: {
        height: convertHeight(40),
        borderWidth: convertWidth(0.5),
        borderRadius: convertWidth(8),
        paddingHorizontal: convertWidth(8),
    },
    inputSearchStyle: {
        height: convertHeight(40),
    }
});
