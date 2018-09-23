import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';

export default class Avatar extends PureComponent {
  render() {
    const { username, avatar, level, onPress, type, isLogin } = this.props;
    const defaultSource = require('../images/default_avatar_160.png')
    let source = avatar ? {uri: avatar} : defaultSource
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {
          type ? (
            <View style={styles.avatarWrap}>
              <Text style={styles.tit}>头像</Text>
              <View style={styles.avatarBg}>
                <ImageBackground resizeMode="cover" style={styles.avatarInfo} source={defaultSource}>
                  <Image resizeMode="cover" defaultSource={defaultSource} style={styles.avatarInfo} source={source} />
                </ImageBackground>
              </View>
            </View>
          ) : (
            <View style={styles.avatarWrap}>
              <View style={styles.avatarBg}>
                <ImageBackground resizeMode="cover" style={styles.avatar} source={defaultSource}>
                  <Image resizeMode="cover" defaultSource={defaultSource} style={styles.avatar} source={source} />
                </ImageBackground>
              </View>
              {
                isLogin ? (
                  <Text style={styles.login}>登录/注册</Text>
                ) : (
                  <View style={styles.avatarRight}>
                    <Text style={styles.name}>{ username }</Text>
                    <View style={styles.levelWrap}>
                        <Text style={styles.level}>{level}</Text>
                    </View>
                  </View>
                )
              }

            </View>
          )
        }

      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  avatarWrap: {
    flexDirection: 'row',
    height: 140,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  avatarBg: {
    width: 90,
    height: 90,
    marginRight: 20,
    borderRadius: 45,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarRight: {
    flex: 1,
  },
  tit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarInfo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#333',
    height: 25,
    lineHeight: 25,
    marginTop: 0,
  },
  levelWrap: {
    marginTop: 10,
    height: 20,
    width: 62,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#eee'
  },
  level: {
    fontSize: 12,
    color: '#999',
  },
  login: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    fontSize: 18,
    color: '#666',
    alignItems: 'center',
    paddingTop: 30,
  }
});
