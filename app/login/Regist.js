import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import Loading from '../components/Loading'
import ErrorModal from '../components/ErrorModal'
import VerifyCode from '../components/VerifyCode'
import Storage from '../utils/storage'
import { post } from '../utils/request'

import { isMobileNumberSupport, isEmail } from '../utils/util'

export default class Regist extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    }
  }

  state = {
    activeTab: 0,
    checked: true,
    username: '',
    password: '',
    area_code: '+86',
    verification_code: '',
    resetVertify: false,
    showLoading: false
  }

  componentWillUnmount() {
    Keyboard.dismiss()
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  switchTab(index) {
    if (this.state.activeTab == index) return
    this.setState({
      activeTab: index,
      username: '',
      password: '',
      verification_code: '',
      resetVertify: !this.state.resetVertify,
    })
  }

  // 注册
  handleRegist = () => {
    if (this.isDisable() || this.loading) return
    if (!this.state.checked) {
      this.showErrorModal('请同意慢邮Manyou.info网站软件许可使用协议')
      return
    }
    this.startLoading()
    this.loading = true
    const { activeTab, username, password, verification_code, area_code } = this.state
    const params = {
      username,
      password,
      verification_code,
    }
    if (activeTab == 0) {
      params.area_code = area_code
    }
    post('api/user/register.html', params, true).then(res => {
      if (res.code == 1) {
        // this.props.navigation.replace('RegistSucc')
        this.handleLogin(username, password)
      } else {
        this.dealError(res.msg)
      }
    }).catch(e => {
      this.dealError()
    })
  }

  startLoading() {
    this.timer = setTimeout(() => {
      if (this.loading) {
        this.setState({ showLoading: true })
      }
    }, 200)
  }

  handleLogin = async (username, password) => {
    const params = {
      username: username.trim(),
      password: password.trim(),
      device_type: Platform.OS == 'ios' ? 'iphone' : 'android'
    }
    try {
      const res = await post('api/user/login.html', params, true)
      if (res.code == 1) {
        const { token, user } = res.data
        await Storage.setToken(token, user)
        this.props.navigation.replace('RegistSucc')
      } else {
        this.dealError(res.msg)
      }
    } catch (err) {
      this.dealError()
    }
  }

  dealError(txt) {
    this.loading = false
    if (this.state.showLoading) {
      this.setState({ showLoading: false })
    }
    this.showErrorModal(txt || '注册失败，请稍后重试')
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  goAreaCode = () => {
    this.props.navigation.navigate('AreaCode', {
      setAreaCode: (code) => {
        this.setState({ area_code: code })
      }
    })
  }

  goLogin = () => {
    // this.props.navigation.goBack()
    this.props.navigation.replace('Login')
  }
  goProtocol = () => {
    this.props.navigation.navigate('LocalWebview', {source: 'protocal'})
  }
  showTip = (msg) => {
    this.refs.toast.show(msg)
  }

  showErrorModal(txt) {
    this.refs.errorModalRef.show({txt})
  }
  isDisable() {
    const { activeTab, username, password, verification_code } = this.state
    if (!verification_code || !username || !password) return true
    if (activeTab == 0) {
      if (!isMobileNumberSupport(username)) return true
    } else {
      if (!isEmail(username)) return true
    }
    return false
  }

  renderTabs() {
    const { activeTab } = this.state
    // <StatusBar hidden={true} />
    return (
        <ImageBackground style={styles.headerbg} source={require('../images/bg_register.png')}>
          <View style={styles.tabWrap}>
            <TouchableOpacity activeOpacity={0.8} style={styles.tabItem} onPress={() => this.switchTab(0)}>
              <View style={[styles.tab, activeTab == 0 ? styles.activeTab : {}]}>
                <Text style={styles.tabTxt}>手机号注册</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.tabItem} onPress={() => this.switchTab(1)}>
              <View style={[styles.tab, activeTab == 1 ? styles.activeTab : {}]}>
                <Text style={styles.tabTxt}>邮箱注册</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )
  }
  render() {
    const { checked, username, password, verification_code, activeTab } = this.state
    const verifyStyle = username.trim() ? [styles.verifyTxt, styles.activeVerifyTxt] : styles.verifyTxt
    const placeholder = activeTab == 0 ? '请输入手机号' : '请输入邮箱'
    // const keyboardType = activeTab == 0 ? 'numeric' : 'email-address'
    // keyboardType={keyboardType}
    const registBtnStyle = (!checked || this.isDisable()) ? [styles.registBtn, styles.disabled] : styles.registBtn
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeview}>
          <TouchableOpacity activeOpacity={0.8} onPress={this.goLogin}>
            <Image style={styles.back} source={require('../images/back_w.png')} />
          </TouchableOpacity>
        </SafeAreaView>
        <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
          {this.renderTabs()}
          <View style={styles.wrap}>
            <ImageBackground style={[styles.inputWrap, styles.verifyWrap]} source={require('../images/login_input.png')}>
              <TouchableOpacity activeOpacity={0.8} style={[styles.areaCode, activeTab == 1 && styles.hidden]} onPress={this.goAreaCode}>
              	<Text style={styles.areaCodeTxt}>{this.state.area_code}</Text>
              	<Image style={styles.triangle} source={require('../images/triangle.png')} />
              </TouchableOpacity>
              <TextInput value={username} style={[styles.input, styles.verifyInput]} placeholder={placeholder} placeholderTextColor="#CCCCCC"
               onChangeText={(text) => this.setState({username: text})}
               autoCapitalize="none" underlineColorAndroid='transparent' />
              <View style={styles.divider}></View>
              <VerifyCode type="regist" reset={this.state.resetVertify} username={username} onTip={this.showTip} />
            </ImageBackground>
            <ImageBackground style={styles.inputWrap} source={require('../images/login_input.png')}>
              <TextInput value={verification_code} style={[styles.input, styles.password]} placeholder="请输入验证码" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.setState({verification_code: text})}
                autoCapitalize="none" underlineColorAndroid='transparent' />
            </ImageBackground>

            <ImageBackground style={styles.inputWrap} source={require('../images/login_input.png')}>
              <TextInput maxLength={12} secureTextEntry value={password} style={[styles.input, styles.password]} autoCapitalize="none" placeholder="请输入6-12位密码" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.setState({password: text})}
                underlineColorAndroid='transparent' />
            </ImageBackground>
            <TouchableOpacity activeOpacity={0.8} style={registBtnStyle} onPress={this.handleRegist}>
              <Text style={styles.registTxt}>注 册</Text>
            </TouchableOpacity>
            <View style={styles.tipWrap}>
              <Text style={styles.tip}>已有账号，</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={this.goLogin}>
                <Text style={[styles.tip, styles.activeTip]}>去登陆</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={[styles.tipWrap, styles.checkboxWrap]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ checked: !this.state.checked })}>
            {
              checked ? <Image style={styles.checkbox} source={require('../images/checked.png')} /> : <Image style={styles.checkbox} source={require('../images/unchecked.png')} />
            }
          </TouchableOpacity>
          <Text style={styles.tip}>注册即同意《</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={this.goProtocol}>
            <Text style={[styles.tip, styles.activeTip]}>慢邮Manyou.info 网站软件许可使用协议</Text>
          </TouchableOpacity>
          <Text style={styles.tip}>》</Text>
        </View>
        <SafeAreaView></SafeAreaView>
        {this.state.showLoading && <Loading />}
        <ErrorModal ref="errorModalRef" />
        <Toast ref="toast" position="center" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  headerbg: {
    position: 'relative',
    height: 170,
  },
  safeview: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 10,
  },

  back: {
    width: 30,
    height: 30,
    marginLeft: 15,
  },

  tabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 1,
    flexDirection: 'row',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
  },

  tab: {
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  tabTxt: {
    color: '#FFFFFF',
    fontSize: 15
  },
  wrap: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  hidden: {
    display: 'none',
  },
  txt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#CCCCCC',
  },
  verifyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrap: {
    width: 300,
    height: 44,
    justifyContent: 'center',
    marginBottom: 16,
    paddingLeft: 20,
  },
  input: {
    paddingRight: 10,
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
  },
  password: {
    paddingRight: 20,
  },
  verifyInput: {
    flex: 1,
  },
  verifyBtn: {
    width: 109,
  },
  verifyTxt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#CCCCCC',
  },
  activeVerifyTxt: {
    color: '#E24B92',
  },
  disabled: {
    backgroundColor: '#E4E4E4',
  },
  registBtn: {
    width: 268,
    height: 44,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#D74B80',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
  },
  registTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
  },
  tipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxWrap: {
    paddingTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  tip: {
    height: 17,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#999999',
    lineHeight: 17,
  },
  activeTip: {
    color: '#E24B92'
  },
  checkbox: {
    width: 12,
    height: 12,
    marginRight: 3,
    resizeMode: 'contain'
  },
  divider: {
    width: 2,
    backgroundColor: '#FFFFFF',
    height: 44,
  },
  areaCode: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minWidth: 57,
  },
  areaCodeTxt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
  },
  triangle: {
    width: 20,
    height: 20,
  },
  hidden: {
    display: 'none'
  }
});
