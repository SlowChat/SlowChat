import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  // Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

export default class ReplyBox extends Component {
  state = {
    content: ''
  }
  focus() {
    this.refs.input.focus()
  }
  clear() {
    this.setState({ content: '' })
  }
  handleChange = (txt) => {
    this.setState({ content: txt })
  }
  handleReply = () => {
    const { onReply } = this.props
    onReply && onReply(this.state.content)
  }
  render() {
    const { content } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <TextInput ref="input" value={content} style={styles.input} placeholder="想说点什么？" placeholderTextColor="#B4B4B4"
          autoCapitalize="none" underlineColorAndroid='transparent' onChangeText={this.handleChange} />
        <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={this.handleReply}>
          <Text style={styles.btnTxt}>发送</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F6F6F6',
  },
  input: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    color: '#333',
    flex: 1,
    height: 32,
    backgroundColor: '#F6F6F6',
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 18,
    paddingLeft: 15,
    paddingRight: 15,
  },
  btn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  btnTxt: {
    color: '#E24B92',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
  }
});
