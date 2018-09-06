import React, {PureComponent} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'
import Loading from '../components/Loading'
import ErrorModal from '../components/ErrorModal'

import { post } from '../utils/request'
import Storage from '../utils/storage'


type Props = {};
export default class Login extends PureComponent<Props> {
  static navigationOptions = {
    header: null,
  }
  state = {
    username: '', // 15216748429
    password: '', // 123456
    showLoading: false
  }
  componentWillUnmount() {
    Keyboard.dismiss()
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  regist = () => {
    this.props.navigation.replace('Regist')
  }

  forget = () => {
    if (this.username.indexOf('@') > -1) {
      this.props.navigation.navigate('EditEmail')
    } else {
      this.props.navigation.navigate('EditPassword', {source: 'login'})
    }
  }
  handleLogin = async () => {
    const { username, password } = this.state
    const disabled = !username.trim() || !password.trim()
    if (disabled || this.loading) return
    const params = {
      username: username.trim(),
      password: password.trim(),
      device_type: Platform.OS == 'ios' ? 'iphone' : 'android'
    }
    const code = Storage.getPushID()
    if (code) {
      params.code = code
    }
    try {
      this.startLoading()
      this.loading = true
      const res = await post('api/user/login.html', params, true)
      if (res.code == 1) {
        const { token, user } = res.data
        await Storage.setToken(token, user)
        const { state, replace, goBack } = this.props.navigation
        const { url, params } = state.params || {}
        if (url) {
          replace(url, params)
        } else {
          goBack()
        }
      } else {
        this.dealError(res.msg)
      }
    } catch (err) {
      console.log(err);
      this.dealError()
    }
  }
  startLoading() {
    this.timer = setTimeout(() => {
      if (this.loading) {
        this.setState({ showLoading: true })
      }
    }, 200)
  }
  goBack = () => {
    this.props.navigation.goBack()
  }

  dealError(txt) {
    this.loading = false
    if (this.state.showLoading) {
      this.setState({ showLoading: false })
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.refs.errorModalRef.show({
      txt: txt || '登录失败，请稍后重试'
    })
  }

  render() {
    const { username, password, showLoading } = this.state
    const disabled = !username.trim() || !password.trim()
    const loginBtnStyle = disabled ? [styles.item, styles.loginBtn, styles.disabled] : [styles.item, styles.loginBtn]
    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
           style={styles.header}>
           <TouchableOpacity activeOpacity={0.8} onPress={() => { this.goBack()}}>
             <Image style={styles.close} source={require('../images/close.png')} />
           </TouchableOpacity>
        </SafeAreaView>
        <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
          <View style={styles.wrap} >
            <Image style={styles.logo} source={require('../images/logo.png')} />
            <ImageBackground style={[styles.item, styles.loginInput]} source={require('../images/login_input.png')}>
              <TextInput value={username} style={styles.input} placeholder="请输入邮箱/手机号" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.setState({ username: text })}
                autoCapitalize="none" underlineColorAndroid='transparent'/>
            </ImageBackground>
            <ImageBackground style={[styles.item, styles.loginInput]} source={require('../images/login_input.png')}>
              <TextInput value={password} secureTextEntry style={styles.input} placeholder="请输入密码" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.setState({ password: text })}
                autoCapitalize="none" underlineColorAndroid='transparent'/>
            </ImageBackground>
            <TouchableOpacity activeOpacity={0.8} style={loginBtnStyle} onPress={this.handleLogin}>
              <Text style={styles.loginTxt}>登 录</Text>
            </TouchableOpacity>
            <View style={styles.bottomBtn}>
              <View style={styles.leftBtn}>
                <TouchableOpacity activeOpacity={0.8} onPress={this.regist}>
                  <Text style={styles.btnTxt}>立即注册</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.rightBtn} onPress={this.forget}>
                <Text style={styles.btnTxt}>忘记密码</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {showLoading && <Loading />}
        <ErrorModal ref="errorModalRef" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  wrap: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingLeft: 20,
    height: 44,
  },
  close: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  logo: {
    width: 86,
    height: 86,
    marginTop: 34,
    marginBottom: 60,
    resizeMode: 'contain',
  },
  item: {
    width: 268,
    height: 44,
  },
  loginInput: {
    marginBottom: 24,
  },
  loginBtn: {
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#D74B80',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
  },
  disabled: {
    backgroundColor: '#e4e4e4',
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
    height: 44,
    paddingLeft: 18,
    justifyContent: 'center',
  },
  bottomBtn: {
    flex: 1,
    flexDirection: 'row',
    width: 268,
  },
  leftBtn: {
    flex: 1,
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
