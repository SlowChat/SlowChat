import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';

const ICONS = {
  head: require('../images/head_placeholder80.png'),
  eye: require('../images/icon_eyes.png'),
  comment: require('../images/icon_comment.png'),
}

type Props = {};
export default class HomeItem extends PureComponent<Props> {
  handleChange = (text) => {
    this.search = text
  }
  handleSubmit = () => {
    this.handleSearch()
  }
  handleSearch = () => {
    const { onPress } = this.props
    onPress && onPress(this.search)
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>慢友圈</Text>
        <View style={styles.search}>
          <TextInput style={styles.input} onChangeText={this.handleChange} onSubmitEditing={this.handleSubmit}
            returnKeyType="search" placeholder="查找您感兴趣的内容" placeholderColor="#D8D8D8"
            autoCorrect={false} autoCapitalize="none" underlineColorAndroid='transparent' />
          <TouchableOpacity activeOpacity={0.8} onPress={this.handleSearch}>
            <Image style={styles.icon} source={require('../images/icon_search.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
// <View style={styles.line}></View>

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
    height: 30,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC',
    paddingLeft: 15,
    paddingRight: 15,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
});
