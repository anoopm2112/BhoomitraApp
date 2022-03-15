import React from 'react';
import { Image } from 'react-native';

const IconProvider = (source) => ({
    toReactElement: ({ animation, ...props }) => (
        <Image {...props} source={source} />
    ),
});

const AssetIconsPack = {
    name: 'assets',
    icons: {
        'default_app_login_icon': IconProvider(require('../../../assets/img/blue/trois-logo.png')),
        'otp': IconProvider(require('../../../assets/img/blue/otp.png')),
        'about-us': IconProvider(require('../../../assets/img/blue/about-us.png')),
        'nagpursmartcity_app_login_icon': IconProvider(require('../../../assets/img/blue/nagpur-smart-city-login-logo.jpg'))
   },
};

export default AssetIconsPack;
