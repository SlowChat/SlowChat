import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

export default class AvatarHeader extends Component {
  handleReply = () => {
    
  }
  render() {
    return (
      <View style={styles.avatarWrap}>
        <Image style={styles.avatar} source={ICONS.head} />
        <View style={styles.avatarRight}>
          <Text style={styles.name}>给未来的自</Text>
          <Text style={styles.reply}>给未来的自</Text>
          <View>
            <Text style={styles.date}>发信时间：2019年1月10日</Text>
            <TouchableWithoutFeedback onPress={this.handleReply}>
              <Text style={styles.btn}>回复</Text>
            </TouchableWithoutFeedback>
          </View>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatarWrap: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  avatarRight: {
    flex: 1,
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
  btn: {
    height: 20,
    fontSize: 14,
    color: '#999999',
    lineHeight: 20
  }
});
