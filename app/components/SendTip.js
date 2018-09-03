import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

// import LinearGradient from 'react-native-linear-gradient'

const ICONS = {
  1: require('../images/icon_ing.png'),
  2: require('../images/icon_ed.png'),
  3: require('../images/icon_cancel.png'),
  4: require('../images/icon_fail.png'),
}

const STATUS = {
  1: '待发送',
  2: '已完成发送',
  3: '已取消发送',
  4: '发送失败',
}



export default class SendTip extends PureComponent {
  render() {
    const { type, onPress } = this.props
    if (type == null || typeof type == 'undefined') return null
    const style = type == 4 ? styles.fail : null
    return (
      <ImageBackground source={require('../images/condition_bar.png')} style={[styles.container, style]}>
        <Image style={styles.icon} source={ICONS[type]} />
        <Text style={[styles.txt]}>{STATUS[type]}</Text>
        {
          type == 1 && <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={styles.btnWrap}>
              <Text style={styles.btn}>取消发送</Text>
            </View>
          </TouchableOpacity>
        }
      </ImageBackground>
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
    zIndex: 20,
    backgroundColor: '#FB4BBA',
  },
  fail: {
    color: '#F2F2F2',
    backgroundColor: '#F2F2F2',
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
})

// <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 8.5}} colors={['#D74B80', '#FB4BBA']} style={styles.container}>
// </LinearGradient>
