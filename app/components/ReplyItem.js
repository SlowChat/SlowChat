import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';

const ICONS = {
  head: require('../images/head_placeholder80.png'),
}

export default class ReplyItem extends PureComponent {
  handleReply = () => {
    const { data: {item}, onReply } = this.props
    onReply && onReply(item.id)
  }
  render() {
    const { nobord } = this.props
    const { item: {reply, ...item} } = this.props.data
    const avatarRightClass = nobord ? styles.avatarRight : [styles.avatarRight, styles.borded]

    let { avatar } = item.user || {}
    if (!avatar || avatar.indexOf('http') != 0) {
      avatar = ICONS.head
    }
    return (
      <View style={styles.wrap}>
        <Image style={styles.avatar} source={avatar} />
        <View style={avatarRightClass}>
          <Text style={styles.name}>{item.user.user_nickname}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <View style={styles.bottom}>
            <Text style={styles.date}>发信时间：{item.add_time}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={this.handleReply}>
              <Text style={styles.btn}>回复</Text>
            </TouchableOpacity>
          </View>
          {
            reply && reply.length > 0 && (
              <View style={styles.replyList}>
                {
                  reply.map(item => {
                    return (<View key={item.id} style={styles.reply}>
                      <Text style={[styles.replyTxt, styles.replyName]}>{item.user.user_nickname}：</Text>
                      <Text style={styles.replyTxt}>{item.content}</Text>
                    </View>)
                  })
                }
              </View>
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  avatar: {
    width: 40,
    minWidth: 40,
    height: 40,
    marginRight: 10,
  },
  avatarRight: {
    flex: 1,
    paddingBottom: 15,
  },
  borded: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    marginTop: 4,
    marginBottom: 9,
  },
  btn: {
    fontSize: 14,
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
    flex: 1,
    fontSize: 12,
    color: '#B4B4B4',
    lineHeight: 17
  },
  btn: {
    width: 60,
    textAlign: 'right',
    fontSize: 14,
    color: '#999999',
  },
  replyList: {
    marginTop: 6,
    backgroundColor: '#F6F6F6',
    padding: 6,
    paddingTop: 3,
  },
  reply: {
    flexDirection: 'row',
    marginTop: 3,
  },
  replyName: {
    color: '#E24B92',
  },
  replyTxt: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
    lineHeight: 17
  }
});
