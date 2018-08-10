import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { get, post } from '../utils/request'


export default class AvatarHeader extends Component {
  state = {
    vrfyText: '获取验证码',
    isVrfy: false
  }

  componentDidMount() {
    this.setState({isVrfy: this.props.isVrfy})
  }

  componentWillReceiveProps(nextProps) {
    // 根据手机号输入框，更新按钮状态
    if (this.props.isVrfy !== nextProps.isVrfy) this.setState({isVrfy: nextProps.isVrfy}) 
    //验证完老的邮箱和手机号，初始化按钮状态
    if (nextProps.isVrfy) this.setState({vrfyText: '获取验证码'})
  }

  onVrfyCode = () => {
    const { mobile } = this.props;
    if (this.state.isVrfy) {
      post('api/verification_code/send.html', { username: mobile }).then((res) => {
        console.log(res)
        if (res.code == 1) {
          this.refs.toast.show(res.msg);
        } else {
          this.refs.toast.show(res.msg);
        }
      })
      let time = 0;
      this.timer = setInterval(() => {
        if (time < 60) {
          this.setState({
            vrfyText: `${60-time}秒重新获取`,
            isVrfy: false
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
    
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.onVrfyCode()}>
        <View style={[styles.btn, this.state.isVrfy ? styles.active : '']}>
          <Text style={styles.btnTxt}>{this.state.vrfyText}</Text>
        </View>
      </TouchableWithoutFeedback>
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
});
