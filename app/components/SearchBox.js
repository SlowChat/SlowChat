import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

const ICONS = {
  head: require('../images/head_placeholder80.png'),
  eye: require('../images/icon_eyes.png'),
  comment: require('../images/icon_comment.png'),
}

type Props = {};
export default class HomeItem extends PureComponent<Props> {
  render() {
    const { onPress } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>慢友圈</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.search} onPress={() => {
            onPress && onPress()
          }}>
          <Text style={styles.placeholder}>查找您感兴趣的内容</Text>
          <View style={styles.line}></View>
          <Image style={styles.icon} source={require('../images/icon_search.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    marginTop: 20,
    fontFamily: 'PingFangSC-Regular',
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  txt: {
    fontSize: 18,
    color: '#333333',
    marginRight: 15,
  },
  search: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 15,
    height: 30,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  placeholder: {
    flex: 1,
    fontSize: 16,
    color: '#D8D8D8',
  },
  line: {
    width:1,
    height: 22,
    backgroundColor: '#CCCCCC',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
});
