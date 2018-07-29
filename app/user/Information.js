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
    return (
      <View style={styles.container}>
        <Avatar />
        <View style={styles.link}>
          <View style={styles.menu}>
            <Text style={styles.label}>昵称</Text>
            <Text style={styles.text}>Abagael</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>性别</Text>
            <Text style={styles.text}>133****0000@qq.com</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>生日</Text>
            <Text style={styles.text}>1992-10-10</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
        </View>
        <TouchableWithoutFeedback>
          <View style={styles.exit}>
            <Text style={styles.exitTxt}>保存</Text>
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
