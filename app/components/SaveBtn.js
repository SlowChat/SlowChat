
import React, { PureComponent } from 'react';

import {
  Text,
  View,
  Keyboard,
  Animated,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-navigation'

export default class SaveBtn extends PureComponent {

  componentWillMount () {
    if (this.props.type == 'bottom' && Platform.OS == 'ios') {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    }
  }

  componentWillUnmount() {
    if (this.props.type == 'bottom' && Platform.OS == 'ios') {
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

  renderBtn() {
    const { onPress } = this.props
    return <TouchableOpacity style={[styles.saveBtn ]} onPress={onPress}>
      <Text style={[styles.saveBtnTxt]}>保存草稿</Text>
    </TouchableOpacity>
  }
  render() {
    if (this.props.type == 'bottom') {
      return (
        <SafeAreaView style={[styles.bottom, styles.saveBtnWrap, , {bottom: this.keyboardHeight}]}>
          {this.renderBtn()}
        </SafeAreaView>
      )
    }
    return (
      <View style={styles.saveBtnWrap}>
        {this.renderBtn()}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  saveBtnWrap: {
    height: 44,
    paddingRight: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF'
  },
  saveBtn: {
    width: 90,
    height: 30,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E24B92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnTxt: {
    fontSize: 16,
    color: '#E24B92',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
})
