import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'

import Video from 'react-native-video'

function formatFileSize(fileSize) {
  if (fileSize > 1024 * 1024) {
    return Math.round(fileSize / 1024 / 1024) + 'M'
  } else if (fileSize > 1024) {
    return Math.round(fileSize / 1024) + 'K'
  } else {
    return Math.round(fileSize) + 'B'
  }
}

export default class Attachment extends PureComponent {
  handleOpen = () => {
    const { onPress } = this.props
    onPress && onPress()
  }
  renderItem() {
    const { ext } = this.props.item
    if (ext == 'image') {
      return <Image source={{uri: item.url}} style={styles.image}></Image>
    } else if (ext == 'video') {
      // return
    }
    return <Image source={{uri: item.url}} style={styles.image}></Image>
  }
  render() {
    const { item } = this.props
    return (
      <View style={styles.imageItem}>
        <TouchableOpacity  activeOpacity={0.8} onPress={this.handleOpen}>
          {this.renderItem()}
        </TouchableOpacity>
        { item.filename && <Text numberOfLines={1} style={styles.filename}>{item.filename}</Text> }
        { item.size && <Text style={styles.size}>{formatsize(item.size)}</Text> }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageItem: {
    width: 80,
    marginRight: 16,
    marginBottom: 15,
  },
  image: {
    width: 80,
    height: 80,
  },
  filename: {
    height: 17,
    fontSize: 12,
    color: '#333333',
    lineHeight: 17,
    textAlign: 'center',
  },
  size: {
    height: 14,
    fontSize: 10,
    color: '#B4B4B4',
    lineHeight: 14,
    textAlign: 'center'
  },
});
