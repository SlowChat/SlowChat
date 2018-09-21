import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AvatarHeader from './AvatarHeader'
import Attachment from './Attachment'

export default class MailContent extends PureComponent {
  render() {
    const { data, onTip } = this.props
    return (
      <View style={styles.container}>
        <AvatarHeader data={data} />
        <Text style={styles.header}>{data.title}</Text>
        <View style={styles.contentWrap}>
          <Text style={styles.content} selectable>{data.content}</Text>
        </View>
        <Attachment items={data.attach} onTip={onTip} />
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
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  contentWrap: {
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  content: {
    width: 345,
    fontFamily: 'PingFangSC-Regular',
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
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333333',
    lineHeight: 17,
    textAlign: 'center'
  },
  imageSize: {
    height: 14,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#B4B4B4',
    lineHeight: 14,
    textAlign: 'center'
  },
});
