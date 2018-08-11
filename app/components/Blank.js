import React, { PureComponent } from 'react';

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

export default class Confirm extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.spaceTit}>没有找到相匹配的结果</Text>
        <Text style={styles.spaceTxt}>请尝试搜索其他关键词</Text>
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
  },
  spaceTxt: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24
  }
})
