import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import ImagePicker from 'react-native-image-picker'
import RNFileSelector from 'react-native-file-selector';
import AttachmentItem from './AttachmentItem'
import { upload } from '../utils/request'


const ICONS = {
  picture: require('../images/picture.png'),
  folder: require('../images/document.png'),
}


function formatFileSize(fileSize) {
  if (fileSize > 1024 * 1024) {
    return Math.round(fileSize / 1024 / 1024) + 'M'
  } else if (fileSize > 1024) {
    return Math.round(fileSize / 1024) + 'K'
  } else {
    return Math.round(fileSize) + 'B'
  }
}

export default class AvatarHeader extends Component {
  state = {
    items: []
  }
  chooseImage = () => {
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
      noData: false,
      storageOptions: {
        skipBackup: true
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
      if (response && response.uri) {
        upload(response.uri).then(res => {
          if (res.code == 1) {
            this.dealSucc(res.data.url, response)
          } else {
            this.dealError(res)
          }
        }).catch(err => {
          this.dealError({code: 0})
        })
      }
    });
  }
  dealSucc(url, response) {
    const { items } = this.state
    let { fileName, fileSize } = response
    items.push({
      url,
      fileName,
      fileSize: formatFileSize(fileSize)
    })
    console.log(items);
    this.setState({ items })
    const { onChange } = this.props
    onChange && onChange(items)
  }
  dealError(res) {
    const { onUploadError } = this.props
    onUploadError && onUploadError(res)
  }
  chooseVideo = () => {
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
        upload(response.uri).then(res => {
          if (res.code == 1) {
            this.dealSucc(res.data.url, response)
          } else {
            this.dealError(res)
          }
        }).catch(err => {
          this.dealError({code: 0})
        })
      }
    });
  }
  chooseFile = () => {
    const { onClose } = this.props
    onClose && onClose()
    setTimeout(() => {
      RNFileSelector.Show({
        title: 'select',
        onDone: (path) => {
          console.log('file selected: ' + path)
        },
        onCancel: () => {
          console.log('cancelled')
        }
      })
    }, 60)

  }
  render() {
    const { items } = this.state
    const { visible, onClose } = this.props
    return (
      <Modal visible={visible} transparent={true}
        animationType="slide" onRequestClose={onClose}>
        <View style={styles.wrap}>
          <TouchableOpacity activeOpacity={0.6} style={styles.bg} onPress={onClose}></TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseImage}>
                <Image style={styles.icon} source={ICONS.picture}></Image>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseVideo}>
                <Image style={styles.icon} source={ICONS.folder}></Image>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this.chooseFile}>
                <Image style={styles.icon} source={ICONS.folder}></Image>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal contentContainerStyle={styles.body} showsHorizontalScrollIndicator={false}>
              {
                items.map((item, index) => <AttachmentItem key={index} item={item} />)
              }
            </ScrollView>
          </View>
        </View>
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
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 52,
  },
  body: {
    height: 235,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  }
});
