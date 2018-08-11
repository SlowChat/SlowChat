import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

const ICONS = {
  error: require('../images/icon_error.png')
}

export default class ErrorModal extends PureComponent {
  state = {
    visible: false,
    txt: ''
  }
  componentWillUnmount() {
    this.clearTimer()
  }

  show({txt}) {
    this.setState({ visible: true, txt }, () => {
      this.clearTimer()
      this.delayClose()
    })
  }
  hide = () => {
    this.clearTimer()
    this.setState({ visible: false, txt: '' })
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
    const { txt, visible } = this.state
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={() => {this.onRequestClose()}}
      >
        <TouchableWithoutFeedback onPress={this.hide}>
          <View style={styles.errorViewWrap}>
            <View style={styles.errorView}>
              <Image source={ICONS.error} style={styles.errorIcon} />
              <Text style={styles.errorTxt}>{txt}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({
  errorViewWrap: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  errorView: {
    paddingTop: 40,
    paddingBottom: 40,
    width: 245,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    justifyContent:'center',
    alignItems:'center',
  },
  errorIcon: {
    width: 49,
    height: 50,
    marginBottom: 13,
  },
  errorTxt: {
    height: 25,
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
    lineHeight: 25
  },
})
