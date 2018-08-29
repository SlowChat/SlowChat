import { Platform } from 'react-native'
import ActionSheetIOS from './ios'
import ActionSheetCustom from './android'

// export ActionSheetCustom

let ActionSheet

if (Platform.OS === 'ios') {
  ActionSheet = ActionSheetIOS
} else {
  ActionSheet = ActionSheetCustom
}

export default ActionSheet
