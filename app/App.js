import React, {Component, PureComponent} from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator, StackViewTransitionConfigs } from 'react-navigation';
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator';

import BottomTabs from './BottomTabs'
// import LoginScreen from './login/Login'

const StackApp = (isLogin) => createStackNavigator({
  BottomTabs: {
    screen: BottomTabs,
    // screen: require('./BottomTabs').default,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    // screen: LoginScreen,
    screen: require('./login/Login').default,
    // mode: 'modal',
    // transitionConfig: () => {
    //   return {
    //     screenInterpolator: StackViewTransitionConfigs.ModalSlideFromBottomIOS.screenInterpolator,
    //   }
    // }
  },
  Regist: { screen: require('./login/Regist').default },
  RegistSucc: { screen: require('./login/RegistSucc').default },
  // ErrorTip: { screen: ErrorTipScreen },
  User: { screen: require('./user/User').default },
  Setting: { screen: require('./user/Setting').default },
  Email: { screen: require('./user/Email').default },
  Information: { screen: require('./user/Information').default },
  EditMobile: { screen: require('./user/EditMobile').default },
  EditEmail: { screen: require('./user/EditEmail').default },
  EditPassword: { screen: require('./user/EditPassword').default },
  EditEmailPassword: { screen: require('./user/EditEmailPassword').default },
  About: { screen: require('./user/About').default },
  Rule: { screen: require('./user/Rule').default },
  // Protocol: { screen: require('./user/Protocol').default },
  Push: { screen: require('./user/Push').default },
  Notice: { screen: require('./user/Notice').default },
  Message: { screen: require('./user/Message').default },
  Integral: { screen: require('./user/Integral').default },
  FeedBack: { screen: require('./user/FeedBack').default },
  NewMail: { screen: require('./scenes/NewMail').default },
  MailDetail: { screen: require('./scenes/MailDetail').default },
  DraftDetail: { screen: require('./scenes/DraftDetail').default },
  Webview: { screen: require('./h5/Webview').default },
  LocalWebview: { screen: require('./h5/LocalWebview').default },
  TestWebView: { screen: require('./test/webview').default },
  // ReserveDetail: { screen: ReserveDetailScreen },
  Share: {
    screen: require('./scenes/Share').default,
    navigationOptions: {
      title: '分享'
    }
  }
}, {
  initialRouteName: 'BottomTabs',
  // isLogin ? 'BottomTabs' : 'Login',
  navigationOptions: {
    // headerBackTitleVisible: false,
    headerBackTitle: null,
    headerTintColor: '#E24B92',
    // headerBackImage: './images/icon_back.png',
    headerRight: <View />,
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitleContainerStyle: {
      justifyContent: 'center',
    },
    // headerLayoutPreset: 'center',
    headerTitleStyle: {
      fontSize: 18,
      fontFamily: 'PingFangSC-Regular',
      color: '#333',
    },
    // headerStyle: {
    //   paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    // }
  },
  transitionConfig: () => {
    // if (isModal) {
    //   return {
    //     screenInterpolator: StackViewTransitionConfigs.ModalSlideFromBottomIOS.screenInterpolator,
    //   }
    // }
    return {
      screenInterpolator: StackViewTransitionConfigs.SlideFromRightIOS.screenInterpolator
    }
  }
});

export default StackApp
// class App extends PureComponent {
//   // StackApp
//   render() {
//     return
//   }
// }
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
