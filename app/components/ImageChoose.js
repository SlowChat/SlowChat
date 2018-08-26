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

import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import ImagePicker from 'react-native-image-picker'
import RNFileSelector from 'react-native-file-selector'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AttachmentItem from './AttachmentItem'
import Alert from './Alert'
// import { upload } from '../utils/request'
import { openFile } from '../utils/opendoc'
import { checkImagePermission, checkVideoPermission } from '../utils/permission'

export default class ImageChoose extends PureComponent {
  state = {
    items: [],
    sheetTitle: '',
    current: {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue.length !== this.props.initValue.length) {
      this.setState({ items: nextProps.initValue })
    }
  }

  chooseImage = async () => {
    try {
      await checkImagePermission()
    } catch (e) {
      this.refs.toast.show(e.message)
      return
    }
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
    try {
      await checkVideoPermission()
    } catch (e) {
      this.refs.toast.show(e.message)
      return
    }
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
        this.dealSucc(file, response, 'video')
      }
    });
  }
  checkExt() {
    return true
  }
  dealSucc(uri, response, type = 'image') {
    console.log(response)
    let { fileName, fileSize } = response
    if (!this.checkExt()) {
      const { onError } = this.props
      onError && onError('附件格式不支持上传')
      return
    }

    let { items } = this.state
    items = items.concat([
      {
        url: uri,
        filename: fileName,
        ext: type,
        size: fileSize,
      }
    ])
    this.setState({ items }, () => {
      const { onChange } = this.props
      onChange && onChange(items)
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
  openActionSheet = (item) => {
    this.actionSheet.show()
    this.setState({ current: item })
  }
  handleActionSheet = async (index) => {
    if (index == 0) {
      this.alert.show({
        title: '附件删除',
        txt: '确定要删除附件吗？',
        leftBtnTxt: '确定删除',
        rightBtnTxt: '再想想',
        onCancel: () => {
          this.alert.hide()
          const { items } = this.state
          items.splice(index, 1)
          this.setState({ items: [...items] }, () => {
            this.refs.toast.show('附件删除成功')
          })
        }
      })
    } else if (index == 1) {
      const { filename, url } = this.state.current
      this.setState({ sheetTitle: filename })
      try {
        await openFile(url, filename)
      } catch (e) {
        this.refs.toast.show('打开文件失败')
      }

    }
  }
  render() {
    const { items } = this.state
    const { visible, onClose } = this.props
    return (
      <Modal visible={visible} transparent={true}
        animationType="slide" onRequestClose={this.handleClose}>
        <View style={styles.wrap}>
          <TouchableOpacity activeOpacity={0.6} style={styles.bg} onPress={this.handleClose}></TouchableOpacity>
          <SafeAreaView style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseImage}>
                <Image style={styles.icon} source={require('../images/picture.png')}></Image>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseFile}>
                <Image style={styles.icon} source={require('../images/document.png')}></Image>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseVideo}>
                <Image style={styles.icon} source={require('../images/video.png')}></Image>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal contentContainerStyle={styles.body} showsHorizontalScrollIndicator={false}>
              {
                items.map((item, index) => <AttachmentItem key={index} item={item} onPress={this.openActionSheet} />)
              }
            </ScrollView>
          </SafeAreaView>
        </View>
        <ActionSheet
          ref={ref => this.actionSheet = ref}
          title={this.state.sheetTitle}
          options={[
            <Text style={[styles.sheetBtn, {color: '#EC3632'}]}>删除</Text>,
            <Text style={styles.sheetBtn}>预览</Text>,
            <Text style={styles.sheetBtn}>返回</Text>
          ]}
          cancelButtonIndex={2}
          onPress={this.handleActionSheet}
          />
        <Alert ref={ref => this.alert = ref} />
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
    paddingLeft: 25,
    paddingRight: 25,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 25,
    marginRight: 25,
  },
  body: {
    height: 156,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
  },
  sheetBtn: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
  }
});
