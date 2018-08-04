import React, {PureComponent} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import Toast from 'react-native-easy-toast'

const ICONS = {
  logo: require('../images/logo.png'),
  close: require('../images/close.png'),
  loginInput: require('../images/login_input.png'),
  // loginBtn: require('../images/login_btn.png'),
}

import { post } from '../utils/request'

type Props = {};
export default class Login extends PureComponent<Props> {

  regist = () => {
    this.props.navigation.navigate('Regist')
  }
  forget = () => {
    // this.props.navigation.navigate('Regist')
  }
  handleLogin = () => {
    const params = {
      username: this.username,
      password: this.password,
      device_type: Platform.OS == 'ios' ? 'iphone' : 'android'
    }
    post('api/user/login.html', params, true).then(res => {
      if (res.code == 1) {
        const { navigation } = this.props
        if (navigation.state.back) {
          navigation.getBack()
        } else {
          navigation.navigate('Home')
        }
      } else {
        this.refs.toast.show(res.msg || '登录失败，请稍后重试');
      }
    }).catch(e => {
      this.refs.toast.show('登录失败，请稍后重试');
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.closeWrap}>
          <Image style={styles.close} source={ICONS.close} />
        </View>
        <Image style={styles.logo} source={ICONS.logo} />
        <ImageBackground style={[styles.item, styles.loginInput]} source={ICONS.loginInput}>
          <TextInput style={styles.input} autoCapitalize="none" placeholder="请输入邮箱/手机号" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.username = text} />
        </ImageBackground>
        <ImageBackground style={[styles.item, styles.loginInput]} source={ICONS.loginInput}>
          <TextInput password style={styles.input} autoCapitalize="none" placeholder="请输入密码" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.password = text} />
        </ImageBackground>

        <TouchableOpacity style={[styles.item, styles.loginBtn]}>
          <Text style={styles.loginTxt}>登 录</Text>
        </TouchableOpacity>

        <View style={styles.item}>
          <TouchableOpacity style={styles.leftBtn} onPress={this.regist}>
            <Text style={styles.btnTxt}>立即注册</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightBtn} onPress={this.forget}>
            <Text style={styles.btnTxt}>忘记密码</Text>
          </TouchableOpacity>
        </View>
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  close: {
    margin: 10,
  },
  logo: {
    width: 43,
    height: 43,
    marginBottom: 60,
  },
  item: {
    marginLeft: 54,
    marginRight: 54,
    height: 44,
  },
  loginInput: {
    marginBottom: 24,
  },
  loginBtn: {
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#D74B80',
  },
  loginTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
  },
  input: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
  },
  leftBtn: {

  },
  rightBtn: {

  },
  btnTxt: {
    width:48,
    height:17,
    fontSize:12,
    fontFamily: 'PingFangSC-Regular',
    color: '#E24B92',
    lineHeight: 17,
  }
});
