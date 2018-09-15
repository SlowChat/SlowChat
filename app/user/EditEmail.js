import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import Toast from 'react-native-easy-toast'

import { get, post } from '../utils/request'
import { isEmail } from '../utils/util'
import VerifyCode from '../components/VerifyCode'
import SuccessModal from '../components/SuccessModal'
import ErrorModal from '../components/ErrorModal'


export default class EditEmail extends Component {
  static navigationOptions = {
    title: '修改绑定邮箱',
  }
  constructor(props) {
    super(props)
    const { userEmail } = this.props.navigation.state.params || {}
    this.state = {
      email: userEmail || '',
      vCode: '',
      btnText: '',
      status: '',
      isClick: false,
      isVcodeClick: false,
      initStatus: false,  //验证手机
      isSucc: false,   //成功提示框
      editable: userEmail ? false : true,
      resetVertify: false,
    }
  }

  componentDidMount() {
    const { userEmail } = this.props.navigation.state.params || {}
    if (userEmail) {
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
    const { email, vCode, status, isClick } = this.state;
    let url = ''
    if (status=== 'bind') {
      url = 'api/user/bind_email.html'
    } else if (status=== 'check') {
      url = 'api/user/check_old_email.html'
    } else {
      url = 'api/user/edit_email.html'
    }
    if (isClick) {
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
              editable: true,
              resetVertify: !this.state.resetVertify,
            })
          } else {
            this.setState({isSucc: true})
          }
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
        <ScrollView style={styles.link} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
          <View style={styles.menu}>
            <TextInput
              autoCapitalize="none"
              underlineColorAndroid='transparent'
              editable={this.state.editable}
              style={styles.input}
              onChangeText={(text) => this.handleChangeEmail(text)}
              onBlur={() => this.handleEmail()}
              placeholder='请输入您的邮箱'
              value={this.state.email}
            />
            <VerifyCode reset={this.state.resetVertify} username={this.state.email} onTip={this.showTip}  />
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
          <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
            <View style={[styles.save, this.state.isClick ? styles.active : '']}>
              <Text style={styles.saveTxt}>{this.state.btnText}</Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <Toast ref="toast" position="center" />
        <ErrorModal ref="errorModalRef" />
        <SuccessModal
          txt="邮箱绑定成功"
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

});
