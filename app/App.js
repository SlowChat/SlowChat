import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import BottomTabs from './BottomTabs'

import LoginScreen from './login/Login'
import RegistScreen from './login/Regist'

import SendMailScreen from './scenes/SendMail'
import MailDetailScreen from './scenes/MailDetail'
import DraftDetailScreen from './scenes/DraftDetail'
import ReserveDetailScreen from './scenes/ReserveDetail'
import ShareScreen from './scenes/Share'

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
  Home: {
    screen: BottomTabs,
    navigationOptions: {
      header: null
    }
  },
  Login: { screen: LoginScreen },
  Regist: { screen: RegistScreen },
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
  DraftDetail: { screen: DraftDetailScreen },
  ReserveDetail: { screen: ReserveDetailScreen },
  Share: {
    screen: ShareScreen,
    navigationOptions: {
      title: '分享'
    }
  }
}, {
  initialRouteName: 'User',
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
