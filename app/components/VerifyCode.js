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

  onVrfyCode = () => {
    if (this.loading) return
    const { mobile } = this.props;
    this.loading = true
    if (this.isActive) {
      post('api/verification_code/send.html', { username: mobile }, true).then((res) => {
        if (res.code == 1) {
          this.startTimer()
        }
        this.loading = false
        const { onTip } = this.props
        onTip && onTip(res.msg)
      })
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
        this.timer && clearInterval(this.timer)
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
    const { type, mobile } = this.props
    this.isActive = this.state.isVrfy && (isMobileNumberSupport(mobile) || isEmail(mobile))
    return (
      <View>
        {
          this.props.type == 'regist' ? (
            <TouchableOpacity activeOpacity={0.8} style={[styles.registBtn]} onPress={this.onVrfyCode}>
              <Text style={[styles.registTxt, this.isActive ? styles.activeRegistTxt : {}]}>{this.state.vrfyText}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.8} style={[styles.btn, this.isActive ? styles.active : {}]} onPress={this.onVrfyCode}>
              <Text style={styles.btnTxt}>{this.state.vrfyText}</Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    width: '30%',
    height: 30,
    backgroundColor: '#efefef',
    borderRadius: 15,
    alignItems:'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: '#fff'
  },
  active: {
    backgroundColor: '#E24B92',
  },
  // 注册页面用
  registBtn: {
    width: 109,
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
