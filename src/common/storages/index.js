/**
 * AsyncStorage on Android has one serious limitation which restricts the cursor window
 * size to just 2MB because the underlying implementation is based on sqlite engine. 
 * So, we will use FilesystemStorage on Android which has no such restrictions. For ios,
 * AsyncStorage has no such limitation and uses file system based storage internally.
 * Also, there is EncryptedStorage for storing data in encrypted form. From now on, we
 * will be using EncryptedStorage for both iOS ans Android.
 */

// import { Platform } from 'react-native';
import AwaitLock from 'await-lock';
// import AsyncStorage from '@react-native-community/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
// import FilesystemStorage from './FilesystemStorage';

const mutex = {};

const _Storage = EncryptedStorage;

const Storage = {

    setItem: async (key, value) => {
        if (!mutex.hasOwnProperty(key)) {
            mutex[key] = new AwaitLock();
        }
        await mutex[key].acquireAsync();
        await _Storage.setItem(key, value);
        mutex[key].release();
    },

    getItem: async (key) => {
        if (!mutex.hasOwnProperty(key)) {
            mutex[key] = new AwaitLock();
        }
        await mutex[key].acquireAsync();
        const item = await _Storage.getItem(key);
        mutex[key].release();
        return item;
    },

    removeItem: async (key) => {
        let needReleasing = false;
        if (mutex.hasOwnProperty(key)) {
            await mutex[key].acquireAsync();
            needReleasing = true;
        }
        await _Storage.removeItem(key);
        needReleasing && mutex[key].release();
    },

    getAllKeys: async () => {
        const keys = await _Storage.getAllKeys();
        return keys;
    },

    clear: async () => {
        for (const key in mutex) {
            await mutex[key].acquireAsync();
        }
        await _Storage.clear();
        for (const key in mutex) {
            mutex[key].release();
        }
    }

};

export default Storage;
