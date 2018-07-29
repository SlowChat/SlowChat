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

export default class Integral extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '我的积分',
      headerRight: (
        <View style={styles.icon}>
          <Text style={styles.ruleBtn}>积分规则</Text>
        </View>
      ),
    }
  }
  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.integralBox}>
          <Text style={styles.tit}>我的积分</Text>
          <Text style={styles.score}>100</Text>
        </View>
        <View style={styles.list}>
          <View style={styles.left}>
            <Text style={styles.time}>2018-05-11</Text>
            <Text style={styles.detail}>连续2天打卡</Text>
          </View>
          <Text style={styles.right}>
            +10
          </Text>
        </View>
        <View style={styles.list}>
          <View style={styles.left}>
            <Text style={styles.time}>2018-05-11</Text>
            <Text style={styles.detail}>连续2天打卡</Text>
          </View>
          <Text style={styles.right}>
            +10
          </Text>
        </View>
        <View style={styles.list}>
          <View style={styles.left}>
            <Text style={styles.time}>2018-05-11</Text>
            <Text style={styles.detail}>连续2天打卡</Text>
          </View>
          <Text style={styles.right}>
            +10
          </Text>
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
  ruleBtn: {  
    paddingRight: 15,
    color: '#E24B92',
    fontSize: 18
  },
  integralBox: {
    paddingTop: 50,
    paddingBottom: 50,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  tit: {
    fontSize: 18,
    color: '#666'
  },
  score: {
    color: '#E24B92',
    fontSize: 40,
  },
  list: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems:'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  left: {
    width: '80%'
  },
  time: {
    fontSize: 14,
    color: '#999',
    marginBottom: 3
  },
  detail: {
    fontSize: 18
  },
  right: {
    flexDirection: 'row',
    width: '20%',
    textAlign: 'right',
    color: '#E24B92',
    fontSize: 18
  },
});
