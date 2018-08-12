import React, { PureComponent } from 'react';
import {
  StyleSheet,
  WebView,
} from 'react-native';

import ErrorTip from '../components/ErrorTip'

type Props = {};
export default class H5Webview extends PureComponent<Props> {
  reload = () => {

  }
  render() {
    const { url } = this.state
    return (
      <WebView style={{width:'100%',height:'100%'}} source={{url}}
        mixedContentMode="compatibility"
        userAgent="com.slowchat"
        scalesPageToFit domStorageEnabled javaScriptEnabled
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
}
