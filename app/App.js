import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import BottomTabs from './BottomTabs'

import SendMailScreen from './scenes/SendMail'

export default createStackNavigator({
  BottomTabs: { screen: BottomTabs },
  SendMail: { screen: SendMailScreen },
  
}, {
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
  }
});
