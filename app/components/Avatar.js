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
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.avatarWrap}>
          {
            avatar ? <Image style={styles.avatar} borderRadius={40} source={{uri: avatar}} />
          : <Image style={styles.avatar} borderRadius={40} source={require('../images/default_avatar_160.png')} />
          }
          <View style={styles.avatarRight}>
            <Text style={styles.name}>{ username }</Text>
            <Text style={styles.level}>{level}</Text>
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
    marginRight: 10,
  },
  avatarRight: {
    flex: 1,
  },
  name: {
    height: 24,
    marginTop: 15,
    fontSize: 18,
    color: '#333'
  },
  level: {
    width: 70,
    height: 20,
    lineHeight: 20,
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    borderRadius: 10,
    color: '#999',
    backgroundColor: '#eee'
  },
});
