import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PixelRatio
} from 'react-native';

import ReplyItem from './ReplyItem'

const onePx = 1 / PixelRatio.get()


export default class ReplyList extends PureComponent {
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
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
        <ReplyItem nobord />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 37,
    borderBottomWidth: onePx,
    borderBottomColor: '#EEEEEE',
  },
  txt: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#999999',
  },
  leftTxt: {
    flex: 1,
  },
});
