import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import ReplyItem from './ReplyItem'
import ReplyBox from './ReplyBox'

export default class AvatarHeader extends Component {
  handleReply = () => {

  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.leftTxt, styles.txt]}>评论 3</Text>
          <Text style={styles.txt}>浏览 22</Text>
        </View>
        <ReplyItem />
        <ReplyBox />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    height: 37,
  },
  txt: {
    height: 20,
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#999999';
    lineHeight: 20,
  },
  leftTxt: {
    flex: 1,
  },
});
