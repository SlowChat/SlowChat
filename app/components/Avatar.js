import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

export default class Avatar extends PureComponent {
  render() {
    const { username, avatar, level, onPress, type, isLogin } = this.props;
    console.log(type)
    let source = avatar ? {uri: avatar} : require('../images/default_avatar_160.png')
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {
          type ? (
            <View style={styles.avatarWrap}>
              <Text style={styles.tit}>头像</Text>
              <Image style={styles.avatarInfo} source={source} />
            </View>
          ) : (
            <View style={styles.avatarWrap}>
              <Image style={styles.avatar} source={source} />
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
  avatar: {
    width: 90,
    height: 90,
    marginRight: 20,
    borderRadius: 45,
    borderWidth: 5,
    borderColor: '#F6F6F6',
    // borderStyle: 'solid'
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 90,
    height: 90,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#F6F6F6',
    backgroundColor: '#ff0000'
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
