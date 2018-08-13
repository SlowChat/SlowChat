import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import ICONS from '../utils/icon'

export default class AvatarHeader extends Component {
  render() {
    const { username, avatar } = this.props;
    return (
      <View style={styles.avatarWrap}>
        <Image style={styles.avatar} source={ICONS.head} />
        <View style={styles.avatarRight}>
          <Text style={styles.name}>{ username }</Text>
          <Text style={styles.level}>普通会员</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatarWrap: {
    flexDirection: 'row',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#fff'
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  avatarRight: {
    flex: 1,
  },
  name: {
    height: 24,
    marginTop: 15,
    fontSize: 18,
    color: '#333'
  },
  level: {
    width: 70,
    height: 20,
    lineHeight: 20,
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    borderRadius: 10,
    color: '#999',
    backgroundColor: '#eee'
  },
});
