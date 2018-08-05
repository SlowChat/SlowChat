import React, { PureComponent } from 'react'

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'

export default class Attachment extends PureComponent {
  handleOpen = () => {
    const { onPress } = this.props
    onPress && onPress()
  }
  render() {
    const { data } = this.props
    return (
      <View style={styles.imageItem}>
        <TouchableOpacity  activeOpacity={0.8} onPress={this.handleOpen}>
          <Image source={{uri: data}} style={styles.image}></Image>
        </TouchableOpacity>
        <Text style={styles.imageName}>图片1名图片1名图片1名.png</Text>
        <Text style={styles.imageSize}>112.66</Text>
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
