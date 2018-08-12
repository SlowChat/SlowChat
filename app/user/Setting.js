import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import Storage from '../utils/storage'
import Avatar from '../components/Avatar'
import { get, post } from '../utils/request'

const ICONS = {
  forward: require('../images/icon_forward.png'),
}

export default class Setting extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '设置',
    }
  }
  state = {
    switchBtn: true
  }
  handleSwitch = async (value) => {
    const token = await Storage.getToken()
    console.log(token);
    this.setState({
      switchBtn: value
    })
  }

  handleLogout = () => {
    const { email, vCode } = this.state;
    post('api/user/logout.html').then(res => {
      console.log(res)
      if (res.code == 1) {
        Storage.clear()
        this.props.navigation.replace('Login')
      } else {
        this.refs.toast.show(res.msg);
      }
    }).catch(e => {
      this.refs.toast.show('退出失败，请稍后重试');
    })
  }

  render() {
    const { switchBtn } = this.state
    const { navigate } = this.props.navigation;
    const { params = {} } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <Avatar username={params.username} />
        <View style={styles.link}>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditMobile', { mobile: params.mobile })}>
            <Text style={styles.label}>绑定手机号</Text>
            <Text style={styles.text}>{params.mobile}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditEmail', { userEmail: params.userEmail })}>
            <Text style={styles.label}>绑定邮箱</Text>
            <Text style={styles.text}>{params.userEmail}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditPassword')}>
            <Text style={styles.label}>修改密码</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <View style={styles.menu}>
            <Text style={styles.label}>消息提醒</Text>
            <Switch style={styles.switch} value={switchBtn} onValueChange={this.handleSwitch} />
          </View>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('About')}>
            <Text style={styles.label}>关于慢邮</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('FeedBack')}>
            <Text style={styles.label}>用户反馈</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.exitWrap}>
          <TouchableOpacity style={styles.exit} activeOpacity={0.6} onPress={this.handleLogout}>
            <Text style={styles.exitTxt}>退出当前账户</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <Toast ref="toast" position="bottom" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  link: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#efefef',
  },
  menu: {
    backgroundColor: '#fff',
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
    // position: 'absolute',
    // right: 8,
    width: 24,
    height: 24,
  },
  label: {
    flex: 1,
    color: '#666'
  },
  text: {
    // width: '62%',
    // textAlign: 'right',
    color: '#B4B4B4'
  },
  exitWrap: {
    backgroundColor: '#fff',
  },
  exit: {
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
  },
  exitTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#EC3632'
  },
  switch: {
    position: 'absolute',
    right: 15,
  }
});
