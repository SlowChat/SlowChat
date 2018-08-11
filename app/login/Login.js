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
  ToastAndroid,
  BackHandler,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'
import ErrorModal from '../components/ErrorModal'

import { post } from '../utils/request'
import Storage from '../utils/storage'

const ICONS = {
  logo: require('../images/logo.png'),
  close: require('../images/close.png'),
  loginInput: require('../images/login_input.png'),
  // loginBtn: require('../images/login_btn.png'),
}

let firstClick = 0;
type Props = {};
export default class Login extends PureComponent<Props> {
  componentWillMount() {
    this.username = '15216748429'
    this.password = '123456'
    const { back = true } = this.props.navigation.state.params || {}
    this.back = back
  }
  componentDidMount() {
    if (Platform.OS === 'android' && !this.back) {
      BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBack);
    }
    
  }
  componentWillUnmount() {
    if (Platform.OS === 'android' && !this.back) {
      BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack);
    }
  }
  handleAndroidBack () {
    let timestamp = (new Date()).valueOf();
    if (timestamp - firstClick > 2000) {
        firstClick = timestamp;
        ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
        return true;
    } else {
        return false;
    }
  }

  regist = () => {
    this.props.navigation.navigate('Regist')
  }
  forget = () => {
    if (this.username.indexOf('@') > -1) {
      this.props.navigation.navigate('EditEmail')
    } else {
      this.props.navigation.navigate('EditPassword')
    }
  }
  handleLogin = async () => {
    const params = {
      username: this.username,
      password: this.password,
      device_type: Platform.OS == 'ios' ? 'iphone' : 'android'
    }
    try {
      const res = await post('api/user/login.html', params, true)
      if (res.code == 1) {
        const { token, user } = res.data
        await Storage.setToken(token, user)
        const { navigation } = this.props
        if (this.back) {
          navigation.goBack()
        } else {
          navigation.navigate('Home')
        }
      } else {
        this.showErrorModal(res.msg || '登录失败，请稍后重试')
      }
    } catch (err) {
      console.error(err);
      this.showErrorModal('登录失败，请稍后重试')
    }
  }

  showErrorModal(txt) {
    this.refs.errorModalRef.show({txt})
  }


  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
           style={styles.header}>
           {this.back && (<TouchableOpacity activeOpacity={0.8} onPress={() => { this.props.navigation.goBack()}}>
             <Image style={styles.close} source={ICONS.close} />
           </TouchableOpacity>)}
        </SafeAreaView>
        <View style={styles.wrap}>
          <Image style={styles.logo} source={ICONS.logo} />
          <ImageBackground style={[styles.item, styles.loginInput]} source={ICONS.loginInput}>
            <TextInput style={styles.input} placeholder="请输入邮箱/手机号" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.username = text}
              autoCapitalize="none" underlineColorAndroid='transparent' />
          </ImageBackground>
          <ImageBackground style={[styles.item, styles.loginInput]} source={ICONS.loginInput}>
            <TextInput secureTextEntry style={styles.input} placeholder="请输入密码" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.password = text}
              autoCapitalize="none" underlineColorAndroid='transparent' />
          </ImageBackground>
          <TouchableOpacity activeOpacity={0.8} style={[styles.item, styles.loginBtn]} onPress={this.handleLogin}>
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
