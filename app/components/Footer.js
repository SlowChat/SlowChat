import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

export default class Footer extends PureComponent {
  static defaultProps = {
    safe: true
  };
  render() {
    const { showFoot, safe } = this.props
    const forceInset = safe ? {top: 'never', bottom: 'always'} : {top: 'never', bottom: 'never'}
    if (showFoot === 1) {
      return (
        <SafeAreaView forceInset={forceInset} style={styles.nomore}>
          <Text style={styles.nomoreTxt}>
              没有更多数据了
          </Text>
        </SafeAreaView>
      )
    } else if(showFoot === 2) {
      return (
        <SafeAreaView forceInset={forceInset} style={styles.footer}>
          <ActivityIndicator />
          <Text style={styles.footerTxt}>正在加载更多数据...</Text>
        </SafeAreaView>
      )
    }
    return <SafeAreaView forceInset={forceInset} />
  }
}

// color='#EC3632'

const styles = StyleSheet.create({
  nomore: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
