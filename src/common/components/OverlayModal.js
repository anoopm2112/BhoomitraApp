import React from 'react';
import { Modal } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import Card from './Card';
import { window, dimensionUtils } from '../utils';

const { convertWidth, convertHeight } = dimensionUtils;

const contentWidth = window.width - 40;

const OverlayModalComponent = props => {
    const { visible = false, children, onCancel } = props || {};
    return (
        <Modal onBackdropPress={onCancel} visible={visible}
            backdropStyle={styles.backdrop}>
            <Card style={styles.content}>
                {children}
            </Card>
        </Modal>
    )
};

const styles = StyleSheet.create({
    content: {
        width: contentWidth,
        paddingHorizontal: convertWidth(10),
        paddingVertical: convertHeight(10),
        flexDirection: 'row',
        justifyContent: 'center'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
});

export default OverlayModalComponent;