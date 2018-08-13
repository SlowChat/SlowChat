import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Modal,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';

export default class AwardTip extends PureComponent {
  state = {
    visible: false,
  }
  componentWillUnmount() {
    this.clearTimer()
  }
  show() {
    this.setState({ visible: true }, () => {
      this.clearTimer()
      this.delayClose()
    })
  }
  hide = () => {
    this.clearTimer()
    this.setState({ visible: false })
  }

  delayClose() {
    this.timer = setTimeout(() => {
      this.setState({ visible: false })
    }, 5000)
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  render() {
    const { num, txt } = this.props
    const { visible } = this.state
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={() => {this.onRequestClose()}}
      >
        <TouchableWithoutFeedback onPress={this.hide}>
          <View style={styles.awardViewWrap}>
            <ImageBackground style={styles.awardView} source={require('../images/bg_popup.png')}>
              <View style={styles.awardLeft}>
                <Text style={styles.award}>+{num}</Text>
              </View>
              <View style={styles.awardRight}>
                <Text style={styles.awardTxt}>积分奖励+{num}分</Text>
                <Text style={styles.txt}>{txt}</Text>
              </View>
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({
  awardViewWrap: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  awardView: {
    width: 225,
    height: 64,
    backgroundColor: '#E24B92',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems:'center',
  },
  awardLeft: {
    width: 40,
    height: 40,
    marginLeft: 12,
    marginRight: 10,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent:'center',
    alignItems:'center',
  },
  award: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: '#E24B92'
  },
  awardRight: {
    flex: 1,
  },
  awardTxt: {
    height:21,
    fontSize: 15,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
    lineHeight: 21,
  },
  txt: {
    height:20,
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
    lineHeight:20,
  }
})
