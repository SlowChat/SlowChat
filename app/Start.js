import React, {PureComponent} from 'react';
import Storage from './utils/storage'
import SplashScreen from 'react-native-splash-screen'

export default class Start extends PureComponent {
  async componentWillMount() {
    const token = await Storage.getToken()
    // const routeName = token ? 'BottomTabs' : 'Home'
    const routeName = 'BottomTabs'
    this.props.navigation.replace(routeName)
    SplashScreen.hide()
  }

  render() {
    return null
  }
}
