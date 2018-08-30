import React, { PureComponent } from 'react';
import {
  StyleSheet,
  WebView,
} from 'react-native';

import ErrorTip from '../components/ErrorTip'

type Props = {};
export default class H5Webview extends PureComponent<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: params.title,
    }
  }
  componentWillMount() {

  }
  reload = () => {

  }
  handleNavChange = (e) => {
    this.props.navigation.setParams({
      title: e.title,
    })
  }
  render() {
    return (
      <WebView style={{width:'100%',height:'100%'}}
        source={require('./h5.html')}
        mixedContentMode="compatibility"
        userAgent="com.slowchat"
        scalesPageToFit
        domStorageEnabled
        javaScriptEnabled
        onNavigationStateChange={this.handleNavChange}
        renderError={() => <ErrorTip txt="重新加载页面" onPress={this.reload} />}
      />
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily: 'PingFangSC-Regular',
  },
})
