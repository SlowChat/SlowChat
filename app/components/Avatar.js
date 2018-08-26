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
    const { username, avatar, level, onPress } = this.props;
    let source = avatar ? {uri: avatar} : require('../images/default_avatar_160.png')
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.avatarWrap}>
          <Image style={styles.avatar} source={source} />
          <View style={styles.avatarRight}>
            <Text style={styles.name}>{ username }</Text>
            <View style={styles.levelWrap}>
                <Text style={styles.level}>{level}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  avatarWrap: {
    flexDirection: 'row',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#fff'
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 30,
    borderRadius: 40,
  },
  avatarRight: {
    flex: 1,
  },
  name: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#333',
    height: 25,
    lineHeight: 25,
    marginTop: 15,
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
});
