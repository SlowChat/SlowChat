import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native'

// import Toast from 'react-native-easy-toast'

import AttachmentItem from './AttachmentItem'
import Loading from './Loading'
import ActionSheet from './ActionSheet'
import { openFile, downFile } from '../utils/opendoc'
import ImageViewer from 'react-native-image-zoom-viewer'


export default class Attachment extends PureComponent {
  state = {
    viewerVisible: false,
    current: 0,
    showLoading: false,
    viewerIndex: 0,
  }
  handleOpen(index) {
    const item = this.props.items[index]
    if (item.ext == 'image') {
      this.openImageViewer(item.viewerIndex)
    } else {
      this.setState({ current: index }, () => {
        this.actionSheet.show()
      })
    }
  }
  handleActionSheet = async (index) => {
    if (this.state.viewerVisible) {
      if (index == 0) {
        if (this.loading) return
        this.loading = true
        const item = this.images[this.state.viewerIndex]
        const start = Date.now()
        this.setState({ showLoading: true })
        try {
          await downFile(item.url || item.thumb)
          this.showToast('文件保存成功！')
        } catch (e) {
          const txt = '文件保存失败！'
          this.showToast(txt)
        }
        this.setState({ showLoading: false })
        this.loading = false
      }
      return
    }
    if (index == 0 || index == 1) {
      if (this.loading) return
      this.loading = true
      const item = this.props.items[this.state.current]
      const { filename, url, thumb, ext } = item
      const start = Date.now()
      this.setState({ showLoading: true })
      try {
        if (index == 0) {
          if (item.ext == 'image') {
            this.openImageViewer(item.viewerIndex)
          } else {
            await openFile(url || thumb, filename)
          }
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
  handleChange = (index) => {
    this.setState({ viewerIndex: index })
  }
  handleClick = (index) => {
    this.setState({ viewerVisible: false })
  }
  openImageViewer(index = 0) {
    this.setState({ viewerVisible: true, viewerIndex: index })
  }
  
  handleLongViewerPress = () => {
    this.actionSheet.show()
  }
  
  renderViewerLoading = () => {
    return <ActivityIndicator
        animating
        color='#EC3632'
        size='large'
      />
  }
  render() {
    const { items = [], imageviewer, showTxt } = this.props
    if (!items || items.length == 0) {
      return null
    }
    let { url, filename } = items[this.state.current]
    if (!filename) {
      filename = url.substring(url.lastIndexOf('/') + 1)
    } else if (filename.indexOf('/') > -1) {
      filename = filename.substring(filename.lastIndexOf('/') + 1)
    }
    let images = []
    if (imageviewer) {
      items.forEach(item => {
        if (item.ext == 'image') {
          item.viewerIndex = images.length
          images.push(item)
        }
      })
    }
    this.images = images
    let sheetOptions = ['预览', '保存到相册', '取消']
    let cancelButtonIndex = 2
    if (this.state.viewerVisible) {
      sheetOptions = ['保存到相册', '取消']
      cancelButtonIndex = 1
    }
    return (
      <View>
        <View style={styles.imageList}>
          { items.map((item, index) => <AttachmentItem show={showTxt} key={index} item={item} onPress={() => this.handleOpen(index)} />)}
        </View>
        <ActionSheet
          ref={ref => this.actionSheet = ref}
          title={filename}
          options={sheetOptions}
          cancelButtonIndex={cancelButtonIndex}
          onPress={this.handleActionSheet}
          />
        { this.state.showLoading && <Loading /> }
        {
          imageviewer && images.length && (
            <Modal visible={this.state.viewerVisible} transparent={true} onRequestClose={this.handleClick}>
              <ImageViewer saveToLocalByLongPress={false} index={this.state.viewerIndex} loadingRender={this.renderViewerLoading} enableImageZoom 
                imageUrls={images} onClick={this.handleClick} onChange={this.handleChange} onLongPress={this.handleLongViewerPress} />
            </Modal>
          )
        }
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



// 
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
