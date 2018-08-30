import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Platform,
} from 'react-native'

import Toast from 'react-native-easy-toast'

// import ImageViewer from 'react-native-image-zoom-viewer'
import AttachmentItem from './AttachmentItem'
import Loading from './Loading'
import { openFile } from '../utils/opendoc'
// let ImageViewer = null

export default class Attachment extends PureComponent {
  state = {
    visible: false,
    index: 1,
    images: [],
    showLoading: false,
  }
  handleClick = (index) => {
    this.setState({ visible: false, images: [] })
  }
  handleChange = (index) => {
    this.setState({ index })
  }
  async handleOpen(index) {
    if (this.opening) return
    this.opening = true
    const { items } = this.props
    const item = items[index]
    const { filename, url, thumb, ext } = item
    setTimeout(() => {
      if (this.opening) {
        this.setState({ showLoading: true })
      }
    }, 200)
    try {
      await openFile(url || thumb, filename)
    } catch (e) {
      this.refs.toast.show('文件打开失败！')
    }
    this.setState({ showLoading: false })
    this.opening = false
  }
  render() {
    const { items = [] } = this.props
    if (!items || items.length == 0) {
      return null
    }
    return (
      <View>
        <View style={styles.imageList}>
          { items.map((item, index) => <AttachmentItem key={index} item={item} onPress={() => this.handleOpen(index)} />)}
        </View>
        { this.state.showLoading && <Loading /> }
        <Toast ref="toast" />
      </View>
    )
  }
}

// <Modal visible={images.length > 0} transparent={true} onRequestClose={this.handleClick}>
//   <ImageViewer enableImageZoom imageUrls={images} onClick={this.handleClick} />
// </Modal>

const styles = StyleSheet.create({
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  imageItem: {
    width: 80,
    marginRight: 16,
    marginBottom: 15,
  },
  image: {
    width: 80,
    height: 80,
  },
  imageName: {
    height: 17,
    fontSize: 12,
    color: '#333333',
    lineHeight: 17,
    textAlign: 'center',
  },
  imageSize: {
    height: 14,
    fontSize: 10,
    color: '#B4B4B4',
    lineHeight: 14,
    textAlign: 'center'
  },
});


// const { index, images } = this.state
// const images = items.filter(item => item.ext == 'image')
// if (ext == 'image' && Platform.OS == 'android') {
//   // ImageViewer = require('react-native-image-zoom-viewer')
//   this.setState({ images: [item] })
// } else if (ext != 'video') {
// }
// if (item.ext == 'image') {
//   const imageIndex = items.slice(0, index).filter(item => item.ext == 'image').length
//   this.setState({ index: imageIndex, visible: true })
// }
