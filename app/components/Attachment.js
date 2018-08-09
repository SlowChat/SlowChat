import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
} from 'react-native'

import ImageViewer from 'react-native-image-zoom-viewer'

import AttachmentItem from './AttachmentItem'


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
  handleOpen(index) {
    this.setState({ index, visible: true })
  }
  render() {
    const items = (this.props.items || []).map(item => ({url: item}))
    const { visible, index } = this.state
    return (
      <View style={styles.imageList}>
        { items && items.map((item, index) => <AttachmentItem key={index} item={item} onPress={() => this.handleOpen(index)} />)}
        <Modal visible={visible} transparent={true}>
          <ImageViewer enableImageZoom index={index} imageUrls={items} onChange={this.handleChange} onClick={this.handleClick} />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 26,
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
