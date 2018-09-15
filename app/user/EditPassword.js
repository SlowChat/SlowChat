import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';

import { post } from '../utils/request'
import Toast from 'react-native-easy-toast'
import { isMobileNumberSupport } from '../utils/util'
import VerifyCode from '../components/VerifyCode'
import SuccessModal from '../components/SuccessModal'
import ErrorModal from '../components/ErrorModal'

export default class EditPassowrd extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '修改登录密码',
    }
  }
  constructor(props) {
    super(props)
    const { area_code = '+86', mobile, userEmail } = this.props.navigation.state.params || {}
    this.state = {
      mobile: mobile || '',
      vCode: '',
      password: '',
      area_code: area_code,
      isClick: false,
      isVcodeClick: false,
      isSucc: false,   //成功提示框
      editable: mobile ? false : true,
      userEmail: userEmail || ''
    }
  }

  componentDidMount() {
  }

  handleSubmit = () => {
    const { pop } = this.props.navigation;
    const { mobile, vCode, password, area_code, isClick } = this.state;
    // const { params = {} } = this.props.navigation.state;
    // console.log(params.source)
    let url = '', token = true
    if (mobile.length > 0) {
      url = 'api/user/passwordForget.html'
      token = false
    } else {
      url = 'api/user/passwordReset.html'
      token = true
    }
    if (isClick) {
      post(url,
        { username: mobile,
          verification_code: vCode,
          password: password,
          area_code
        }, token).then((res) => {
        if (res.code === 1) {
          // this.refs.toast.show(res.msg);
          this.setState({
            isSucc: true
          })
          // setTimeout(() => {
          //   pop();
          // }, 1000)
        } else {
          this.refs.errorModalRef.show({
            txt: res.msg
          })
        }
      })
    }
  }

  handleVcode = () => {
    const { mobile } = this.state;
    post('api/verification_code/send.html', { username: mobile }, true).then((res) => {
      console.log(res)
      if (res.code == 1) {
        this.refs.toast.show(res.msg);
      } else {
        this.refs.errorModalRef.show({
          txt: res.msg
        })
      }
    })
  }

  handleChangeMobile = (text) => {
    const { vCode, password } = this.state;
    this.setState({
      mobile: text
    })
    this.verifyInput(text, vCode, password)
  }

  handleMobile = () => {
    const { mobile } = this.state;
    if (!isMobileNumberSupport(mobile)) {
      this.refs.toast.show('您的手机号输入有误');
    }
  }

  inputVcode = (text) => {
    const { mobile, password } = this.state;
    this.setState({vCode: text})
    this.verifyInput(mobile, text, password)
  }

  inputNewPassword = (text) => {
    const { mobile, vCode } = this.state;
    this.setState({password: text})
    this.verifyInput(mobile, vCode, text)
  }

  verifyInput = (mobile, vCode, password) => {
    if (isMobileNumberSupport(mobile) && vCode.length >= 6 && password.length >= 6) {
      this.setState({
        isClick: true
      })
    }
  }

  onRequestClose = () => {
    this.setState({ isSucc: false })
  }

  showTip = (msg) => {
    this.refs.toast.show(msg);
  }

  handleJump = () => {
    const { navigate } = this.props.navigation;
    navigate('EditEmailPassword', {userEmail: this.state.userEmail})
  }

  goAreaCode = () => {
    this.props.navigation.navigate('AreaCode', {
      setAreaCode: (code) => {
        this.setState({ area_code: code })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.link} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
          <View style={styles.menu}>
            <TouchableOpacity activeOpacity={0.8} style={styles.areaCode} onPress={this.goAreaCode}>
              <Text style={styles.areaCodeTxt}>{this.state.area_code}</Text>
              <Image style={styles.triangle} source={require('../images/triangle.png')} />
            </TouchableOpacity>
            <TextInput
              autoCapitalize="none"
              underlineColorAndroid='transparent'
              editable={this.state.editable}
              style={styles.input}
              onChangeText={(text) => this.handleChangeMobile(text)}
              onBlur={() => this.handleMobile()}
              placeholder='请输入您的手机号'
              value={this.state.mobile}
              maxLength={11}
            />
            <VerifyCode username={this.state.mobile} onTip={this.showTip}/>
          </View>
          <View style={styles.menu}>
            <TextInput
              autoCapitalize="none"
              underlineColorAndroid='transparent'
              style={styles.input}
              onChangeText={(text) => this.inputVcode(text)}
              placeholder='请输入您的验证码'
              value={this.state.vCode}
            />
          </View>
          <View style={styles.menu}>
            <TextInput
              autoCapitalize="none"
              underlineColorAndroid='transparent'
              secureTextEntry
              style={styles.input}
              onChangeText={(text) => this.inputNewPassword(text)}
              placeholder='请输入6-12位新密码'
              value={this.state.password}
            />
          </View>
          <TouchableOpacity style={[styles.save, this.state.isClick ? styles.active : '']} onPress={() => this.handleSubmit()}>
            <Text style={styles.saveTxt}>提交</Text>
          </TouchableOpacity>
          <Text style={styles.remind}>没有绑定手机，
            <Text style={styles.links} onPress={() => this.handleJump()}>
              邮箱验证修改密码
            </Text>
          </Text>
        </ScrollView>
        <Toast ref="toast" position="center" />
        <ErrorModal ref="errorModalRef" />
        <SuccessModal
          txt={'密码修改成功'}
          btn={'返回'}
          visible={this.state.isSucc}
          onPress={() => {
            this.props.navigation.pop() // navigate
          }}
          onClose={this.onRequestClose}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  link: {
    flex: 1,
    marginTop: 10,
  },
  menu: {
    flexDirection: 'row',
    height: 44,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    alignItems:'center',
  },
  input: {
    flex: 1,
    textAlign: 'left',
    color: '#333'
  },
  btnTxt: {
    color: '#fff'
  },
  save: {
    height: 50,
    marginTop: 50,
    marginLeft: 54,
    marginRight: 54,
    borderRadius: 25,
    backgroundColor: '#e4e4e4',
    alignItems:'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: '#E24B92',
  },
  saveTxt: {
    color: '#fff',
    fontSize: 18,
  },
  remind: {
    marginTop: 20,
    color: '#E24B92',
    textAlign: 'center'
  },
  links: {
    color: '#E24B92',
    fontSize: 16,
    textDecorationLine: 'underline'
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
});
