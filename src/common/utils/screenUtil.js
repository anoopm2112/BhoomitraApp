import { Dimensions } from 'react-native';

let window = Dimensions.get('window');

const { height, width } = window;

window = {
    height,
    width
};

export default window;
