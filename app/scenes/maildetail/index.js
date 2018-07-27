import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import AavatarHeader from '@components/AavatarHeader'


export default class Share extends Component {

  render() {
    return (
      <View>
        <AavatarHeader />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tipRight: {
    flex: 1;
  }
})
