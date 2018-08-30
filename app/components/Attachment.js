import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Platform,
} from 'react-native'

// import Toast from 'react-native-easy-toast'

import AttachmentItem from './AttachmentItem'
import Loading from './Loading'
import ActionSheet from './ActionSheet'
import { openFile, downFile } from '../utils/opendoc'


export default class Attachment extends PureComponent {
  state = {
    visible: false,
    current: 0,
    showLoading: false,
  }
  handleOpen(index) {
    this.setState({ current: index }, () => {
      this.actionSheet.show()
    })
  }
  handleActionSheet = async (index) => {
    if (index == 0 || index == 1) {
      if (this.loading) return
      this.loading = true
      const item = this.props.items[this.state.current]
      const { filename, url, thumb, ext } = item
      const start = Date.now()
      this.setState({ showLoading: true })
      try {
        if (index == 0) {
          await openFile(url || thumb, filename)
        } else {
          await downFile(url || thumb)
          this.showToast('文件保存成功！')
        }
      } catch (e) {
        const txt = index == 0 ? '文件打开失败！' : '文件保存失败！'
        this.showToast(txt)
      }
      this.setState({ showLoading: false })
      this.loading = false
    }
  }
  showToast(txt) {
    const { onTip } = this.props
    onTip && onTip(txt)
  }
  render() {
    const { items = [] } = this.props
    if (!items || items.length == 0) {
      return null
    }
    let { url, filename } = items[this.state.current]
    if (!filename) {
      filename = url.substring(url.lastIndexOf('/') + 1)
    } else if (filename.indexOf('/') > -1) {
      filename = filename.substring(filename.lastIndexOf('/') + 1)
    }
    return (
      <View>
        <View style={styles.imageList}>
          { items.map((item, index) => <AttachmentItem key={index} item={item} onPress={() => this.handleOpen(index)} />)}
        </View>
        <ActionSheet
          ref={ref => this.actionSheet = ref}
          title={filename}
          options={['预览', '保存到相册', '返回']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheet}
          />
        { this.state.showLoading && <Loading /> }
      </View>
    )
  }
}
// <Toast ref="toast" />

const styles = StyleSheet.create({
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
});


// handleChange = (index) => {
//   this.setState({ index })
// }
// handleClick = (index) => {
//   this.setState({ visible: false, images: [] })
// }
// import ImageViewer from 'react-native-image-zoom-viewer'
// let ImageViewer = null
// <Modal visible={images.length > 0} transparent={true} onRequestClose={this.handleClick}>
//   <ImageViewer enableImageZoom imageUrls={images} onClick={this.handleClick} />
// </Modal>
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

// imageSize: {
//   height: 14,
//   fontSize: 10,
//   color: '#B4B4B4',
//   lineHeight: 14,
//   textAlign: 'center'
// },
