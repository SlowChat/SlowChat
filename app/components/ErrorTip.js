import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';


export default class ErrorTip extends PureComponent {
  render() {
    const { txt = '重新加载数据', visible, onPress } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.wrap}>
          <Image source={require('../images/error.png')} style={styles.icon} />
          <Text style={styles.txt}>您的网络遇到问题</Text>
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnTxt}>{txt}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 142,
    alignItems:'center',
  },
  wrap: {
    justifyContent:'center',
    alignItems:'center',
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  txt: {
    height: 25,
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#CCCCCC',
    lineHeight: 25,
    marginTop: 20,
    marginBottom: 15,
  },
  btn: {
    width: 170,
    height: 36,
    borderWidth: 1,
    borderColor: '#E24B92',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
  },
  btnTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#E24B92',
  }
})
