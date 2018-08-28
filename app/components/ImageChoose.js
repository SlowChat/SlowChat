import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  Animated,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  NativeModules
} from 'react-native';

import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import ImagePicker from 'react-native-image-picker'
import ImageViewer from 'react-native-image-zoom-viewer'
import RNFileSelector from 'react-native-file-selector'
// import ActionSheet from 'react-native-actionsheet'
import ActionSheet from './ActionSheet'
// import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AttachmentItem from './AttachmentItem'
import SaveBtn from './SaveBtn'
import Alert from './Alert'
// import { upload } from '../utils/request'
import { openFile } from '../utils/opendoc'
import { checkImagePermission, checkVideoPermission } from '../utils/permission'

const TRANSLATE_Y = 320

export default class ImageChoose extends PureComponent {
  state = {
    items: [],
    current: {},
    images: [],
  }

  chooseY = new Animated.Value(TRANSLATE_Y)

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue.length > 0 && nextProps.initValue.length !== this.props.initValue.length) {
      this.setState({ items: nextProps.initValue })
    }
    if (nextProps.visible != this.props.visible) {
      if (nextProps.visible) {
        Animated.timing(this.chooseY, {
          toValue: 0,
          duration: 250,
        }).start()
      } else {
        Animated.timing(this.chooseY, {
          toValue: TRANSLATE_Y,
          duration: 250,
        }).start()
      }
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
      console.log(response);
      if (response && response.uri) {
        let file = response.uri
        this.dealSucc(file, response)
        // if(Platform.OS === 'ios'){
        //   file = file.replace('file://', '')
        // }
        // console.log(file);
        // upload(response.uri, response.fileName).then(res => {
        //   console.log(res);
        // }).catch(e => {
        //   console.log(e)
        // })

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
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.uri) {
        let file = response.uri
        const path = file.replace('file://', '')
        const { fileName, fileSize } = await NativeModules.FileModule.getInfo(path)
        response.fileName = fileName
        response.fileSize = fileSize
        this.dealSucc(file, response, 'video')
      }
    });
  }
  checkExt(fileName) {
    return true
    const ext = fileName.substring(fileName.lastIndexOf('.') + 1)
    return ['jpg', 'png', 'gif', 'doc', 'docs', 'xls', 'pdf', 'txt'].indexOf(ext) > -1
  }
  dealSucc(uri, response, type = 'image') {
    console.log(response)
    let { fileName, fileSize, path } = response
    if (!this.checkExt(fileName || uri)) {
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
        path: path || uri
      }
    ])
    this.setState({ items }, () => {
      const { onChange } = this.props
      onChange && onChange(items)
    })
  }
  chooseFile = () => {
    this.showFSelector()
  }
  showFSelector() {
    RNFileSelector.Show({
      title: '文件选择',
      onDone: async (path) => {
        // if (Platform.OS == 'ios') {
        //   const { onClose } = this.props
        //   onClose && onClose(null, true)
        //   path = path.replace('file://', '')
        // }
        // path = path.replace('file://', '')
        const { fileName, fileSize } = await NativeModules.FileModule.getInfo(path)
        const type = fileName.substring(fileName.lastIndexOf('.') + 1)
        this.dealSucc(path, { fileName, fileSize }, type)
      },
      onCancel: () => {
        console.log('cancelled')
      }
    })
  }
  handlePress = (item) => {
    const { onPress } = this.props
    onPress && onPress(item)
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
      const { filename, url, path, ext } = this.state.current
      try {
        // if (Platform.OS == 'android' && ext == 'image') {
        //   this.setState({ images: [this.state.current] })
        // } else {
        //   await openFile(url, filename)
        // }
        await openFile(path || url, filename)
      } catch (e) {
        this.refs.toast.show('打开文件失败')
      }
    }
  }
  closeImageViewer = () => {
    this.setState({ images: [] })
    this.openImageChoose()
  }
  openActionSheet = (item) => {
    this.setState({ current: item }, async () => {
      this.actionSheet.show()
    })
  }
  openImageChoose = () => {
    const { onClose } = this.props
    onClose && onClose(true)
  }
  closeImageChoose = () => {
    const { onClose } = this.props
    onClose && onClose(false)
  }
  renderActionSheet() {
    console.log(this.state.current.filename);
    return <ActionSheet
      ref={ref => this.actionSheet = ref}
      title={this.state.current.filename}
      // tintColor="#333333"
      options={['删除', '预览', '返回']}
      // options={[
      //   <Text style={[styles.sheetBtn, {color: '#EC3632'}]}>删除</Text>,
      //   <Text style={styles.sheetBtn}>预览</Text>,
      //   <Text style={styles.sheetBtn}>返回</Text>
      // ]}
      cancelButtonIndex={2}
      destructiveButtonIndex={0}
      onPress={this.handleActionSheet}
      />
  }

  renderImageChoose() {
    const { items } = this.state
    const { visible } = this.props
    // <TouchableOpacity style={styles.imgchoosebg} onPress={this.closeImageChoose}></TouchableOpacity>
    // <Modal style={styles.wrap} visible={visible} transparent
    //   animationType="slide" onRequestClose={this.closeImageChoose}>
    return <Animated.View style={[styles.imgchoose, {transform: [{translateY: this.chooseY }]}]}>
      <SaveBtn onPress={this.props.onSave} />
      <SafeAreaView forceInset={{top: 'never', bottom: 'always'}} style={styles.content}>
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
            items.map((item, index) => <AttachmentItem key={index} source="ImageChoose" item={item} onPress={this.openActionSheet} />)
          }
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  }
  // <SafeAreaView style={{backgroundColor: '#F6F6F6'}} />

  renderImageViewer() {
    const { images } = this.state
    return <Modal visible={images.length > 0} transparent={true} onRequestClose={this.closeImageViewer}>
      <ImageViewer enableImageZoom imageUrls={images} onClick={this.closeImageViewer} />
    </Modal>
  }
  render() {
    return (
      <View>
        {this.renderImageChoose()}
        {this.renderActionSheet()}
        {this.renderImageViewer()}
        <Alert ref={ref => this.alert = ref} />
        <Toast ref="toast" position="center" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent:'flex-end',
    // backgroundColor: '#F6F6F6',
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
  },
  imgchoose: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    transform: [{translateY: TRANSLATE_Y }]
  },
});
