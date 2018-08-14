import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';

export default class SuccessModal extends PureComponent {
  render() {
    const { txt, icon, award, btn, visible, onClose = () => {}, onPress = () => {} } = this.props
    const succIcon = icon ? icon : require('../images/icon_succeed.png');
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.succViewWrap}>
          <View style={styles.succView}>
            <Image source={succIcon} style={styles.succIcon} />
            <Text style={styles.succTxt}>{txt}</Text>
            {
              award && <Text style={styles.awardTxt}>积分奖励+{award}分</Text>
            }
            {
              btn && <TouchableOpacity activeOpacity={0.8} style={styles.succBtn} onPress={onPress}>
                <Text style={styles.succBtnTxt}>{btn}</Text>
              </TouchableOpacity>
            }
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
    height: 222,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent:'center',
    alignItems:'center',
  },
  succBtn: {
    width: 155,
    height: 36,
    borderRadius: 36,
    marginBottom: 34,
    marginTop: 25,
    backgroundColor: '#E24B92',
    justifyContent: 'center',
    alignItems: 'center',
  },
  succBtnTxt: {
    height: 22,
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  succIcon: {
    width: 40,
    height: 40,
    marginTop: 40,
    marginBottom: 25,
  },
  succTxt: {
    height: 22,
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#777777',
    lineHeight: 22,
  },
  awardTxt: {
    color: '#E24B92',
    paddingTop: 10
  }
})
