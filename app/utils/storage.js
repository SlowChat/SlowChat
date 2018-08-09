import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage'
import Global from './global'

let storage = new Storage({
    size: 100,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
});

import Constant from './constant'


export default {
  setToken: (token) => {
    Global.token = token
    return storage.save({
      key: 'slowchattoken',
      data: {
        domain: Constant.DOMAIN,
        token
      },
      expires: 1000 * 3600 * 24 * 30,
    })
  },
  getToken: async (token, force) => {
    if (Global.token && !force) return Global.token
    try {
      const res = await storage.load({
        key: 'slowchattoken',
        autoSync: true,
        syncInBackground: true,
      })
      Global.token = res.token
      return res.token
    } catch (e) {
      return ''
    }
  },
  clearAll: () => {
    storage.clearMap()
  }
}
