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
    console.log(tit)
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.succViewWrap}>
          <View style={styles.succView}>
            <Text style={styles.tit}>{tit}</Text>
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent:'center',
    alignItems:'center',
  },
  tit: {
    fontSize: 18,
    color: '#777',
    paddingTop: 25,
    paddingBottom: 15,
  },
  cont: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  btn: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#eee',
    
  },
  leftBtn: {
    flexDirection: 'row',
    width: '50%',
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
  },
  leftBtnTxt: {
    color: '#777',
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderRightColor: '#eee' 
  },
  rightBtn: {
    flexDirection: 'row',
    width: '50%',
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
  },
  rightBtnTxt: {
    color: '#E24B92'
  }
})
