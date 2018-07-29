import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  PixelRatio
} from 'react-native';

import MailContent from '../components/MailContent'
import ReplyItem from '../components/ReplyItem'
import ReplyBox from '../components/ReplyBox'

const onePx = 1 / PixelRatio.get()

export default class MailDetail extends Component {

  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={data}
          renderItem={(item) => <ReplyItem item={item} />}
          ListHeaderComponent={() => (<View>
            <MailContent />
            <View style={styles.replyHeader}>
              <Text style={[styles.replyComment, styles.replyNum]}>评论 3</Text>
              <Text style={styles.replyNum}>浏览 22</Text>
            </View>
          </View>)}
        />
        <ReplyBox />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    backgroundColor: '#F6F6F6',
  },
  flatlist: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    marginBottom: 10,
  },

  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 37,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: onePx,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF'
  },

  replyNum: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#999999',
  },
  replyComment: {
    flex: 1,
  },
})
