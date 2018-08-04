import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';

const ICONS = {
  error: require('../images/icon_error.png')
}

export default class ErrorModal extends PureComponent {
  render() {
    const { txt, visible } = this.props
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={() => {this.onRequestClose()}}
      >
        <View style={styles.errorViewWrap}>
          <View style={styles.errorView}>
            <Image source={ICONS.error} style={styles.errorIcon} />
            <Text style={styles.errorTxt}>{txt}</Text>
          </View>
        </View>
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
