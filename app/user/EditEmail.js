import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import Toast from 'react-native-easy-toast'

import { get, post } from '../utils/request'
import { isEmail } from '../utils/util'
import VerifyCode from '../components/VerifyCode'
import SuccessModal from '../components/SuccessModal'

const ICONS = {
  forward: require('../images/icon_forward.png'),
}

export default class EditEmail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '修改绑定邮箱',
    }
  }
  state = {
    email: this.props.navigation.state.params.userEmail,
    vCode: '',
    btnText: '',
    status: '',
    isClick: false,
    isVcodeClick: false,
    initStatus: false,  //验证手机
    isSucc: false   //成功提示框
  }
  componentDidMount() {
    if (this.props.navigation.state.params.userEmail !== '') {
      this.setState({
        btnText: '验证后绑定新邮箱',
        status: 'check'
      })
    } else {
      this.setState({
        btnText: '绑定',
        status: 'bind'
      })
    }
  }

  handleSubmit = () => {
    const { navigate, pop } = this.props.navigation;
    const { email, vCode, status } = this.state;
    let url = ''
    if (status=== 'bind') {
      url = 'api/user/bind_email.html'
    } else if (status=== 'check') {
      url = 'api/user/check_old_email.html'
    } else {
      url = 'api/user/edit_email.html'
    }
    post(url, { email: email, verification_code: vCode }, false).then((res) => {
      if (res.code == 1) {
        if (status === 'check') {
          this.refs.toast.show(res.msg);
          this.setState({
            email: '',
            vCode: '',
            status: '',
            status: '',
            btnText: '绑定',
            isClick: false,
            initStatus: true,
            isVcodeClick: false
          })
        } else {
          this.setState({isSucc: true})
        }
      } else {
        this.refs.toast.show(res.msg);
      }
    })
  }

  handleVcode = () => {
    const { email } = this.state;
    post('api/verification_code/send.html', { username: email }).then((res) => {
      console.log(res)
      if (res.code == 1) {
        this.refs.toast.show(res.msg);
      } else {
        this.refs.toast.show(res.msg);
      }
    })
  }

  handleChangeEmail = (text) => {
    this.setState({
      email: text
    })
    if (text.length >= 11 && isEmail(text)) {
      this.setState({isVcodeClick: true})
    } else {
      this.setState({isVcodeClick: false})
    }
  }

  handleEmail = () => {
    const { email } = this.state;
    if (!isEmail(email)) this.refs.toast.show('您的邮箱地址输入有误');
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.link}>
          <View style={styles.menu}>
            <Text style={styles.label}>邮箱</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.handleChangeEmail(text)}
              onBlur={() => this.handleEmail()}
              placeholder='请输入您的邮箱'
              value={this.state.email}
            />
            <TouchableWithoutFeedback onPress={() => this.handleVcode()}>
              <View style={styles.btn}>
                <Text style={styles.btnTxt}>获取验证码</Text>
              </View>
            </TouchableWithoutFeedback>
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
          <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
            <View style={[styles.save, this.state.isClick ? styles.active : '']}>
              <Text style={styles.saveTxt}>{this.state.btnText}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Toast ref="toast" position="bottom" />
        <SuccessModal
          txt={'邮箱绑定成功'}
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
    backgroundColor: '#efefef',
    alignItems:'center',
    justifyContent: 'center',
  },
  saveTxt: {
    color: '#fff',
    fontSize: 18,
  },

});
