import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Switch,
  TouchableWithoutFeedback
} from 'react-native';
import Toast from 'react-native-easy-toast'
import Avatar from '../components/Avatar'
import { get, post } from '../utils/request'
const ICONS = {
  forward: require('../images/icon_forward.png'),
}

export default class Setting extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '设置',
    }
  }
  state = {
    switchBtn: true
  }
  componentDidMount() {

  }

  handleSwitch = (value) => {
    this.setState({
      switchBtn: value
    })
  }

  handleSubmit = () => {
    const { navigate, pop } = this.props.navigation;
    const { email, vCode } = this.state;
    post('api/user/logout.html').then(res => {
      console.log(res)
      if (res.code == 1) {
        navigate('Login')
      } else {
        this.refs.toast.show(res.msg);
      }
    }).catch(e => {
      this.refs.toast.show(res.msg);
    })
  }

  render() {
    const { switchBtn } = this.state
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <Avatar username={params.username} />
        <View style={styles.link}>
          <TouchableWithoutFeedback onPress={() => navigate('EditMobile', { mobile: params.mobile })}>
            <View style={styles.menu}>
              <Text style={styles.label}>绑定手机号</Text>
              <Text style={styles.text}>{params.mobile}</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('EditEmail', { userEmail: params.userEmail })}>
            <View style={styles.menu}>
              <Text style={styles.label}>绑定邮箱</Text>
              <Text style={styles.text}>{params.userEmail}</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('EditPassword')}>
            <View style={styles.menu}>
              <Text style={styles.label}>修改密码</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.menu}>
            <Text style={styles.label}>消息提醒</Text>
            <Switch style={styles.switch} value={switchBtn} onValueChange={this.handleSwitch} />
          </View>
          <TouchableWithoutFeedback onPress={() => navigate('About')}>
            <View style={styles.menu}>
              <Text style={styles.label}>关于慢邮</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('FeedBack')}>
            <View style={styles.menu}>
              <Text style={styles.label}>用户反馈</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
          <View style={styles.exit}>
            <Text style={styles.exitTxt}>退出当前账号</Text>
          </View>
        </TouchableWithoutFeedback>
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
    width: '30%',
    color: '#666'
  },
  text: {
    width: '62%',
    textAlign: 'right',
    color: '#B4B4B4'
  },
  exit: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent: 'center',
  },
  exitTxt: {
    color: '#EC3632'
  },
  switch: {
    position: 'absolute',
    right: 15,
  }
});
