import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableWithoutFeedback
} from 'react-native';

import Avatar from '../components/Avatar'
import { get, post } from '../utils/request'

const ICONS = {
  set: require('../images/icon_set.png'),
  info: require('../images/icon_info.png'),
  daka: require('../images/icon_daka.png'),
  person: require('../images/icon_person.png'),
  forward: require('../images/icon_forward.png'),
  integral: require('../images/icon_jifen.png'),
}

let mobile='', userEmail='', username='';
export default class User extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    const { navigate } = navigation;
    return {
      title: '个人中心',
      headerLeft: (
        <View style={styles.icon}>
          <TouchableWithoutFeedback onPress={() => navigate('Setting', { mobile, userEmail, username })}>
            <Image style={styles.set} source={ICONS.set} />
          </TouchableWithoutFeedback>
        </View>
      ),
      headerRight: (
        <View style={styles.icon}>
          <TouchableWithoutFeedback onPress={() => navigate('Notice')}>
            <Image style={styles.info} source={ICONS.info} />
          </TouchableWithoutFeedback>
        </View>
      ),
    }
  }
  
  state = {
    mobile: '',
    userEmail: '',
    username: '',
    sex: 0,
    avatar: '',
    draftCount: 0,
    unsendCount: 0,
    sentCount: 0,
    publicCount: 0,
    birthday: ''
  }
   
  componentWillMount() {
    get('api/user/userInfo.html').then(res => {
      const { code, data } = res
      if (code === 1) {
        console.log(res)
        mobile = data.mobile
        userEmail = data.user_email
        username = data.user_nickname
        this.setState({
          mobile: data.mobile,
          userEmail: data.user_email,
          username: data.user_nickname,
          sex: data.sex,
          avatar: data.avatar,
          draftCount: data.draft_count,
          unsendCount: data.unsend_count,
          sentCount: data.send_count,
          publicCount: data.public_count,
          birthday: data.birthday
        })
      } 
    }).catch(e => {
      console.log(e)
    })
  }

  handerSetting() {
    const { navigate } = this.props.navigation;
    const { mobile, userEmail } = this.state;
    navigate('Setting', { mobile, userEmail })
  }

  render() {
    const { navigate } = this.props.navigation;
    const { username, sex, avatar, birthday, draftCount, unsendCount, sentCount, publicCount } = this.state;
    return (
      <View style={styles.container}>
        <Avatar username={username} avatar={avatar} />
        <View style={styles.remind}>
          <TouchableWithoutFeedback onPress={() => navigate('Email', { status: 'draft' })}>
            <View style={styles.list}>
              <Text style={styles.txt}>草稿箱</Text>
              <Text style={styles.num}>{ draftCount }</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Email', { status: 'reservation' })}>
            <View style={styles.list}>
              <Text style={styles.txt}>预定发送</Text>
              <Text style={styles.num}>{ unsendCount }</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Email', { status: 'sent' })}>
            <View style={styles.list}>
              <Text style={styles.txt}>已发送</Text>
              <Text style={styles.num}>{ sentCount }</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Email', { status: 'public' })}>
            <View style={styles.list}>
              <Text style={styles.txt}>公开内容</Text>
              <Text style={styles.num}>{ publicCount }</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.punch}>
          <View style={styles.punchLeft}>
            <Image style={styles.daka} source={ICONS.daka} />
            <Text style={styles.dakatxt}>今日打卡<Text style={styles.status}>(未完成)</Text></Text>
          </View>
          <View style={styles.punchRight}>
            <Text style={styles.dakeBtn}>立即打卡</Text>
          </View>
        </View>
        <View style={styles.link}>
          <TouchableWithoutFeedback onPress={() => navigate('Information', { username, avatar, sex, birthday })}>
            <View style={styles.menu}>
              <Image style={styles.menuImg} source={ICONS.person} />
              <Text style={styles.menuTxt}>个人资料</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Integral')}>
            <View style={styles.menu}>
              <Image style={styles.menuImg} source={ICONS.integral} />
              <Text style={styles.menuTxt}>我的积分</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Notice')}>
            <View style={styles.menu}>
              <Image style={styles.menuImg} source={ICONS.info} />
              <Text style={styles.menuTxt}>消息通知</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  icon: {
    width: 50,
    height: 50,
  },
  set: {
    width: 25,
    height: 25,
    marginLeft: 8,
    marginTop: 8,
  },
  info: {
    width: 25,
    height: 25,
    marginLeft: 15,
    marginTop: 8,
  },
  remind: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff'
  },
  list: {
    width: '25%',
    height: 50,
    fontSize: 14,
    color: '#666',
    alignItems:'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderRightColor: '#eee'
  },
  txt: {
    color: '#666',
  },
  num: {
    color: '#E24B92',
  },
  punch: {
    flexDirection: 'row',
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    alignItems:'center',
  },
  punchLeft: {
    flexDirection: 'row',
    width: '77%',
    alignItems:'center',
  },
  status: {
    fontSize: 14,
    color: '#999'
  },
  daka: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  punchRight: {
    width: '23%',
    height: 30,
    lineHeight: 30,
    color: '#fff',
    borderRadius: 15,
    backgroundColor: '#E24B92',
    justifyContent: 'center',
    alignItems:'center',
  },
  dakeBtn: {
    color: '#fff'
  },
  link: {
    flex: 1,
    backgroundColor: '#fff'
  },
  menu: {
    flexDirection: 'row',
    height: 44,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#eee',
    alignItems:'center',
  },
  forward: {
    position: 'absolute',
    right: 8,
    width: 24,
    height: 24,
  },
  menuImg: {
    width: 30,
    height: 30,
  },
  menuTxt: {
    flexDirection: 'row',
  }
});
