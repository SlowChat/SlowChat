import React, {PureComponent} from 'react';
import { View } from 'react-native'
import Storage from './utils/storage'
import SplashScreen from 'react-native-splash-screen'

import configAppNavigator from './App'

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

  render() {
    const { checkLogin, isLogin } = this.state
    if (!checkLogin) return null
    const AppNavigator = configAppNavigator(isLogin);
    return <AppNavigator />
  }
}
