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
  return /^[1][3456789][0-9]{9}$/.test(v);
}

export function isEmail(str){
  const re=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (re.test(str) != true) {
    return false;
  }else{
    return true;
  }
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
