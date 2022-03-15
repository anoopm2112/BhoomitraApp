import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { icons, CommonScheme, ColorScheme } from './common/icons';
import configureStore from './redux';
import { AppNavigation } from './navigation';
import { toastConfig } from './config';
import mapping from './common/eva/mapping';
import Orientation from 'react-native-orientation-locker';
import Bugsnag from '@bugsnag/react-native';

if (!__DEV__) {
  Bugsnag.start();
}

Orientation.lockToPortrait();

// TODO: Remove when fixed
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified.', // Some modules not using native driver for animations
  'Warning: Cannot update a component', // Stop redux-form log spamming
  'Warning: Cannot update during an existing state transition', // Happens due to slow emulator performance
  'componentWillReceiveProps', // componentWillReceiveProps deprecated
  'currentlyFocusedField', // currentlyFocusedField deprecated
  'TouchID error', // Stop TouchID is not supported warning in emulator 
  'Setting a timer'
]);

export const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <IconRegistry icons={icons} />
      <ApplicationProvider {...eva} customMapping={mapping} theme={{ ...eva.light, ...CommonScheme, ...ColorScheme }}>
        <SafeAreaProvider>
          <AppNavigation />
          <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
        </SafeAreaProvider>
      </ApplicationProvider>
    </Provider>
  );
}
