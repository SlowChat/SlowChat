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

import { openFile } from '../utils/opendoc'


export default class Attachment extends PureComponent {
  state = {
    visible: false,
    index: 1,
  }
  handleClick = (index) => {
    this.setState({ visible: false })
  }
  handleChange = (index) => {
    this.setState({ index })
  }
  async handleOpen(index) {
    const { items } = this.props
    const item = items[index]
    const { filename, url, ext } = item
    if (ext != 'video') {
      try {
        await openFile(url, filename)
      } catch (e) {
        this.refs.toast.show('文件打开失败！')
      }
    }
    // if (item.ext == 'image') {
    //   const imageIndex = items.slice(0, index).filter(item => item.ext == 'image').length
    //   this.setState({ index: imageIndex, visible: true })
    // }
  }
  render() {
    const { items = [] } = this.props
    if (!items || items.length == 0) {
      return null
    }
    // const items = (this.props.items || []).map(item => ({url: item}))
    const { visible, index } = this.state
    const images = items.filter(item => item.ext == 'image')
    return (
      <View>
        <View style={styles.imageList}>
          { items.map((item, index) => <AttachmentItem key={index} item={item} onPress={() => this.handleOpen(index)} />)}
        </View>
        <Toast ref="toast" />
      </View>
    )
  }
}

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



// { images.length > 0 &&
//     <Modal visible={visible} transparent={true} onRequestClose={this.handleClick}>
//       <ImageViewer enableImageZoom index={index} imageUrls={images} onChange={this.handleChange} onClick={this.handleClick} />
//     </Modal>
// }
