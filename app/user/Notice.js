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
  clock: require('../images/icon_clock.png'),
  inform: require('../images/icon_inform.png'),
  forward: require('../images/icon_forward.png'),
}

export default class User extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '消息通知',
    }
  }
  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.link}>
          <View style={styles.menu}>
            <Image style={styles.menuImg} source={ICONS.clock} />
            <Text style={styles.menuTxt}>预约发送邮件提醒</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
          <View style={styles.menu}>
            <Image style={styles.menuImg} source={ICONS.inform} />
            <Text style={styles.menuTxt}>通知</Text>
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
  menuImg: {
    width: 30,
    height: 30,
  },
  menuTxt: {
    flexDirection: 'row',
  }
});
