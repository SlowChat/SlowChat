import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';

import { get, post } from '../utils/request'
import Toast from 'react-native-easy-toast'

import { isMobileNumberSupport } from '../utils/util'
import VerifyCode from '../components/VerifyCode'
import SuccessModal from '../components/SuccessModal'

const ICONS = {
  forward: require('../images/icon_forward.png'),
}

export default class EditPassowrd extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '修改登录密码',
    }
  }
  state = {
    mobile: '',
    vCode: '',
    password: '',
    isVcodeClick: false,
    isSucc: false   //成功提示框
  }
  // componentDidMount() {
  //   const { params } = this.props.navigation.state;
  //   console.log(params.source)
  // }

  handleSubmit = () => {
    const { navigate, pop } = this.props.navigation;
    const { mobile, vCode, password } = this.state;
    const { params } = this.props.navigation.state;
    console.log(params.source)
    let url = '', token = true
    if (params.source) {
      url = 'api/user/passwordForget.html'
      token = false
    } else {
      url = 'api/user/passwordReset.html'
      token = true
    }
    post(url,
      { username: mobile,
        verification_code: vCode,
        password: password
      }, token).then((res) => {
      console.log(res)
      if (res.code === 1) {
        this.refs.toast.show(res.msg);
        setTimeout(() => {
          pop();
        }, 1000)
      } else {
        this.refs.toast.show(res.msg);
      }
    })
  }

  handleVcode = () => {
    const { mobile } = this.state;
    post('api/verification_code/send.html', { username: mobile }, true).then((res) => {
      console.log(res)
      if (res.code == 1) {
        this.refs.toast.show(res.msg);
      } else {
        this.refs.toast.show(res.msg);
      }
    })
  }

  handleChangeMobile = (text) => {
    this.setState({
      mobile: text
    })
    if (text.length >= 11 && isMobileNumberSupport(text)) {
      this.setState({isVcodeClick: true})
    } else {
      this.setState({isVcodeClick: false})
    }
  }

  handleMobile = () => {
    const { mobile } = this.state;
    if (!isMobileNumberSupport(mobile)) this.refs.toast.show('您的手机号输入有误');
  }

  inputVcode = (text) => {
    this.setState({vCode: text})
    if (text.length >= 6) {
      this.setState({
        isClick: true
      })
    }
  }

  onRequestClose = () => {
    this.setState({ isSucc: false })
  }

  showTip = (msg) => {
    this.refs.toast.show(msg)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.link}>
          <View style={styles.menu}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.handleChangeMobile(text)}
              onBlur={() => this.handleMobile()}
              placeholder='请输入您的手机号'
              value={this.state.username}
            />
          <VerifyCode mobile={this.state.mobile} onTip={this.showTip}/>
            {/* <TouchableWithoutFeedback onPress={() => this.handleVcode()}>
              <View style={styles.btn}>
                <Text style={styles.btnTxt}>获取验证码</Text>
              </View>
            </TouchableWithoutFeedback> */}
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>验证码</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.inputVcode(text)}
              placeholder='请输入您的验证码'
              value={this.state.vCode}
            />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>新密码</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({password: text})}
              placeholder='请输入您的新密码'
              value={this.state.password}
            />
          </View>
          <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
            <View style={styles.save}>
              <Text style={styles.saveTxt}>提交</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.remind}>没有绑定手机，
            <Text style={styles.links}>
              邮箱验证修改密码
            </Text>
          </Text>
        </View>
        <Toast ref="toast" position="bottom" />
        <SuccessModal
          txt={'手机号修改成功'}
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
    backgroundColor: '#efefef',
  },
  link: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
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
  label: {
    width: '20%',
    color: '#666'
  },
  input: {
    width: '50%',
    textAlign: 'left',
    color: '#333'
  },
  btn: {
    width: '25%',
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
    width: '80%',
    height: 50,
    marginLeft: '10%',
    marginTop: 50,
    borderRadius: 25,
    backgroundColor: '#E24B92',
    alignItems:'center',
    justifyContent: 'center',
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
