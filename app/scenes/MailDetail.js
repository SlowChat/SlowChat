import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image
} from 'react-native';

import MailContent from '../components/MailContent'
import ReplyList from '../components/ReplyList'
import ReplyBox from '../components/ReplyBox'

export default class MailDetail extends Component {

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <MailContent />
          <ReplyList />
        </ScrollView>
        <ReplyBox />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    backgroundColor: '#F6F6F6',
  },

})
