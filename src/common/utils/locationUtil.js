import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';

export const getCurrentPosition = (options = {}) => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, options);
    });
};

export const hasLocationAccess = (locationLatitude, locationLongitude) => {
    if (locationLatitude !== undefined && locationLongitude !== undefined) {
        Linking.openURL('https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=' + locationLatitude + ',' + locationLongitude)
    }
};
