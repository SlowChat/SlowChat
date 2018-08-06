import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';

import { get, post } from '../utils/request'
import Toast from 'react-native-easy-toast'

const ICONS = {
  forward: require('../images/icon_forward.png'),
}

export default class EditMobile extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '修改绑定手机号',
    }
  }
  state = {
    mobile: '',
    vCode: ''
  }
  componentDidMount() {
    
  }

  handleSubmit = () => {
    const { navigate, pop } = this.props.navigation;
    const { mobile, vCode } = this.state;
    post('api/user/bind_mobile.html', { mobile: mobile, verification_code: vCode }).then((res) => {
      pop();
      console.log(res)
      // if (res.code == 1) {
      //   this.refs.toast.show(res.msg);
      // } else {
      //   this.refs.toast.show(res.msg);
      // }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.link}>
          <View style={styles.menu}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({mobile: text})}
              placeholder='请输入您的手机号'
              value={this.state.mobile}
            />
            <View style={styles.btn}>
              <Text style={styles.btnTxt}>获取验证码</Text>
            </View>
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>验证码</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({vCode: text})}
              placeholder='请输入您的验证码'
              value={this.state.vCode}
            />
          </View>
          <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
            <View style={styles.save}>
              <Text style={styles.saveTxt}>绑定</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Toast ref="toast" position="bottom" />
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
    width: '55%',
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
