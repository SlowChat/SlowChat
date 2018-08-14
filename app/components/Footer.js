import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

export default class Footer extends PureComponent {
  render() {
    const { showFoot } = this.props
    if (showFoot === 1) {
      return (
        <View style={styles.nomore}>
          <Text style={styles.nomoreTxt}>
              没有更多数据了
          </Text>
        </View>
      )
    } else if(showFoot === 2) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text style={styles.footerTxt}>正在加载更多数据...</Text>
        </View>
      )
    } else if(showFoot === 0){
      return null
    }
  }
}

const styles = StyleSheet.create({
  nomore: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nomoreTxt: {
    color: '#999999',
    fontSize: 14,
    marginLeft: 5,
  },
  footer:{
    flexDirection:'row',
    height:24,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
  },
  footerTxt: {
    color: '#999999',
    fontSize: 14,
    marginLeft: 5,
  },
});
