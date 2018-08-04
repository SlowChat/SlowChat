import React, {PureComponent} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native'

import {SafeAreaView} from 'react-navigation'


const ICONS = {
  arrow: require('../images/logo.png'),
  logo: require('../images/logo.png'),
  close: require('../images/close.png'),
  loginInput: require('../images/login_input.png'),
  // loginBtn: require('../images/login_btn.png'),
}

type Props = {};
export default class Regist extends PureComponent<Props> {

  state = {
    switchTab: 'phone'
  }

  // 获取验证码
  sendVerification = () => {
    post('api/verification_code/send.html', {
      username: this.username
    }, true).then(res => {
      this.refs.toast.show(res.msg || '验证码已经发送成功');
    }).catch(e => {
      this.refs.toast.show('验证码发送失败');
    })
  }
  // 注册
  handleRegist = () => {
    const params = {
      username: this.username,
      password: this.password,
      verification_code: this.verification_code
    }
    post('api/user/register.html', params, true).then(res => {
      this.refs.toast.show(res.msg || '登录失败，请稍后重试');
    }).catch(e => {
      this.refs.toast.show('注册失败，请稍后重试');
    })
  }
  renderTabs() {
    return (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
      style={[styles.header]}>
      <Image source={ICONS.arrow} />
      <View style={style.tabs}>
        <View style={style.tab}>
          <Text>手机号注册</Text>
        </View>
        <View style={style.tab}>
          <Text>邮箱注册</Text>
        </View>
      </View>
    </SafeAreaView>)
  }
  render() {
    const { switchTab } = this.state
    let phoneTabStyle, emailTabStyle
    if (switchTab == 'phone') {
      phoneTabStyle = styles.phoneTabStyle
      emailTabStyle = [styles.emailTabStyle, styles.hidden]
    } else {
      phoneTabStyle = [styles.phoneTabStyle, styles.hidden]
      emailTabStyle = styles.emailTabStyle
    }
    return (
      <View style={styles.container}>
        <View style={phoneTabStyle}>
          <View>
            <TextInput style={styles.txt} placeholder="输入验证码" onChangeText={(text) => this.password = text} />
            <TouchableOpacity onPress={this.sendVerification}>
              <Text style={styles.txt}>获取验证码</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput style={styles.txt} placeholder="请输入6-12位密码" onChangeText={(text) => this.password = text} />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={this.handleRegist}>
            <Text style={styles.loginTxt}>注 册</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.loginTxt}>已有账号，</Text>
            <TouchableOpacity onPress={this.goLogin}>
              <Text style={[styles.loginTxt, styles.loginBtn]}>去登陆</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={emailTabStyle}>
          <View>
            <TextInput style={styles.txt} placeholder="输入验证码" onChangeText={(text) => this.password = text} />
            <TouchableOpacity onPress={this.sendVerification}>
              <Text style={styles.txt}>获取验证码</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput style={styles.txt} placeholder="请输入6-12位密码" onChangeText={(text) => this.password = text} />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={this.handleRegist}>
            <Text style={styles.loginTxt}>注 册</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.loginTxt}>已有账号，</Text>
            <TouchableOpacity onPress={this.goLogin}>
              <Text style={[styles.loginTxt, styles.loginBtn]}>去登陆</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  hidden: {
    display: 'none',
  },

  txt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#CCCCCC',
  },

  loginTxt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
    height: 17,
    lineHeight: 17,
  },
  loginBtn: {
    color: '#E24B92',
  }
});
