import AsyncStorage from '@react-native-community/async-storage';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

const reactotron = Reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .use(sagaPlugin())
  .useReactNative() // add all built-in react native plugins
  .use(reactotronRedux());

if (__DEV__) {
  reactotron.connect(); // let's connect!
  reactotron.clear();
}

console.tron = reactotron;

export default reactotron;
