import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'

export default class SuccessModal extends PureComponent {
  handleComplete = () => {
    this.props.navigation.goBack()
  }
  handleImprove = () => {
    this.props.navigation.replace('Information', { type: 'Information' })
  }
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../images/icon_succeed.png')} style={styles.succIcon} />
        <Text style={styles.succTxt}>注册成功</Text>
        <Text style={styles.succAward}>奖励积分+20分</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.succBtn} onPress={this.handleComplete}>
          <Text style={styles.succBtnTxt}>完 成</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={[styles.succBtn, styles.completeBtn]} onPress={this.handleImprove}>
          <Text style={[styles.succBtnTxt, styles.completeBtnTxt]}>完善资料</Text>
        </TouchableOpacity>
        <Text style={styles.tipTxt}>完善资料可增加积分</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    // justifyContent:'center',
    alignItems:'center',
  },
  succIcon: {
    width: 70,
    height: 70,
    marginTop: 65,
    marginBottom: 28,
  },
  succTxt: {
    height: 25,
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#E24B92',
    lineHeight: 25,
  },
  succAward: {
    height: 22,
    fontSize: 16,
    fontFamily: 'PingFang-SC-Medium',
    color: '#E24B92',
    lineHeight: 22,
    marginTop: 5,
    marginBottom: 48,
  },
  succBtn: {
    width: 268,
    height: 44,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: '#E24B92',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  completeBtn: {
    backgroundColor: '#E24B92',
    marginBottom: 20,
  },
  succBtnTxt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#E24B92',
  },
  completeBtnTxt: {
    color: '#FFFFFF',
  },
  tipTxt: {
    height: 17,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
    lineHeight: 17,
  }
})
