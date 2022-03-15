import React from 'react';
import { Text, Button, Modal, useTheme } from '@ui-kitten/components';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import { window, dimensionUtils } from '../utils';
import I18n from '../i18n';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const { convertWidth, convertHeight } = dimensionUtils;

const contentWidth = window.width - 40;
const singleBtnWidth = convertWidth(120);
const btnWidth = convertWidth(120);

const ModalComponent = props => {
    const theme = useTheme();
    // type: confirm for confirm dialog, else default to notification type
    const { visible = false, type, message, onOk, onCancel, okText, cancelText, okDisabled, okDisabledText, status = 'primary', close } = props || {};
    const isConfirmModal = type ? type === 'confirm' : false;
    return (
        <Modal visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={onCancel}>
            <Card style={styles.content}>
                {close && <TouchableOpacity onPress={close} style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <IconAntDesign name="closecircleo" size={convertHeight(24)} color={theme['text-black-color']} />
                </TouchableOpacity>}
                <Text numberOfLines={2} style={styles.message}>{message}</Text>
                <View style={{ ...styles.btnView, justifyContent: isConfirmModal ? 'space-evenly' : 'center' }}>
                    {isConfirmModal &&
                        <Button status={status} appearance='outline' size='small' style={styles.btn} onPress={onCancel}>
                            {cancelText || I18n.t('cancel')}
                        </Button>
                    }
                    {
                        okDisabled ?
                            <Button disabled size='small' status={status}
                                style={{ ...styles.btn, width: isConfirmModal ? btnWidth : singleBtnWidth }}>
                                {okDisabledText || I18n.t('ok')}
                            </Button> :
                            <Button onPress={onOk} size='small' status={status}
                                style={{ ...styles.btn, width: isConfirmModal ? btnWidth : singleBtnWidth }}>
                                {okText || I18n.t('ok')}
                            </Button>
                    }
                </View>
            </Card>
        </Modal>
    )
};

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

export default ModalComponent;

