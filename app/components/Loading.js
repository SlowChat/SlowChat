import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

export default class Loading extends Component {
  shouldComponentUpdate() {
    return false
  }
  render() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          animating
          style={{height: 80}}
          color='#EC3632'
          size='large'
        />
      </View>

    )
  }
}

const styles = StyleSheet.create({
  loading : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    marginTop: -40,
  }
})
