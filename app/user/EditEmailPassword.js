import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';

import { get, post } from '../utils/request'
import Toast from 'react-native-easy-toast'

import { isEmail } from '../utils/util'
import VerifyCode from '../components/VerifyCode'
import SuccessModal from '../components/SuccessModal'
import ErrorModal from '../components/ErrorModal'

export default class EditPassowrd extends Component {
  static navigationOptions = {
    title: '修改登录密码',
  }
  constructor(props) {
    super(props)
    const { userEmail } = this.props.navigation.state.params || {}
    this.state = {
      email: userEmail || '',
      vCode: '',
      password: '',
      isClick: false,
      isVcodeClick: false,
      editable: userEmail ? false : true,
      isSucc: false,   //成功提示框
    }
  }

  componentDidMount() {
  }

  handleSubmit = () => {
    const { pop } = this.props.navigation;
    const { email, vCode, password, isClick } = this.state;
    const { params = {} } = this.props.navigation.state;
    console.log(params.source)
    let url = '', token = true
    if (params.source) {
      url = 'api/user/passwordForget.html'
      token = false
    } else {
      url = 'api/user/passwordReset.html'
      token = true
    }
    if (isClick) {
      post(url,
        { username: email,
          verification_code: vCode,
          password: password
        }, token).then((res) => {
        console.log(res)
        if (res.code === 1) {
          this.setState({
            isSucc: true
          })
          // this.refs.toast.show(res.msg);
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
    const { email } = this.state;
    post('api/verification_code/send.html', { username: email }, true).then((res) => {
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

  handleChangeEmail = (text) => {
    const { vCode, password } = this.state;
    this.setState({
        email: text
    })
    this.verifyInput(text, vCode, password)
  }

  handleEmail = () => {
    const { email } = this.state;
    if (!isEmail(email)) this.refs.toast.show('您的邮箱输入有误');
  }

  inputVcode = (text) => {
    const { email, password } = this.state;
    this.setState({vCode: text})
    this.verifyInput(email, text, password)
  }

  inputNewPassword = (text) => {
    const { email, vCode } = this.state;
    this.setState({password: text})
    this.verifyInput(email, vCode, text)
  }

  verifyInput = (email, vCode, password) => {
    if (isEmail(email) && vCode.length >= 6 && password.length >= 6) {
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
    // this.refs.errorModalRef.show({
    //   txt: msg
    // })
  }

  handleJump = () => {
    const { navigate } = this.props.navigation;
    navigate('EditPassword')
  }

  inputComponents = []
  onStartShouldSetResponderCapture = (e) => {
    let target = e.nativeEvent.target
    if(!this.inputComponents.includes(target)) {
      dismissKeyboard()
    }
    return false
  }
  onInputLayout = (e) => {
    this.inputComponents.push(e.nativeEvent.target)
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.link} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
          <View style={styles.menu}>
            <TextInput
              autoCapitalize="none"
              underlineColorAndroid='transparent'
              editable={this.state.editable}
              style={styles.input}
              onChangeText={(text) => this.handleChangeEmail(text)}
              onBlur={() => this.handleEmail()}
              placeholder='请输入您的邮箱地址'
              value={this.state.email}
            />
          <VerifyCode username={this.state.email} onTip={this.showTip}/>
            {/* <TouchableWithoutFeedback onPress={() => this.handleVcode()}>
              <View style={styles.btn}>
                <Text style={styles.btnTxt}>获取验证码</Text>
              </View>
            </TouchableWithoutFeedback> */}
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
          <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
            <View style={[styles.save, this.state.isClick ? styles.active : '']}>
              <Text style={styles.saveTxt}>提交</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.remind}>没有绑定邮箱，
            <Text style={styles.links} onPress={() => this.handleJump()}>
              手机验证修改密码
            </Text>
          </Text>
        </ScrollView>
        <Toast ref="toast" position="center" />
        <ErrorModal ref="errorModalRef" />
        <SuccessModal
          txt="邮箱修改成功"
          btn="返回"
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
    color: '#333'
  },
  btn: {
    width: 90,
    height: 30,
    backgroundColor: '#E24B92',
    borderRadius: 15,
    alignItems:'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: '#fff'
  },
  save: {
    marginLeft: 50,
    marginRight: 50,
    height: 50,
    marginTop: 50,
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
  }
});
