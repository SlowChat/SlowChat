import React, {PureComponent} from 'react';
import { View, BackHandler, ToastAndroid, AppState } from 'react-native'
import Storage from './utils/storage'
import SplashScreen from 'react-native-splash-screen'

import configAppNavigator from './App'
import { CODE_PUSH_KEY } from './constants'
// import codePush from 'react-native-code-push'
// import JPushModule from 'jpush-react-native';

let codePush = null
let JPushModule = null

let routes = [];
let lastBackPressed = null;

export default class Start extends PureComponent {
    state = {
    checkLogin: false,
    isLogin: false
  }
  async componentWillMount() {
    const token = await Storage.getToken()
    this.setState({
      checkLogin: true,
      isLogin: Boolean(token)
    }, () => {
      SplashScreen.hide()
    })
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    AppState.addEventListener('change', this.handleChange)
    this.addPushListener()
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    AppState.removeEventListener('change', this.handleChange)
    lastBackPressed = null;
    this.removePushListener()
  }

  addPushListener() {
    if (!JPushModule) {
      JPushModule = require('jpush-react-native').default
    }
    JPushModule.notifyJSDidLoad((resultCode) => {
        if (resultCode === 0) {}
    });
    // 接收自定义消息
    JPushModule.addReceiveCustomMsgListener((message) => {
      console.log("addReceiveCustomMsgListener===", message);
    })
    // 接收推送通知
    JPushModule.addReceiveNotificationListener((message) => {
      console.log("receive notification: ", JSON.stringify(message));
    });
    // 打开通知
    JPushModule.addReceiveOpenNotificationListener((map) => {
      // this.props.navigation.navigate("NewMail");
    });
  }

  removePushListener() {
    if (JPushModule) {
      JPushModule.removeReceiveCustomMsgListener();
      JPushModule.removeReceiveNotificationListener();
    }
  }

  handleChange = (newState) => {
    if (!codePush) {
      codePush = require('react-native-code-push')
    }
    newState === 'active' && codePush.sync({
      deploymentKey: CODE_PUSH_KEY
    });
  }

  onBackAndroid() {
    if (routes.length < 2) { // 根界面
      if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
          return false;
      }
      lastBackPressed = Date.now();
      ToastAndroid.show('再点击一次退出应用', ToastAndroid.SHORT);
      return true;
    }
    return true
  }

  navigationStateChange = (prevNav, nav, action) => {
    routes = nav.routes
  }

  render() {
    const { checkLogin, isLogin } = this.state
    if (!checkLogin) return null
    const AppNavigator = configAppNavigator(isLogin);
    return <AppNavigator onNavigationStateChange={this.navigationStateChange} />
  }
}
