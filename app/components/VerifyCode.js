import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import { post } from '../utils/request'
import { isMobileNumberSupport, isEmail } from '../utils/util'

export default class VerifyCode extends PureComponent {
  state = {
    vrfyText: '获取验证码',
    isVrfy: true
  }

  // componentDidMount() {
  //   // this.setState({isVrfy: this.props.isVrfy})
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.reset !== nextProps.reset) {
      this.clearTimer()
      this.setState({
        vrfyText: '获取验证码',
        isVrfy: true
      })
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   // 根据手机号输入框，更新按钮状态
  //   if (this.props.isVrfy !== nextProps.isVrfy) {
  //     // this.setState({isVrfy: nextProps.isVrfy})
  //     if (nextProps.isVrfy) {
  //       //验证完老的邮箱和手机号，初始化按钮状态
  //       this.setState({vrfyText: '获取验证码', isVrfy: true})
  //     }
  //   }
  // }
  componentWillUnmount() {
    this.clearTimer()
  }

  onVrfyCode = async () => {
    if (this.loading) return
    const { username } = this.props;
    this.loading = true
    if (this.isActive) {
      this.startTimer()
      try {
        const res = await post('api/verification_code/send.html', { username }, true)
        this.loading = false
        const { onTip } = this.props
        onTip && onTip(res.msg)
      } catch (e) {
        this.loading = false
        this.clearTimer()
        this.setState({
          vrfyText: '获取验证码',
          isVrfy: true
        })
        const { onTip } = this.props
        onTip && onTip('验证码发送失败')
      }
    }
  }

  startTimer() {
    this.clearTimer()
    let time = 0;
    this.setState({
      vrfyText: `60秒重新获取`,
      isVrfy: false
    });
    this.timer = setInterval(() => {
      if (time < 60) {
        this.setState({
          vrfyText: `${60-time}秒重新获取`,
        });
        time ++;
      } else {
        this.setState({
          vrfyText: '获取验证码',
          isVrfy: true
        });
        time = 0;
        this.clearTimer()
      }
    }, 1000);
  }
  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  render() {
    const { type, username } = this.props
    this.isActive = this.state.isVrfy && (isMobileNumberSupport(username) || isEmail(username))
    if (type == 'regist') {
      return (<TouchableOpacity activeOpacity={0.7} style={[styles.registBtn]} onPress={this.onVrfyCode}>
        <Text style={[styles.registTxt, this.isActive ? styles.activeRegistTxt : {}]}>{this.state.vrfyText}</Text>
      </TouchableOpacity>)
    }
    return (<TouchableOpacity activeOpacity={0.7} style={[styles.btn, this.isActive ? styles.active : {}]} onPress={this.onVrfyCode}>
      <Text style={styles.btnTxt}>{this.state.vrfyText}</Text>
    </TouchableOpacity>)
  }
}

const styles = StyleSheet.create({
  btn: {
    width: 90,
    height: 30,
    backgroundColor: '#e4e4e4',
    borderRadius: 15,
    alignItems:'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  btnTxt: {
    color: '#fff'
  },
  active: {
    backgroundColor: '#E24B92',
  },
  // 注册页面用
  registBtn: {
    width: 105,
    zIndex: 10,
    alignItems: 'center'
  },
  registTxt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#CCCCCC',
  },
  activeRegistTxt: {
    color: '#E24B92',
  },
});


// <TouchableOpacity activeOpacity={0.8} style={styles.verifyBtn} onPress={this.sendVerification}>
//   <Text style={verifyStyle}>获取验证码</Text>
// </TouchableOpacity>
