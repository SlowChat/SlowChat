import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

import JPushModule from 'jpush-react-native';

import ICONS from '../utils/icon'
import Avatar from '../components/Avatar'
import { get, post } from '../utils/request'
import SuccessModal from '../components/SuccessModal'

let mobile='', userEmail='', username='', msgCount=0;
export default class User extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    const { navigate } = navigation;
    return {
      title: '个人中心',
      headerLeft: (
        <View style={styles.icon}>
          <TouchableWithoutFeedback onPress={() => navigate('Setting', { mobile, userEmail, username })}>
            <Image style={styles.set} source={require('../images/icon_set.png')} />
          </TouchableWithoutFeedback>
        </View>
      ),
      headerRight: (
        <View style={styles.icon}>
          <TouchableWithoutFeedback onPress={() => navigate('Notice')}>
            <View>
              <Image style={styles.info} source={require('../images/icon_info.png')} />
              {
                msgCount ? (
                  <View style={styles.msgCount}><Text style={{color: '#fff'}}>{msgCount}</Text></View>
                ) : null
              }
            </View>
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
    birthday: '',
    sign: {},
    msgCount: 0,
    isSucc: false,
    award: 0,  //打卡积分
    awardDay: 0
  }

  componentWillMount() {
    get('api/user/userInfo.html').then(res => {
      const { code, data } = res
      if (code === 1) {
        console.log('---------',res)

        if (data.sign && data.sign.desc) this.setState({ sign: data.sign })
        mobile = data.mobile
        userEmail = data.user_email
        username = data.user_nickname
        msgCount = data.msg_count
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

          birthday: data.birthday,
          msgCount: data.msg_count
        })
      }
    }).catch(e => {
      console.log(e)
    })
  }

  componentDidMount() {
    // 接收自定义消息
    JPushModule.addReceiveCustomMsgListener((message) => {
      // this.setState({pushMsg: message});
    })
    // 接收推送通知
    JPushModule.addReceiveNotificationListener((message) => {
      console.log("receive notification: " + message);
    });
    // 打开通知
    JPushModule.addReceiveOpenNotificationListener((map) => {
      console.log("Opening notification!");
      console.log("map.extra: " + map.extras);
      // 可执行跳转操作，也可跳转原生页面
      // this.props.navigation.navigate("SecondActivity");
    });
  }
  
  componentWillUnmount() {
    JPushModule.removeReceiveCustomMsgListener();
    JPushModule.removeReceiveNotificationListener();
  }

  handerSetting() {
    const { navigate } = this.props.navigation;
    const { mobile, userEmail } = this.state;
    navigate('Setting', { mobile, userEmail })
  }

  handleDaka() {
    post('api/user/sign.html').then(res => {
      const { code, data } = res
      console.log('1111111', res)
      if (code === 1) {
        this.setState({
          isSucc: true,
          sign: {
            score: 15,
            desc: '连续打卡4天'
          }
        })
      }
    }).catch(e => {
      console.log(e)
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    const { username, sex, avatar, birthday, draftCount, unsendCount, sentCount, publicCount, sign, msgCount } = this.state;
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
            <Image style={styles.daka} source={require('../images/icon_daka.png')} />
            <Text style={styles.dakatxt}>今日打卡
              {
                sign.desc ? (
                  <Text style={styles.status}>(完成+{sign.score}积分)</Text>
                ) : (
                  <Text style={styles.status}>(未完成)</Text>
                )
              }
            </Text>
          </View>
          {
            sign.desc ? (
              <Text style={styles.dakaTxt}>{sign.desc}</Text>
            ) : (
              <TouchableWithoutFeedback onPress={() => this.handleDaka()}>
                <View style={styles.punchRight}>
                  <Text style={styles.dakeBtn}>立即打卡</Text>
                </View>
              </TouchableWithoutFeedback>
            )
          }
        </View>
        <View style={styles.link}>
          <TouchableWithoutFeedback onPress={() => navigate('Information', { username, avatar, sex, birthday })}>
            <View style={styles.menu}>
              <Image style={styles.menuImg} source={require('../images/icon_person.png')} />
              <Text style={styles.menuTxt}>个人资料</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Integral')}>
            <View style={styles.menu}>
              <Image style={styles.menuImg} source={require('../images/icon_jifen.png')} />
              <Text style={styles.menuTxt}>我的积分</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('Notice')}>
            <View style={styles.menu}>
              <Image style={styles.menuImg} source={require('../images/icon_info.png')} />
              {
                msgCount ? (
                  <View style={styles.msgCount}><Text style={{color: '#fff'}}>{msgCount}</Text></View>
                ) : null
              }
              <Text style={styles.menuTxt}>消息通知</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <SuccessModal
          icon={require('../images/daka_l.png')}
          txt={'本月连续打卡第4天'}
          award={true}
          btn={'返回'}
          visible={this.state.isSucc}
          onPress={() => {
            this.setState({isSucc: false}) // navigate
          }}
        />
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
  dakaTxt: {
    width: '23%',
    color: '#E24B92',
    textAlign: 'right',
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
    marginRight: 15
  },
  menuTxt: {
    flexDirection: 'row',
  },
  msgCount: {
    position: 'absolute',
    top: 5,
    left: 25,
    width: 18,
    height: 18,
    borderRadius: 25,
    backgroundColor: '#EC3632',
    color: '#fff',
    justifyContent: 'center',
    alignItems:'center',
  }
});
