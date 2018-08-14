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
  setToken: (token, user) => {
    Global.token = token
    Global.user = user
    return storage.save({
      key: 'slowchattoken',
      data: {
        domain: Constant.DOMAIN,
        token,
        user
      },
      expires: 1000 * 3600 * 24 * 30,
    })
  },
  getToken: async (force) => {
    if (Global.token && !force) return Global.token
    try {
      const res = await storage.load({
        key: 'slowchattoken',
        autoSync: true,
        syncInBackground: true,
      })
      Global.token = res.token
      Global.user = res.user || {}
      return res.token
    } catch (e) {
      return ''
    }
  },
  getUser: async (force) => {
    if (Global.user && Global.user.id) return Global.user
    try {
      const res = await storage.load({
        key: 'slowchattoken',
        autoSync: true,
        syncInBackground: true,
      })
      Global.user = res.user || {}
      return res.user || {}
    } catch (e) {
      return {}
    }
  },
  clear: () => {
    Global.token = ''
    Global.user = {}
    storage.remove({
      key: 'slowchattoken'
    })
    storage.clearMap()
  }
}
