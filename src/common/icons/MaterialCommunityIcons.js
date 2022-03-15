import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MaterialCommunityIconsPack = {
    name: 'material-community',
    icons: createIconsMap()
};

function createIconsMap() {
    return new Proxy({}, {
        get(target, name) {
            return IconProvider(name);
        },
    });
}

function IconProvider(name) {
    return {
        toReactElement: (props) => MaterialCommunityIcon({ name, ...props }),
    };
}

function MaterialCommunityIcon(props) {
    const { name, style = {} } = props;
    const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
    return (
        <Icon
            name={name}
            size={height}
            color={tintColor}
            style={iconStyle}
        />
    );
}

export default MaterialCommunityIconsPack;
