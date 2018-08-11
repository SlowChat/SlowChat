import React, { PureComponent } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';

export default class Loading extends PureComponent {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
