import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage'
import { DOMAIN } from '../constants'
import Global from './global'

let storage = new Storage({
    size: 100,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
});


export default {
  setToken: (token, user) => {
    Global.token = token
    Global.user = user
    return storage.save({
      key: 'slowchattoken',
      data: {
        domain: DOMAIN,
        token,
        user
      },
      expires: 1000 * 3600 * 24 * 30,
    })
  },
  getToken: (force) => {
    return new Promise((resolve, reject) => {
      if (Global.token && !force) return resolve(Global.token)
      storage.load({
        key: 'slowchattoken',
        autoSync: true,
        syncInBackground: true,
      }).then(res => {
        Global.token = res.token
        Global.user = res.user || {}
        resolve(res.token)
      }).catch(() => resolve(''))
    })
  },
  getUser: async (force) => {
    return new Promise((resolve, reject) => {
      if (Global.user && Global.user.id) return resolve(Global.user)
      storage.load({
        key: 'slowchattoken',
        autoSync: true,
        syncInBackground: true,
      }).then(res => {
        Global.user = res.user || {}
        resolve(res.user)
      }).catch(() => resolve(''))
    })
  },
  getPushID: () => {
    return Global.pushId
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
