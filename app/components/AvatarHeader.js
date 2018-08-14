import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import ICONS from '../utils/icon'

export default class AvatarHeader extends PureComponent {
  render() {
    const data = this.props.data || {}
    const [send_date, send_time] = (data.send_time || '').split(' ')
    let { avatar, user_nickname } = data.user || {}
    if (!avatar || avatar.indexOf('http') != 0) {
      avatar = ICONS.head
    }
    return (
      <View style={styles.avatarWrap}>
        <Image style={styles.avatar} source={avatar} />
        <View style={styles.avatarRight}>
          <View style={styles.nameWrap}>
            <Text style={styles.name}>{user_nickname}</Text>
            <Text style={styles.time}>{send_time}</Text>
          </View>
          <Text style={styles.date}>发信时间：{send_date}</Text>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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
