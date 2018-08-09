import React, {PureComponent} from 'react';
import Storage from './utils/storage'

export default class Start extends PureComponent {
  async componentWillMount() {
    const token = await Storage.getToken()
    // const routeName = token ? 'BottomTabs' : 'Home'
    const routeName = 'BottomTabs'
    this.props.navigation.replace(routeName)
  }
  render() {
    return null
  }
}
