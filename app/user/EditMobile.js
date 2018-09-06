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
import { isMobileNumberSupport } from '../utils/util'
import VerifyCode from '../components/VerifyCode'
import SuccessModal from '../components/SuccessModal'

export default class EditMobile extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '修改绑定手机号',
    }
  }
  constructor(props) {
    super(props)
    const { mobile } = this.props.navigation.state.params || {}
    this.state = {
      mobile: mobile || '',
      vCode: '',
      btnText: '',
      status: '',
      isClick: false,
      isVcodeClick: false,
      initStatus: false,  //验证手机
      isSucc: false,   //成功提示框
      editable: mobile ? false : true,
      resetVertify: false,
    }
  }
  componentDidMount() {
    if (this.props.navigation.state.params.mobile !== '') {
      this.setState({
        btnText: '验证后绑定新手机',
        status: 'check',
        // isVcodeClick: true
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
    const { mobile, vCode, status, isClick } = this.state;
    let url = ''
    if (status=== 'bind') {
      url = 'api/user/bind_mobile.html'
    } else if (status=== 'check') {
      url = 'api/user/check_old_mobile.html'
    } else {
      url = 'api/user/edit_mobile.html'
    }
    if  (isClick) {
      post(url, { mobile: mobile, verification_code: vCode }).then((res) => {
        console.log(res)
        if (res.code == 1) {
          if (status === 'check') {
            this.refs.toast.show(res.msg);
            this.setState({
              mobile: '',
              vCode: '',
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
          this.refs.toast.show(res.msg);
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
        this.refs.toast.show(res.msg);
      }
    })
  }

  handleChangeMobile = (text) => {
    this.setState({
      mobile: text
    })
    // if (text.length >= 11 && isMobileNumberSupport(text)) {
    //   this.setState({isVcodeClick: true})
    // } else {
    //   this.setState({isVcodeClick: false})
    // }
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
        <ScrollView style={styles.link} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
          <View style={styles.menu}>
            <Text style={styles.label}>手机号</Text>
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
          <VerifyCode reset={this.state.resetVertify} username={this.state.mobile} onTip={this.showTip}  />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>验证码</Text>
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
        <SuccessModal
          txt={'手机号绑定成功'}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    backgroundColor: '#efefef',
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
  active: {
    backgroundColor: '#E24B92',
  },
  saveTxt: {
    color: '#fff',
    fontSize: 18,
  },

});
