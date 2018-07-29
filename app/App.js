import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import BottomTabs from './BottomTabs'

import SendMailScreen from './scenes/SendMail'
import MailDetailScreen from './scenes/MailDetail'
import DraftDetailScreen from './scenes/DraftDetail'
import ReserveDetailScreen from './scenes/ReserveDetail'

import ShareScreen from './scenes/Share'

export default createStackNavigator({
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: {
      header: null
    }
  },
  SendMail: { screen: SendMailScreen },
  MailDetail: { screen: MailDetailScreen },
  DraftDetail: { screen: DraftDetailScreen },
  ReserveDetail: { screen: ReserveDetailScreen },
  Share: {
    screen: ShareScreen,
    navigationOptions: {
      title: '分享'
    }
  }
}, {
  initialRouteName: 'BottomTabs',
  navigationOptions: {
    headerBackTitleVisible: false,
    headerTintColor: '#E24B92',
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 0,
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
