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

export default class AvatarHeader extends PureComponent {
  handleReply = () => {

  }
  render() {
    const { nobord } = this.props
    const avatarRightClass = nobord ? styles.avatarRight : [styles.avatarRight, styles.borded]
    return (
      <View style={styles.wrap}>
        <Image style={styles.avatar} source={ICONS.head} />
        <View style={avatarRightClass}>
          <Text style={styles.name}>给未来的自</Text>
          <Text style={styles.reply}>给未来的自</Text>
          <View style={styles.bottom}>
            <Text style={styles.date}>发信时间：2019年1月10日</Text>
            <TouchableOpacity onPress={this.handleReply}>
              <View onPress={this.handleReply}>
                <Text style={styles.btn}>回复</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    height: 40,
    marginRight: 10,
  },
  avatarRight: {
    flex: 1,
    paddingBottom: 15,
  },
  borded: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reply: {
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
  }
});
