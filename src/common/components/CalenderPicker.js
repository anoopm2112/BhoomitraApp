import React, { useEffect } from 'react';
import { Modal } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { window, dimensionUtils } from '../utils';
import { LANGUAGES } from '../constants';
import _ from 'lodash';
import { useTheme } from '@ui-kitten/components';

const { convertWidth, convertHeight } = dimensionUtils;
const contentWidth = window.width - 40;
const btnWidth = convertWidth(120);

const CalenderComponent = props => {
    const { locale } = props;
    // type: confirm for confirm dialog, else default to notification type
    const { visible = false, type, message, onOk, onCancel, okText, cancelText, status = 'primary',
        current, minDate, maxDate, markedDates, onDaySelect
    } = props || {};

    const isConfirmModal = type ? type === 'confirm' : false;

    useEffect(() => {
        const locales = _.find(LANGUAGES, function (o) { return o.locale === locale; });
        LocaleConfig.locales['en'] = locales;
        LocaleConfig.defaultLocale = 'en';
    }, []);

    const theme = useTheme();

    const styles = StyleSheet.create({
        content: {
            width: contentWidth,
            paddingHorizontal: convertWidth(10),
            paddingVertical: convertHeight(20)
        },
        message: {
            textAlign: 'center',
            flexShrink: 1
        },
        backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        btnView: {
            marginTop: convertHeight(25),
            flexDirection: 'row'
        },
        btn: {
            width: btnWidth
        }
    });

    return (
        <Modal visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={onCancel}>
            <Calendar
                onDayPress={(day) => { onDaySelect(day) }}
                // Collection of dates that have to be marked. Default = {}
                markedDates={markedDates}
                current={current}
                minDate={minDate}
                maxDate={maxDate}
                style={{
                    borderWidth: convertWidth(2),
                    borderColor: theme['color-basic-600'],
                }}
                theme={{
                    selectedDayBackgroundColor: theme['color-basic-600'],
                    arrowColor: theme['color-basic-600'],
                    indicatorColor: theme['color-basic-600'],
                    todayTextColor: theme['color-basic-600'],
                }}
            />
        </Modal>
    );
};

export default CalenderComponent;
