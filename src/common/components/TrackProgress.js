import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { dimensionUtils } from '../utils';
import { useTheme, Text } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const { convertHeight, convertWidth } = dimensionUtils;

const TrackProgress = (props) => {
    const { status = [] } = props;
    const [duplicateValue, checkDuplicateValue] = useState(0);
    const theme = useTheme();

    useEffect(() => {
        if (status.length > 0) {
            status.map((item, index) => {
                var keys = Object.keys(item);
                var filtered = keys.filter(function (key) {
                    return item[key] === true;
                });
                if (filtered.length === 2) {
                    checkDuplicateValue(filtered.length);
                }
            });
        }
    }, []);

    const styles = StyleSheet.create({
        viewContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    });

    const renderItem = ({ item, index }) => {
        return (
            <>
                {duplicateValue !== 2 &&
                    <View style={styles.viewContainer} key={index}>
                        <Text category='h5' style={{ fontSize: convertWidth(14), width: convertHeight(80) }}>
                            {item.date ? moment(item.date).format("DD/MM/YYYY").split('T') : ''}
                        </Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {item.tick &&
                                <>
                                    <MaterialCommunityIcons name="check-circle" color={theme['color-basic-600']} size={convertHeight(20)} />
                                    {
                                        status[index + 1] &&
                                        <View style={{ width: convertHeight(2), height: convertHeight(15), backgroundColor: theme['color-basic-600'] }} />
                                    }
                                </>
                            }
                            {
                                item.circle &&
                                <MaterialCommunityIcons name="progress-clock" color={theme['color-basic-600']} size={convertHeight(20)} />
                            }
                            {
                                item.inActive &&
                                <>
                                    <View style={{ width: convertHeight(2), height: convertHeight(15), backgroundColor: theme['color-basic-transparent-300'] }} />
                                    <MaterialCommunityIcons name="checkbox-blank-circle-outline" color={theme['color-basic-transparent-300']} size={convertHeight(20)} />
                                </>
                            }
                        </View>
                        {
                            item.inActive ?
                                <Text category='h5' style={{ marginTop: convertHeight(15), fontSize: convertWidth(14), width: convertHeight(100) }}>{item.label}</Text> :
                                <Text category='h5' style={{fontWeight:'bold', fontSize: convertWidth(14), width: convertHeight(100) }}>{item.label}</Text>
                        }
                    </View>
                }
            </>
        );
    };

    return (
        <FlatList
            data={status}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => <View style={{ height: convertHeight(10) }} />}
        />
    );

};

export default TrackProgress;

