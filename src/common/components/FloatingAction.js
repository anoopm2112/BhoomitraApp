import React from 'react';
import _ from 'lodash';
import { FloatingAction as FloatingActionLib } from "react-native-floating-action";
import { useTheme } from '@ui-kitten/components';

const FloatingAction = ({ color, actions = [], floatingIcon }) => {
    const defaultThemeColor = theme['color-basic-600'];
    const defaultItemProps = {
        color: defaultThemeColor
    };
    const theme = useTheme();
    // pass ItemClick action in actions[] as onPress: () => func(data)

    actions = actions.map(item => ({ ...defaultItemProps, ...item }));
    return <FloatingActionLib
        floatingIcon={floatingIcon}
        color={color || defaultThemeColor}
        actions={actions}
        onPressItem={name => {
            let pressed = _.find(actions, { name });
            if (pressed && pressed.onPress) {
                pressed.onPress();
            }
        }}
    />;
};

export default FloatingAction;
