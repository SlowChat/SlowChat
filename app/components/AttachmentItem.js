import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'

// import Video from 'react-native-video'

function formatFileSize(fileSize) {
  if (fileSize > 1024 * 1024) {
    return Math.round(fileSize / 1024 / 1024) + 'M'
  } else if (fileSize > 1024) {
    return Math.round(fileSize / 1024) + 'K'
  } else {
    return Math.round(fileSize) + 'B'
  }
}

export default class AttachmentItem extends PureComponent {
  static defaultProps = {
    show: true,
  }
  state = {
    rate: 0,
    paused: true
  }
  handleOpen = () => {
    const { item, onPress } = this.props
    onPress && onPress(item)
    // if (this.props.source == 'ImageChoose') {
    //   if (item.ext =='video') {
    //     onPress && onPress(item, this.player)
    //   } else {
    //     onPress && onPress(item)
    //   }
    // } else {
    //   if (item.ext =='video') {
    //     this.player.presentFullscreenPlayer()
    //     this.setState({ paused: false, rate: 1 })
    //   } else {
    //     onPress && onPress(item)
    //   }
    // }
  }

  handleDismiss = () => {
    this.setState({ paused: true, rate: 0 })
  }

  renderItem() {
    const { item } = this.props
    const { url, ext } = item
    if (!url) return null
    if (ext == 'image') {
      return <Image defaultSource={require('../images/placeholde.png')} source={{uri: item.thumb || item.url}} style={styles.image}></Image>
    }
    //  else if (ext == 'video') {
    //   const { paused, rate } = this.state
    //   return <Video ref={(ref) => this.player = ref } paused={paused} playWhenInactive
    //       source={{uri: item.url}} style={styles.image} onFullscreenPlayerWillDismiss={this.handleDismiss} />
    // }
    return <Image source={require('../images/picture.png')} style={styles.image}></Image>
  }
  render() {
    const { item, show } = this.props
    const filename = item.filename || ''
    const lastIndex = filename.lastIndexOf('.')
    let name = filename.substring(0, lastIndex)
    let ext = filename.substring(lastIndex)
    return (
      <View style={styles.imageItem}>
        <TouchableOpacity  activeOpacity={0.8} onPress={this.handleOpen}>
          {this.renderItem()}
        </TouchableOpacity>
        { show && item.filename && <View style={styles.file}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={styles.filename}>{item.filename}</Text>
        </View>}
        { show && item.size && <Text style={styles.size}>{formatFileSize(item.size)}</Text> }
      </View>
    )
  }
}

// <Text numberOfLines={1} style={styles.filename}>{name}</Text>
// <Text style={styles.fileext}>{ext}</Text>

const styles = StyleSheet.create({
  imageItem: {
    width: 80,
    marginRight: 16,
    marginBottom: 15,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  file: {
    width: 80,
    display: 'flex',
    flexDirection: 'row',
  },
  filename: {
    flex: 1,
    height: 17,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333333',
    lineHeight: 17,
    marginRight: 0,
  },
  fileext: {
    height: 17,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333333',
    lineHeight: 17,
  },
  size: {
    height: 14,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#B4B4B4',
    lineHeight: 14,
    textAlign: 'center'
  },
});
