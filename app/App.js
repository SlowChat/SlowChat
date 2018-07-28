import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import BottomTabs from './BottomTabs'

import SendMailScreen from './scenes/SendMail'
import MailDetailScreen from './scenes/MailDetail'


export default createStackNavigator({
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: {
      header: null
    }
  },
  SendMail: { screen: SendMailScreen },
  MailDetail: { screen: MailDetailScreen },
}, {
  initialRouteName: 'SendMail',
  navigationOptions: {
    headerBackTitleVisible: false,
    headerTintColor: '#E24B92',
    style: {
      backgroundColor: '#FFFFFF'
    },
    headerTitleStyle: {
      fontSize: 18,
      fontFamily: 'PingFangSC-Regular',
      color: '#333'
    },
    // headerStyle: {
    //   paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    // }
  }
});
