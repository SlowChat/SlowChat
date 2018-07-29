import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import BottomTabs from './BottomTabs'

import SendMailScreen from './scenes/SendMail'
import MailDetailScreen from './scenes/MailDetail'
import UserScreen from './user/User'
import SettingScreen from './user/Setting'
import EmailScreen from './user/Email'
import InformationScreen from './user/Information'
import EditMobileScreen from './user/EditMobile'
import EditEmailScreen from './user/EditEmail'
import EditPasswordScreen from './user/EditPassword'
import AboutScreen from './user/About'
import RuleScreen from './user/Rule'
import NoticeScreen from './user/Notice'
import FeedBackScreen from './user/FeedBack'
import IntegralScreen from './user/Integral'

export default createStackNavigator({
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: {
      header: null
    }
  },
  User: { screen: UserScreen },
  Setting: { screen: SettingScreen },
  Email: { screen: EmailScreen },
  Information: { screen: InformationScreen },
  EditMobile: { screen: EditMobileScreen },
  EditEmail: { screen: EditEmailScreen },
  EditPassword: { screen: EditPasswordScreen },
  About: { screen: AboutScreen },
  Rule: { screen: RuleScreen },
  Notice: {screen: NoticeScreen},
  Integral: {screen: IntegralScreen},
  FeedBack: { screen: FeedBackScreen },
  SendMail: { screen: SendMailScreen },
  MailDetail: { screen: MailDetailScreen },
}, {
  initialRouteName: 'Integral',
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
