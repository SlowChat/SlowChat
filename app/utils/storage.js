import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage'
let storage = new Storage({
    size: 100,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
});

import Constant from './constant'


export default {
  setToken: (token) => {
    storage.save({
      key: 'slowchattoken',
      data: {
        domain: Constant.DOMAIN,
        token
      },
      expires: 1000 * 3600 * 24 * 30,
    })
  },
  getToken: (token) => {
    return storage.load({
      key: 'slowchattoken',
      autoSync: true,
      syncInBackground: true,
    })
  },
  clearAll: () => {
    storage.clearMap()
  }
}
