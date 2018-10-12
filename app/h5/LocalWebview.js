import React, {Component} from 'react';
import {
  View,
  WebView,
  Platform,
  StyleSheet
} from 'react-native';
import { post } from '../utils/request'
import Loading from '../components/Loading'
import ErrorTip from '../components/ErrorTip'

const DATA = {
  faq: {
    url: 'api/common/faq.html',
    title: '常见问题'
  },
  protocal: {
    url: 'api/common/agreement.html',
    title: '网站软件许可使用协议'
  },
  article: {
    url: 'api/common/articleInfo.html'
  }
}

type Props = {};
export default class LocalWebview extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    const source = params.source
    return {
      title: DATA[source].title || params.title || '',
    }
  }
  state = {
    showError: false,
    showLoading: false
  }

  componentWillMount() {
    let { source } = this.props.navigation.state.params || {}
    // const keys = Object.keys(DATA)
    // if (keys.indexOf(source) == -1) {
    //   source = 'faq'
    // }
    if (!source) {
      this.props.navigation.goBack()
      return
    }
    this.source = source
    this.getData()
  }

  // componentDidMount() {
  //   const { title } = DATA[this.source]
  //   this.props.navigation.setParams({ title })
  // }

  reload = () => {
    this.getData()
  }

  async getData() {
    if (this.post_content) return this.post_content
    try {
      this.loading = true
      const { url, title } = DATA[this.source]
      const params = {}
      if (this.source == 'article') {
        params.id = this.props.navigation.state.params.id
      }
      const res = await post(url, params)
      if (res.code == 1) {
        this.post_content = this.htmlDecodeByRegExp(res.data.post_content)
        if (this.loaded) {
          this.postMessage()
        }
        this.setState({
          showLoading: false,
          showError: false
        })
        if (!title) {
          this.props.navigation.setParams({
            title: res.data.post_title,
          })
        }
      } else {
        this.setState({
          showLoading: false,
          showError: true
        })
      }
      this.loading = false
    } catch (e) {
      this.loading = false
      this.setState({
        showLoading: false,
        showError: true
      })
    }
    setTimeout(() => {
      if (this.loading) {
        this.setState({ showLoading: true })
      }
    }, 200)
  }
  handleLoad = () => {
    this.loaded = true
    this.postMessage()
  }
  postMessage() {
    this.webview.postMessage(this.post_content || '');
  }

  htmlDecodeByRegExp(str){
    if(!str || str.length == 0) return '';
    let s = "";
    s = str.replace(/&amp;/g,"&");
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    s = s.replace(/&nbsp;/g," ");
    s = s.replace(/&#39;/g,"\'");
    s = s.replace(/&quot;/g,"\"");
    s = s.replace(/\r?\n/g,"");
    // s = s.replace(/\r?\n/g,"<br />");
    return s;
  }

  render() {
    const { showLoading, showError } = this.state
    // android/app/src/main/assets
    return (
      <View style={styles.container}>
        {showLoading && <Loading />}
        {showError && <ErrorTip onPress={this.reload} />}
        <WebView ref={ref => this.webview = ref}
          // source={require('./h5.html')}
          style={styles.webview}
          // source={{html: Content}}
          source={Platform.OS == 'ios' ? require('./h5.html') : {uri: 'file:///android_asset/h5.html'}}
          mixedContentMode="compatibility"
          userAgent="com.slowchat"
          originWhitelist={["*"]}
          domStorageEnabled
          javaScriptEnabled
          onLoadEnd={this.handleLoad} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
    // backgroundColor:'clearColor',
    // opaque:'no'
  }
});
