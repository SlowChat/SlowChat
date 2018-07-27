import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class MailContent extends Component {
  render() {
    const { images } = this.props
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>20岁，来自父亲的祝福！</Text>
        </View>
        <View>
          <Text style={styles.content}>如果你无法简洁的表达你的想法，那只说明你还不够了解它。生日快乐！</Text>
        </View>
        <View style={styles.imageList}>
          { images && images.map((item, index) => {
            return (<View style={styles.imageItem}>
              <Image></Image>
              <Text style={styles.imageName}>图片11…名.png</Text>
              <Text style={styles.imageSize}>112.66</Text>
            </View>)
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    fontFamily: 'PingFangSC-Regular',
  },
  header: {
    width: 345,
    height: 20,
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  content: {
    width: 345,
    height: 42,
    fontSize: 15,
    color: '#333333',
    lineHeight: 21,

  },
  imageList: {
    marginTop: 26,
    marginBottom: 15,
    flexDirection: 'row',
  },
  imageItem: {

  },
  image: {
    width: 80,
    height: 80,
  },
  imageName: {
    width: 82,
    height: 17,
    fontSize: 12,
    color: '#333333',
    lineHeight: 17,
  },
  imageSize: {
    width: 34,
    height: 14,
    fontSize: 10,
    color: '#B4B4B4',
    lineHeight: 14,
  },
});
