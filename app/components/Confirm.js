import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';

export default class Confirm extends PureComponent {
  render() {
    const { tit, leftBtnTxt, rightBtnTxt, autoView, visible, onRequestClose, onLeftPress = () => {}, onRightPress = () => {} } = this.props
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.succViewWrap}>
          <View style={styles.succView}>
            {
              tit && <View style={styles.titWrap}>
                <Text style={styles.tit}>{tit}</Text>
              </View>
            }
            {autoView}
            <View style={styles.btn}>
              <TouchableOpacity activeOpacity={0.8} style={styles.leftBtn} onPress={onLeftPress}>
                <Text style={styles.leftBtnTxt}>{leftBtnTxt}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={styles.rightBtn} onPress={onRightPress}>
                <Text style={styles.rightBtnTxt}>{rightBtnTxt}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({
  succViewWrap: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  succView: {
    width: 275,
    borderRadius: 10,
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  titWrap: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D8D8D8',
  },
  tit: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#666666',
    // paddingTop: 25,
    // paddingBottom: 15,
  },
  cont: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  btn: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D8D8D8',
  },
  leftBtn: {
    flex: 1,
    height: 44,
    alignItems:'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#D8D8D8',
  },
  leftBtnTxt: {
    color: '#999999',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
  },
  rightBtn: {
    flex: 1,
    height: 44,
    alignItems:'center',
    justifyContent: 'center',
  },
  rightBtnTxt: {
    color: '#E24B92',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
  }
})
