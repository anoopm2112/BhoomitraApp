import React from 'react';
import { Icon, useTheme } from '@ui-kitten/components';

const CustomIcon = (props) => {
    const theme = useTheme();
    const { width, height, name, pack, fill } = props;
    return (
        <Icon style={{ width: width || 32, height: height || 32, alignSelf: 'center' }}
            name={name} pack={pack || 'eva'} fill={props.fill || theme[fill || 'color-primary-default']} />
    );
};

export default CustomIcon;
