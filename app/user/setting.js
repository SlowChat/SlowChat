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

import Avatar from '../components/Avatar'

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

  render() {
    const { switchBtn } = this.state
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Avatar />
        <View style={styles.link}>
          <TouchableWithoutFeedback onPress={() => navigate('EditMobile')}>
            <View style={styles.menu}>
              <Text style={styles.label}>绑定手机号</Text>
              <Text style={styles.text}>133****0000</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigate('EditEmail')}>
            <View style={styles.menu}>
              <Text style={styles.label}>绑定邮箱</Text>
              <Text style={styles.text}>133****0000@qq.com</Text>
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
        <TouchableWithoutFeedback>
          <View style={styles.exit}>
            <Text style={styles.exitTxt}>退出当前账号</Text>
          </View>
        </TouchableWithoutFeedback>
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
