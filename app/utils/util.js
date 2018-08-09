import {
  AsyncStorage,
  Platform,
  Dimensions
} from 'react-native'

// 时间转换
export function dateFormat (timestamp) {
  if (typeof timestamp !== 'number') return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function isMobileNumberSupport(v) {
  return /^[1][345678][0-9]{9}$/.test(v);
}

export function isIphoneX () {
  const dimen = Dimensions.get('window')
  return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
  )
}
