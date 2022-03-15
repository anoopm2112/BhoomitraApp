import React from 'react';
import Slider from '@react-native-community/slider';
import { StyleSheet } from 'react-native';

export default ({ style, ...rest }) => {
    return (
        <Slider
            style={{ ...styles.dimensions, ...style }}
            minimumValue={0}
            maximumValue={100}
            maximumTrackTintColor="rgb(214, 196, 255)"
            minimumTrackTintColor="rgb(18, 111, 255)"
            thumbImage={null}
            {...rest}
        />
    );
};

const styles = StyleSheet.create({
    dimensions: {
        flex: 0.98
    }
});
