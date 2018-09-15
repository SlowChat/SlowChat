import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import { post } from '../utils/request'
import ICONS from '../utils/icon'

export default class Notice extends Component {
  static navigationOptions = {
    title: '消息通知',
  }

  state = {
    messag_count: 0,
    notice_count: 0,
  }

  async componentWillMount() {
    this.viewAppear = this.props.navigation.addListener(
      'willFocus', payload => {
        this.getData()
      }
    )
  }

  getData() {
    post('api/user_msg/getUnreadCount.html').then(res => {
      console.log(res);
      const { code, data } = res
      if (code === 1) {
        this.setState({
          messag_count: data[1],
          notice_count: data[2],
        })
      }
    }).catch(e => {
      console.log(e)
    })
  }

  render() {
    const { navigate } = this.props.navigation
    const { notice_count, messag_count } = this.state
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} style={styles.menu} onPress={() => navigate('Message')}>
          <Image style={styles.menuImg} source={require('../images/icon_clock.png')} />
          {messag_count > 0 && <View style={styles.badge}></View> }
          <Text style={styles.menuTxt}>预约发送邮件提醒</Text>
          <Image style={styles.forward} source={ICONS.forward} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={[styles.menu, styles.noborder]} onPress={() => navigate('Notice')}>
          <Image style={styles.menuImg} source={require('../images/icon_inform.png')} />
          {notice_count > 0 && <View style={styles.badge}></View> }
          <Text style={styles.menuTxt}>通知</Text>
          <Image style={styles.forward} source={ICONS.forward} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  menu: {
    position: 'relative',
    flexDirection: 'row',
    alignItems:'center',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  noborder: {
    borderBottomWidth: 0
  },
  forward: {
    width: 24,
    height: 24,
  },
  menuImg: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  menuTxt: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 42,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EC3632'
  }
});
