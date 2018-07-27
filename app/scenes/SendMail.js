import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from 'react-native';

import HeaderTip from '../components/HeaderTip'

export default class SendMail extends Component {
  static navigationOptions = {
    title: '写信',
    headerRight: (
      <Button
        onPress={this.send}
        title='发送'
      />
    ),
  }
  // color={this.state.sendbtnColor}

  state = {
    sendbtnColor: '#F9DBE9'
  }
  send = () => {

  }
  render() {
    return (
      <View>
        <HeaderTip title="爱慢邮——让我们回到未来" />

      </View>
    )
  }
}

// <View style={styles.item}>
//   <Text style={styles.lable}></Text>
//   <View></View>
// </View>
// <View style={styles.item}>
//   <Text style={[styles.lable, styles.flex]}></Text>
// </View>

const styles = StyleSheet.create({
  tipRight: {
    flex: 1,
  }
})
