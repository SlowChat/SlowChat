import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PixelRatio
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient'

const ICONS = {
  ing: require('../images/icon_ing.png'),
  ed: require('../images/icon_ed.png'),
  cancel: require('../images/icon_cancel.png'),
}

const STATUS = {
  ing: '待发送',
  ed: '',
  cancel: '',
}

export default class SendTip extends PureComponent {
  render() {
    const { type } = this.props
    return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#D74B80', '#FB4BBA']} style={styles.container}>
        <Image style={styles.icon} source={ICONS[type]} />
        <Text style={styles.txt}>{STATUS[type]}</Text>
        <View style={styles.btnWrap}>
          <Text style={styles.btn}>取消发送</Text>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingLeft: 30,
    paddingRight: 15,
    // backgroundColor: 'linear-gradient(-135deg,rgba(251,75,186,1),rgba(215,75,128,1))',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  txt: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF'
  },
  btnWrap: {
    width: 90,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius:16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    fontSize: 16,
    color: '#666666',
  }
});
