import React, {Component, PureComponent} from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import StartScreen from './Start'
import BottomTabs from './BottomTabs'

import LoginScreen from './login/Login'
import RegistScreen from './login/Regist'
import RegistSuccScreen from './login/RegistSucc'
import ErrorTipScreen from './components/ErrorTip'

import NewMailScreen from './scenes/NewMail'
import MailDetailScreen from './scenes/MailDetail'
import DraftDetailScreen from './scenes/DraftDetail'
// import ReserveDetailScreen from './scenes/ReserveDetail'
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
  Start: {
    screen: StartScreen,
    navigationOptions: {
      header: null
    }
  },
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: LoginScreen,
    mode: 'modal',
    navigationOptions: {
      header: null,
    }
  },
  User: { screen: UserScreen },
  Regist: { screen: RegistScreen },
  RegistSucc: { screen: RegistSuccScreen },
  ErrorTip: { screen: ErrorTipScreen },
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
  NewMail: { screen: NewMailScreen },
  MailDetail: { screen: MailDetailScreen },
  DraftDetail: { screen: DraftDetailScreen },
  // ReserveDetail: { screen: ReserveDetailScreen },
  Share: {
    screen: ShareScreen,
    navigationOptions: {
      title: '分享'
    }
  }
}, {
  initialRouteName: 'Start',
  navigationOptions: {
    // headerBackTitleVisible: false,
    headerBackTitle: null,
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
//
// import Storage from './utils/storage'
//
// const defaultGetStateForAction = FirstApp.router.getStateForAction;
// FirstApp.router.getStateForAction = function(action, state) {
//   console.log(action,state); //
//   if (action.type == 'Navigation/INIT') {
//     // const token = await Storage.getToken()
//     // if (!token) {
//       // this.routes = [
//       //   ...state.routes,
//       //   {key: 'id-'+Date.now(), routeName: 'Login'},
//       // ];
//       // return {
//       //   ...state,
//       //   routes,
//       //   index: this.routes.length - 1,
//       // };
//     // }
//   }
//   // if (action.routeName === 'Home') {
//   //   const token = ''
//   //   // await Storage.getToken()
//
//   // }
//   return defaultGetStateForAction(action, state);
// };
