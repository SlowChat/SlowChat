import { Platform } from 'react-native'

let CODE_PUSH_IOS_KEY = 'hKkIvuItC7YBC4MhS6cH0b2UpPoR0e07ebd4-06ad-443c-a76f-ec8e5a6301b2'
let CODE_PUSH_ANDROID_KEY = 'yvpaYtuixXZvA9Y_6yvFqzC-wGS10e07ebd4-06ad-443c-a76f-ec8e5a6301b2'
if (__DEV__) {
  CODE_PUSH_IOS_KEY = 'm3v5hxbtb9EdSAiA4b7L_Bj_dIBO0e07ebd4-06ad-443c-a76f-ec8e5a6301b2'
  CODE_PUSH_ANDROID_KEY = 'R7trBQZsettQBdO_gM0Q9KKBWpe00e07ebd4-06ad-443c-a76f-ec8e5a6301b2'
}
const CODE_PUSH_KEY = Platform.OS === 'ios' ? CODE_PUSH_IOS_KEY : CODE_PUSH_ANDROID_KEY

export default {
  CODE_PUSH_KEY,
  DOMAIN: 'http://manyou.0lz.net',
}
