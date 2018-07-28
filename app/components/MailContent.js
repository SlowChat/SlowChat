import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import AvatarHeader from './AvatarHeader'


const IMGS = [
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB2uxDbcRcXBuNjt_biXXXpmpXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
  'https://img.alicdn.com/imgextra/i3/2549841410/TB23fcKuiCYBuNkSnaVXXcMsVXa_!!2549841410-0-sm.jpg_760x760Q50s50.jpg',
]

export default class MailContent extends Component {
  static defaultProps = {
    images: IMGS,
  };
  render() {
    const { images } = this.props
    return (
      <View style={styles.container}>
        <AvatarHeader />
        <View>
          <Text style={styles.header}>20岁，来自父亲的祝福！</Text>
        </View>
        <View>
          <Text style={styles.content}>如果你无法简洁的表达你的想法，那只说明你还不够了解它。生日快乐！</Text>
        </View>
        <View style={styles.imageList}>
          { images && images.map((item, index) => {
            return (<View key={index} style={styles.imageItem}>
              <Image source={{uri: item}} style={styles.image}></Image>
              <Text style={styles.imageName}>图片1名图片1名图片1名.png</Text>
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
    // flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: 'PingFangSC-Regular',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
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
    fontSize: 15,
    color: '#333333',
    lineHeight: 21,
  },
  imageList: {
    marginTop: 26,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageItem: {
    width: 80,
    marginRight: 17,
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
    textAlign: 'center'
  },
  imageSize: {
    height: 14,
    fontSize: 10,
    color: '#B4B4B4',
    lineHeight: 14,
    textAlign: 'center'
  },
});
