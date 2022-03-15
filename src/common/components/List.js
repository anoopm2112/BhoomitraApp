import React from 'react';
import { StyleSheet } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import I18n from '../i18n';
import { convertHeight } from '../utils/dimensionUtil';

export default (props) => (<List
    {...props}
    ListEmptyComponent={() => <Text category='s2' style={styles.textDesc}>{I18n.t('no_data_available')}</Text>}
/>);

const styles = StyleSheet.create({
    textDesc: {
        alignSelf: 'center',
        marginTop: convertHeight(5)
    }
});