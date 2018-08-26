import React, {PureComponent} from 'react';
import { View, BackHandler, ToastAndroid, AppState, Platform, TouchableOpacity } from 'react-native'
import { StackActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'
import Storage from './utils/storage'
import configAppNavigator from './App'
import URL from './utils/url'
import { CODE_PUSH_KEY } from './constants'
import Global from './utils/global'
import { post } from './utils/request'
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
    // const token = await Storage.getToken()
    // this.setState({
    //   checkLogin: true,
    //   isLogin: Boolean(token)
    // }, () => {
    //   SplashScreen.hide()
    // })
  }

  componentDidMount() {
    SplashScreen.hide()
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
    JPushModule.getRegistrationID(registrationId => {
      console.log(registrationId, "==getRegistrationID====");
      if (Global.token && Global.user && !Global.user.registrationId) {
        Global.pushId = registrationId
        post('api/mail/setPushCode.html', {
          code: registrationId
        })
      }
    })
    if (Platform.OS == 'android') {
      JPushModule.notifyJSDidLoad((resultCode) => {
          if (resultCode === 0) {}
      });
    }
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
      console.log(map)
      const { url } = map.extras || {}
      if (!url) return
      let routeName = ''
      let params = {}
      if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
        routeName = 'Webview'
        params.url = url
      } else if (url.indexOf('/') == 0) {
        const { uri, query } = URL.parse(url)
        routeName = uri
        params = query
      }
      const pushAction = StackActions.push({ routeName, params })
      this.navRef.dispatch(pushAction)
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
      if (routes.length == 1 && routes[0].index != 0) {
        return false
      }
      if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
          return false;
      }
      lastBackPressed = Date.now();
      ToastAndroid.show('再点击一次退出应用', ToastAndroid.SHORT);
      return true;
    }
    return false
  }

  getNavRef = (ref) => {
    this.navRef = ref
  }

  navigationStateChange = (prevNav, nav, action) => {
    routes = nav.routes || []
  }

  render() {
    const AppNavigator = configAppNavigator();
    return <AppNavigator ref={this.getNavRef} onNavigationStateChange={this.navigationStateChange} />
    // const { checkLogin, isLogin } = this.state
    // if (!checkLogin) return null
    // const AppNavigator = configAppNavigator(isLogin);
    // return <AppNavigator ref={this.getNavRef} onNavigationStateChange={this.navigationStateChange} />
  }
}
