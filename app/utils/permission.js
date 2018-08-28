import { Platform, PermissionsAndroid } from 'react-native';

export const checkImagePermission = async (onTip) => {
  if (Platform.OS == 'ios') return
  try {
    // PermissionsAndroid.PERMISSIONS.CAMERA
    const granted = await PermissionsAndroid.requestMultiple(
      [ PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA ],
      {
        title: '权限申请',
        message: '慢聊需要访问你的相机和相册'
      },
    );
    if (!checkGranted(granted)) {
      throw new Error('授权拒绝，无法获取图片')
    }
  } catch (err) {
    console.log(err)
    throw new Error('授权失败，无法获取图片')
  }
}

export const checkVideoPermission = async (onTip) => {
  if (Platform.OS == 'ios') return
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [ PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        // PermissionsAndroid.PERMISSIONS.CAMERA,
        // PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ], {
        title: '权限申请',
        message: '慢聊需要访问你的视频文件和录制视频'
      },
    );
    console.log(granted);
    if (!checkGranted(granted)) {
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
