import { Platform, PermissionsAndroid, Alert, NativeModules } from 'react-native';

export const checkSavePermission = async () => {
  if (Platform.OS == 'ios') return
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ],
      {
        title: '权限申请',
        message: '慢邮保存图片，需要访问你的相册'
      },
    );
    if (!checkGranted(granted)) {
      showAlert('读写手机存储权限')
      throw new Error('授权拒绝，无法保存图片')
    }
  } catch (err) {
    throw new Error('授权失败，无法保存图片')
  }
}

export const checkFilePermission = async () => {
  if (Platform.OS == 'ios') return
  try {
    // PermissionsAndroid.PERMISSIONS.CAMERA
    const granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ],
      {
        title: '权限申请',
        message: '慢邮需要读取手机存储'
      },
    );
    if (!checkGranted(granted)) {
      showAlert('读写手机存储权限')
      throw new Error('授权拒绝，无法获取文件夹')
    }
  } catch (err) {
    console.log(err)
    throw new Error('授权失败，无法获取文件夹')
  }
}

export const checkImagePermission = async () => {
  if (Platform.OS == 'ios') return
  try {
    // PermissionsAndroid.PERMISSIONS.CAMERA
    const granted = await PermissionsAndroid.requestMultiple(
      [ PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA ],
      {
        title: '权限申请',
        message: '慢邮需要访问你的相机和相册'
      },
    );
    if (!checkGranted(granted)) {
      showAlert('相机和读写手机存储权限')
      throw new Error('授权拒绝，无法获取图片')
    }
  } catch (err) {
    console.log(err)
    throw new Error('授权失败，无法获取图片')
  }
}

export const checkVideoPermission = async () => {
  if (Platform.OS == 'ios') return
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [ PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ], {
        title: '权限申请',
        message: '慢邮需要访问你的视频文件和录制视频'
      },
    );
    console.log(granted);
    if (!checkGranted(granted)) {
      showAlert('相机、录音和读写手机存储权限')
      throw new Error('授权拒绝，无法获取视频')
    }
  } catch (err) {
    console.log(err)
    throw new Error('授权失败，无法获取视频')
  }
}

function checkGranted(granted) {
  const values = Object.values(granted)
  let isGranted = true
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] != values[i + 1]) {
      isGranted = false
      break
    }
  }
  if (isGranted && values[0] == PermissionsAndroid.RESULTS.GRANTED) {
    return true
  }
  return false
}

function showAlert(content) {
  Alert.alert(
    '权限设置',
    `授权失败，是否去设置${content}`,
    [
      {text: '取消', onPress: () => {}, style: 'cancel'},
      {text: '去设置', onPress: () => NativeModules.SettingModule.openPermission() },
    ],
    { cancelable: false }
  )
}
