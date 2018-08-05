import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
} from 'react-native'

import ImageViewer from 'react-native-image-zoom-viewer'

const IMGS = [
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
]

export default class Attachment extends PureComponent {
  static defaultProps = {
    items: IMGS,
  }
  state = {
    visible: false,
    index: 0,
  }
  handleClick = (index) => {
    this.setState({ visible: true })
  }
  handleChange = (index) => {
    this.setState({ index })
  }
  handleOpen = (e) => {
    const { index } = e.target.dataset
    this.setState({ index })
  }
  render() {
    const { items } = this.props
    const { visible, index } = this.state
    return (
      <View style={styles.imageList}>
        { items && items.map((item, index) => {
          return (<View key={index} style={styles.imageItem}>
            <Image data-index={index} source={{uri: item}} style={styles.image} onClick={this.handleOpen}></Image>
            <Text style={styles.imageName}>图片1名图片1名图片1名.png</Text>
            <Text style={styles.imageSize}>112.66</Text>
          </View>)
        })}
        <Modal visible={visible} transparent={true}>
            <ImageViewer enableImageZoom index={index} imageUrls={items} onClick={this.handleClick} onChange={this.handleChange} />
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
