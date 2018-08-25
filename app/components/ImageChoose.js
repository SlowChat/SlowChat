import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  NativeModules
} from 'react-native';

import Toast from 'react-native-easy-toast'
import ImagePicker from 'react-native-image-picker'
import RNFileSelector from 'react-native-file-selector';
import Actionsheet from 'react-native-actionsheet'
import AttachmentItem from './AttachmentItem'
// import { upload } from '../utils/request'
import { checkImagePermission, checkVideoPermission } from '../utils/permission'

export default class AvatarHeader extends PureComponent {
  state = {
    items: []
  }

  chooseImage = async () => {
    let nopermission = await checkImagePermission((msg) => {
      this.refs.toast.show(msg)
    })
    if (nopermission) return
    const options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择照片',
      cameraType: 'back',
      mediaType: 'photo',
      videoQuality: 'high',
      durationLimit: 10,
      // maxWidth: 500,
      // maxHeight: 500,
      // quality: 0.8,
      angle: 0,
      allowsEditing: false,
      noData: true,
      storageOptions: {
        skipBackup: true,
        // path: 'images'
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
      if (response && response.uri) {
        let file = response.uri
        // if(Platform.OS === 'ios'){
        //   file = file.replace('file://', '')
        // }
        // console.log(file);
        // upload(response.uri, response.fileName).then(res => {
        //   console.log(res);
        // }).catch(e => {
        //   console.log(e)
        // })
        this.dealSucc(file, response)
      }
    });
  }
  // dealError(res) {
  //   console.log(res)
  //   const { onUploadError } = this.props
  //   onUploadError && onUploadError(res)
  //   this.refs.toast.show(res.msg || '上传失败')
  // }
  chooseVideo = async () => {
    let nopermission = await checkVideoPermission((msg) => {
      this.refs.toast.show(msg)
    })
    if (nopermission) return
    const options = {
      title: '选择视频',
      takePhotoButtonTitle: '拍摄视频',
      chooseFromLibraryButtonTitle: '选择视频',
      cancelButtonTitle: '取消',
      mediaType: 'video',
      videoQuality: 'medium'
    }
    ImagePicker.showImagePicker(options, (response) => {
      if (response.uri) {
        let file = response.uri
        // if(Platform.OS === 'ios'){
        //   file = file.replace('file://', '')
        // }
        this.dealSucc(file, response, 'video')
      }
    });
  }
  dealSucc(uri, response, type = 'image') {
    let { items } = this.state
    let { fileName, fileSize } = response
    items = items.concat([
      {
        url: uri,
        filename: filename,
        ext: type,
        size: fileSize,
      }
    ])
    this.setState({ items }, () => {
      const { onChange } = this.props
      onChange && onChange(items)
      console.log(items);
    })
  }
  chooseFile = () => {
    if (Platform.OS == 'ios') {
      const { onClose } = this.props
      onClose && onClose(() => {
        setTimeout(() => this.showFSelector(), 30)
      })
    } else {
      this.showFSelector()
    }
  }
  showFSelector() {
    RNFileSelector.Show({
      title: '文件选择',
      onDone: async (path) => {
        if (Platform.OS == 'ios') {
          const { onClose } = this.props
          onClose && onClose(null, true)
          path = path.replace('file://', '')
        }
        const { fileName, fileSize } = await NativeModules.FileModule.getInfo(path)
        const type = fileName.substring(fileName.lastIndexOf('.') + 1)
        this.dealSucc(path, { fileName, fileSize })
      },
      onCancel: () => {
        console.log('cancelled')
      }
    })
  }
  handleClose = () => {
    const { onClose } = this.props
    onClose && onClose()
  }
  render() {
    const { items } = this.state
    const { visible, onClose } = this.props
    return (
      <Modal visible={visible} transparent={true}
        animationType="slide" onRequestClose={this.handleClose}>
        <View style={styles.wrap}>
          <TouchableOpacity activeOpacity={0.6} style={styles.bg} onPress={this.handleClose}></TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseImage}>
                <Image style={styles.icon} source={require('../images/picture.png')}></Image>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseVideo}>
                <Image style={styles.icon} source={require('../images/video.png')}></Image>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseFile}>
                <Image style={styles.icon} source={require('../images/document.png')}></Image>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal contentContainerStyle={styles.body} showsHorizontalScrollIndicator={false}>
              {
                items.map((item, index) => <AttachmentItem key={index} item={item} />)
              }
            </ScrollView>
          </View>
        </View>
        <Actionsheet />
        <Toast ref="toast" position="center" />
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent:'flex-end',
  },
  bg: {
    flex: 1,
  },
  content: {
    backgroundColor: '#F6F6F6',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
    paddingLeft: 26,
    paddingRight: 26,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 26,
    marginRight: 26,
  },
  body: {
    height: 235,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  }
});
