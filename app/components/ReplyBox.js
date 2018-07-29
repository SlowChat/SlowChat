import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';

export default class ReplyBox extends Component {
  handleReply = () => {
    const { onPress } = this.props
    onPress && onPress()
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="想说点什么？" placeholderTextColor="#B4B4B4" underlineColorAndroid="transparent" />
        <Button style={styles.title} title="发送" color="#E24B92" onPress={this.handleReply}></Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'PingFangSC-Regular',
    backgroundColor: '#FFFFFF',
  },
  input: {
    fontSize: 15,
    color: '#333',
    width: 300,
    height: 32,
    backgroundColor: '#F6F6F6',
    borderRadius: 18,
    paddingLeft: 15,
    paddingRight: 15,
  },
  btn: {
    fontSize: 16,
    color: '#999999',
  },
  title: {
    fontSize: 16,
  }
});


// bottomBox: {
//
// }
