import React, {PureComponent} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ImageBackground,
  CheckBox,
  TouchableOpacity
} from 'react-native'

import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import { post } from '../utils/request'


const ICONS = {
  back: require('../images/back_w.png'),
  checked: require('../images/checked.png'),
  unchecked: require('../images/unchecked.png'),
  loginInput: require('../images/login_input.png'),
  // loginBtn: require('../images/login_btn.png'),
}

type Props = {};
export default class Regist extends PureComponent<Props> {
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
    verification_code: ''
  }

  switchTab(index) {
    this.setState({
      activeTab: index,
      username: '',
      password: '',
      verification_code: ''
    })
  }

  // 获取验证码
  sendVerification = () => {
    post('api/verification_code/send.html', {
      username: this.state.username
    }, true).then(res => {
      this.refs.toast.show(res.msg || '验证码已经发送成功');
    }).catch(e => {
      this.refs.toast.show('验证码发送失败');
    })
  }
  // 注册
  handleRegist = () => {
    if (!this.state.checked) {
      this.refs.toast.show('请同意慢邮Manyou.info网站软件许可使用协议')
      return
    }
    const { username, password, verification_code } = this.state
    const params = {
      username,
      password,
      verification_code
    }
    post('api/user/register.html', params, true).then(res => {
      if (res.code == 1) {
        this.props.navigation.replace('RegistSucc')
      } else {
        this.refs.toast.show(res.msg || '登录失败，请稍后重试')
      }
    }).catch(e => {
      this.refs.toast.show('注册失败，请稍后重试')
    })
  }
  goLogin = () => {
    this.props.navigation.replace('Login', {back: true})
  }
  renderTabs() {
    const { activeTab } = this.state
    return (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
      style={[styles.header]}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => {this.props.navigation.goBack()}}>
        <Image style={styles.back} source={ICONS.back} />
      </TouchableOpacity>
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
    </SafeAreaView>)
  }
  render() {
    const { checked, username, password, verification_code } = this.state
    const verifyStyle = username ? [styles.verifyTxt, styles.activeVerifyTxt] : styles.verifyTxt
    return (
      <View style={styles.container}>
        {this.renderTabs()}
        <View style={styles.wrap}>
          <ImageBackground style={[styles.inputWrap, styles.verifyWrap]} source={ICONS.loginInput}>
            <TextInput value={username} style={[styles.input, styles.verifyInput]} autoCapitalize="none" placeholder="请输入手机号" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.setState({username: text})}
              underlineColorAndroid='transparent' />
            <TouchableOpacity activeOpacity={0.8} style={styles.verifyBtn} onPress={this.sendVerification}>
              <Text style={verifyStyle}>获取验证码</Text>
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground style={styles.inputWrap} source={ICONS.loginInput}>
            <TextInput value={verification_code} style={[styles.input, styles.password]} autoCapitalize="none" placeholder="请输入验证码" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.setState({verification_code: text})}
              underlineColorAndroid='transparent' />
          </ImageBackground>

          <ImageBackground style={styles.inputWrap} source={ICONS.loginInput}>
            <TextInput maxLength={12} secureTextEntry value={password} style={[styles.input, styles.password]} autoCapitalize="none" placeholder="请输入6-12位密码" placeholderTextColor="#CCCCCC" onChangeText={(text) => this.setState({password: text})}
              underlineColorAndroid='transparent' />
          </ImageBackground>
          <TouchableOpacity activeOpacity={0.8} style={styles.registBtn} onPress={this.handleRegist}>
            <Text style={styles.registTxt}>注 册</Text>
          </TouchableOpacity>
          <View style={styles.tipWrap}>
            <Text style={styles.tip}>已有账号，</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={this.goLogin}>
              <Text style={[styles.tip, styles.activeTip]}>去登陆</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.tipWrap, styles.checkboxWrap]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ checked: !this.state.checked })}>
              {
                checked ? <Image style={styles.checkbox} source={ICONS.checked} /> : <Image style={styles.checkbox} source={ICONS.unchecked} />
              }
            </TouchableOpacity>
            <Text style={styles.tip}>注册即同意《</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={this.goLogin}>
              <Text style={[styles.tip, styles.activeTip]}>慢邮Manyou.info 网站软件许可使用协议</Text>
            </TouchableOpacity>
            <Text style={styles.tip}>》</Text>
          </View>
        </View>
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
  header: {
    position: 'relative',
    backgroundColor: '#D74B80',
    height: 170,
  },

  back: {
    width: 22,
    height: 22,
    marginLeft: 15,
    // marginTop: 17,
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
  },

  wrap: {
    flex: 1,
    marginTop: 60,
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
  },
  input: {
    paddingLeft: 20,
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
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
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
  }
});