import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableWithoutFeedback
} from 'react-native';


const ICONS = {
  forward: require('../images/icon_forward.png'),
}

export default class Setting extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '关于慢邮',
    }
  }

  componentDidMount() {

  }

  handleSwitch = (value) => {
    this.setState({
      switchBtn: value
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.link}>
          <View style={styles.menu}>
            <Text style={styles.label}>网站软件许可协议</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>常见问题</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>积分规则</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
        </View>
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
    width: '60%',
    color: '#666'
  },
  
});
