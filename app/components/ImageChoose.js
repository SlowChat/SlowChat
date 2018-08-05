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

import AttachmentItem from './AttachmentItem'


const ICONS = {
  pic: require('../images/head_placeholder80.png'),
  folder: require('../images/head_placeholder80.png'),
}

const IMGS = [
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
]


export default class AvatarHeader extends Component {
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
      // fileName
      // fileSize
      if (response && response.uri) {
        upload(response.uri).then(res => {
          console.log("succ", res)
          // const { onImage } = this.props
          // onImage && onImage()
        }).catch(err => {
          console.log(err);
        })
      }
    });
  }
  chooseVideo = () => {
    const options = {
      title: '选择视频',
      takePhotoButtonTitle: '拍摄视频',
      chooseFromLibraryButtonTitle: '选择视频',
      mediaType: 'video',
      videoQuality: 'medium'
    }
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.uri) {
        upload(response.uri).then(res => {
          console.log("succ", res)
          // const { onVideo } = this.props
          // onVideo && onVideo()
        }).catch(err => {
          console.log(err);
        })
      }
    });
  }
  render() {
    const items = IMGS
    const { visible, onClose } = this.props
    return (
      <Modal visible={visible} transparent={true}
        animationType="slide" onRequestClose={onClose}>
        <View style={styles.wrap}>
          <TouchableOpacity activeOpacity={0.8} style={styles.bg} onPress={onClose}></TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.8} onPress={this.chooseImage}>
                <Image style={styles.icon} source={ICONS.pic}></Image>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={this.chooseVideo}>
                <Image style={styles.icon} source={ICONS.folder}></Image>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal contentContainerStyle={styles.body} showsHorizontalScrollIndicator={false}>
              {
                items.map((item, index) => <AttachmentItem key={index} data={item} />)
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
