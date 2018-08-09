import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import AvatarHeader from './AvatarHeader'
import Attachment from './Attachment'

export default class MailContent extends PureComponent {
  render() {
    const { data } = this.props
    const attachs = (data.attach || '').split(',')
    console.log("MailContent===", data);
    return (
      <View style={styles.container}>
        <AvatarHeader data={data} />
        <View>
          <Text style={styles.header}>{data.title}</Text>
        </View>
        <View>
          <Text style={styles.content}>{data.content}</Text>
        </View>
        <Attachment items={attachs} />
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
