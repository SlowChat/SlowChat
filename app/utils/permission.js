import { Platform } from 'react-native';

export const checkImagePermission = async (onTip) => {
  if (Platform.OS == 'ios') return false
  let nopermission = false
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
    if (granted != PermissionsAndroid.RESULTS.GRANTED) {
      nopermission = true
      const { onTip } = this.props
      onTip && onTip('授权拒绝，无法选择图片')
    }
  } catch (err) {
    nopermission = true
    const { onTip } = this.props
    onTip && onTip('授权失败，无法选择图片')
  }
  return nopermission
}

export const checkVideoPermission = async (onTip) => {
  if (Platform.OS == 'ios') return false
  let nopermission = false
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [ PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        // PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, ],
      {
        title: '权限申请',
        message: '慢聊需要访问你的视频文件和录制视频'
      },
    );
    if (granted != PermissionsAndroid.RESULTS.GRANTED) {
      nopermission = true
      this.refs.toast.show('授权拒绝，无法选择图片')
    }
  } catch (err) {
    nopermission = true
    this.refs.toast.show('授权失败，无法选择图片')
  }
  return nopermission
}
