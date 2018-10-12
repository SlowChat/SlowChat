import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
} from 'react-native';

import dateFormat from '../utils/date'
import ImageBg from './ImageBg'

export default class AvatarHeader extends PureComponent {
  render() {
    const data = this.props.data || {}
    // const [send_date, send_time] = (data.send_time || '').split(' ')
    let { avatar, user_nickname } = data.user || {}
    const curr_item = dateFormat(new Date(), 'yyyy-MM-dd')
    let [ add_date, add_time ] = (data.add_time || '').split(' ')
    add_time = curr_item == add_date ? add_time : add_date
    return (
      <View style={styles.avatarWrap}>
        <ImageBg src={avatar} />
        <View style={styles.avatarRight}>
          <View style={styles.nameWrap}>
            <Text style={styles.name}>{user_nickname}</Text>
            <Text style={styles.time}>{add_time}</Text>
          </View>
          <Text style={styles.date}>预定发送：{data.send_time}</Text>
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
  },
});
