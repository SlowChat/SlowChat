import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PixelRatio
} from 'react-native';

const onePx = 1 / PixelRatio.get()

const ICONS = {
  head: require('../images/head_placeholder80.png'),
}

export default class AvatarHeader extends Component {
  render() {
    return (
      <View style={styles.avatarWrap}>
        <Image style={styles.avatar} source={ICONS.head} />
        <View style={styles.avatarRight}>
          <View style={styles.nameWrap}>
            <Text style={styles.name}>给未来的自</Text>
            <Text style={styles.time}>12:00</Text>
          </View>
          <Text style={styles.date}>发信时间：2019年1月10日</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatarWrap: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  avatarRight: {
    flex: 1,
  },
  nameWrap: {
    marginBottom: 2,
    flexDirection: 'row',
  },
  name: {
    flex: 1,
    height: 20,
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#E24B92',
    lineHeight: 20,
  },
  time: {
    height: 17,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#B4B4B4',
    lineHeight: 17
  },
  date: {
    height: 17,
    fontSize: 12,
    color: '#B4B4B4',
    lineHeight: 17
  },
});
