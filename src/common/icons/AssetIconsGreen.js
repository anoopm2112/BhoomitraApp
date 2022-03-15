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
        'default_app_login_icon': IconProvider(require('../../../assets/img/green/trois-logo.png')),
        'otp': IconProvider(require('../../../assets/img/green/otp.png')),
        'about-us': IconProvider(require('../../../assets/img/green/about-us.png')),
        'bhoomitra_app_login_icon': IconProvider(require('../../../assets/img/green/bhoomitra_dev_logo.png')),
        'harithamithram_app_login_icon': IconProvider(require('../../../assets/img/green/harithamithram.png')),
        'kelgms_app_login_icon': IconProvider(require('../../../assets/img/green/kelgms.png'))
    },
};

export default AssetIconsPack;
