import React, { PureComponent } from 'react';

import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';

export default class Blank extends PureComponent {
  render() {
    const { searchTxt } = this.props
    if (searchTxt) {
      return (
        <View style={styles.container}>
          <Text style={styles.spaceTit}>没有找到相匹配的结果</Text>
          <Text style={styles.spaceTxt}>请尝试搜索其他关键词</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Image style={styles.spaceImg} source={require('../images/error.png')} />
        <Text style={styles.spaceTit}>这里空空如也</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: 170,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spaceTit: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  spaceTxt: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24
  },
  spaceImg: {
    width: 69,
    height: 69,
    marginBottom: 20,
    justifyContent: 'center',
  }
})
