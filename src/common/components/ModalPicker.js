import React from 'react';
import { StyleSheet } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { useTheme } from '@ui-kitten/components';

import I18n from '../i18n';

const PADDING = 12;
const FONT_SIZE = 15;

const ModalPicker = (props) => {
    const theme = useTheme();
    const { data, onChange, children, disabled = false } = props;
    return (
        <ModalSelector
            data={data}
            cancelText={I18n.t('cancel')}
            animationType={'fade'}
            backdropPressToClose={true}
            sectionStyle={{ padding: PADDING + 3, borderBottomWidth: 2, borderBottomColor: theme['color-info-transparent-100'] }}
            sectionTextStyle={[styles.primaryTextBold, { fontSize: FONT_SIZE, color: theme['text-basic-color'] }]}
            cancelStyle={{ padding: PADDING, backgroundColor: theme['color-basic-200'] }}
            cancelTextStyle={[styles.primaryText, { fontSize: FONT_SIZE + 2, color: theme['text-header1-color'] }]}
            optionContainerStyle={{ backgroundColor: theme['color-basic-200'], borderRadius: 7 }}
            cancelContainerStyle={{ backgroundColor: theme['color-basic-200'], borderRadius: 7 }}
            optionStyle={{ padding: PADDING, borderBottomWidth: 1, borderBottomColor: theme['color-info-transparent-100'] }}
            optionTextStyle={[styles.primaryText, { fontSize: FONT_SIZE + 2, color: theme['color-info-500'] }]}
            onModalClose={option => {
                if (option.hasOwnProperty('key')) // workaround for ios https://github.com/peacechen/react-native-modal-selector/issues/140
                    onChange(option);
            }}
            disabled={disabled}>
            {
                children
            }
        </ModalSelector>
    );
};

const styles = StyleSheet.create({
    primaryTextBold: {
        fontFamily: 'Montserrat-SemiBold'
    },
    primaryText: {
        fontFamily: 'Montserrat-Regular'
    }
});

export default ModalPicker;
