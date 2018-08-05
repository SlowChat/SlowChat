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

const IMGS = [
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
]

const IMG_ARR = [
  {
    url: 'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  },
  {
    url: 'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  },
  {
    url: 'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  },
  {
    url: 'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  },
  {
    url: 'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  },
  {
    url: 'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  },
]

const images1 = [{
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}]

export default class Attachment extends PureComponent {
  static defaultProps = {
    items: IMGS,
  }
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
    const { items } = this.props
    const { visible, index } = this.state
    return (
      <View style={styles.imageList}>
        { items && items.map((item, index) => <AttachmentItem key={index} data={item} onPress={() => this.handleOpen(index)} />)}
        <Modal visible={visible} transparent={true}>
          <ImageViewer enableImageZoom index={index} imageUrls={IMG_ARR} onChange={this.handleChange} onClick={this.handleClick} />
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
