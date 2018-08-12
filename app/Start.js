import React, {PureComponent} from 'react';
import { View, BackHandler, ToastAndroid } from 'react-native'
import Storage from './utils/storage'
import SplashScreen from 'react-native-splash-screen'

import configAppNavigator from './App'

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
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    lastBackPressed = null;
  }

  onBackAndroid() {
    if (routes.length < 1) { // 根界面
      if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
          return false;
      }
      lastBackPressed = Date.now();
      ToastAndroid.show('再点击一次退出应用', ToastAndroid.SHORT);
      return true;
    }
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
