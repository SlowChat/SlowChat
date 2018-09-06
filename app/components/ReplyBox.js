import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  // Button,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Animated,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

export default class ReplyBox extends PureComponent {
  state = {
    content: '',
  }
  componentWillMount () {
    this.content = ''
    if (Platform.OS == 'ios') {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      this.keyboardWillShowSub.remove()
      this.keyboardWillHideSub.remove()
    }
  }
  keyboardHeight = new Animated.Value(0)
  keyboardWillShow = (e) => {
    const { duration, endCoordinates: { height } } = e
    Animated.timing(this.keyboardHeight, {
      duration: duration,
      toValue: height,
    }).start()
  }

  keyboardWillHide = (e) => {
    Animated.timing(this.keyboardHeight, {
      duration: e.duration,
      toValue: 0,
    }).start()
  }

  focus() {
    this.refs.input.focus()
  }
  clear() {
    this.content = ''
    if (Platform.OS == 'ios') {
      this.setState({ content: this.content }, () => {
        this.setState({ content: '' })
      })
    } else {
      this.setState({ content: '' })
    }
  }
  handleChange = (txt) => {
    if (Platform.OS == 'ios') {
      this.content = txt
    } else {
      this.setState({ content: txt })
    }
  }
  handleReply = () => {
    const { onReply } = this.props
    const content = Platform.OS == 'ios' ? this.content : this.state.content
    onReply && onReply(content)
  }

  handleEndEditMail = (e) => {
    this.content = e.nativeEvent.text
  }

  returnBox() {
    const { content } = this.state
    return <View style={styles.box}>
      <TextInput ref="input" value={content} style={styles.input}
        placeholder="想说点什么？" placeholderTextColor="#B4B4B4"
        autoCapitalize="none" underlineColorAndroid='transparent'
        onChangeText={this.handleChange} onEndEditing={this.handleEndEditMail}/>
      <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={this.handleReply}>
        <Text style={styles.btnTxt}>发送</Text>
      </TouchableOpacity>
    </View>
  }
  render() {
    if (Platform.OS == 'android') {
      return <View style={styles.container}>
        {this.returnBox()}
      </View>
    }
    return (
      <SafeAreaView style={[styles.container, {bottom: this.keyboardHeight}]} forceInset={{top: 'never', bottom: 'always'}}>
        {this.returnBox()}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF'
  },
  box: {
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
