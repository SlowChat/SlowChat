import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Animated,
  Easing,
  DeviceEventEmitter,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import Swiper from '../components/Swiper'
import HomeItem from '../components/HomeItem'
import Footer from '../components/Footer'
import ErrorTip from '../components/ErrorTip'

import { post } from '../utils/request'

const IMGS = [
  'https://img.alicdn.com/bao/uploaded/i1/TB2Xy7fquySBuNjy1zdXXXPxFXa_!!0-paimai.jpg',
  'https://img.alicdn.com/bao/uploaded/i3/TB2Hhn4quSSBuNjy0FlXXbBpVXa_!!0-paimai.jpg'
]

const SIZE = 10
let firstClick = 0

type Props = {};
export default class App extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    const opacity = params.opacity || new Animated.Value(0)
    return {
      header: () => (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
        style={[styles.header, {opacity}]}>
        <Text style={styles.headerTxt}>首页</Text>
      </SafeAreaView>),
    }
  }
  state = {
    images: [],
    items: [],
    showFoot: 0,
    showLoading: false,
    showError: false,
    refreshing: false,
  }
  componentWillMount() {
    this.initData()
    this.getSlides()
    // this.props.navigation.reset('Login')
  }
  componentDidMount() {
    DeviceEventEmitter.addListener('refresh-home', (params) => {
      this.initData()
   });
  }
  shouldComponentUpdate() {
    if (this.noupdate) {
      this.noupdate = false
      return false
    }
    return true
  }

  initData(state = {}) {
    this.setState({ showFoot: 0, items: [], ...state }, () => {
      this.page = 0
      this.getData(0)
      setTimeout(() => {
        if (this.loading) {
          this.setState({ showLoading: true })
        }
      }, 300)
    })
  }
  fadeInOrOut(fadeIn) {
    const fromValue = fadeIn ? 0 : 1
    const toValue = fadeIn ? 1 : 0
    this.fadeInOpacity = this.fadeInOpacity || new Animated.Value(fromValue)
    if (!this.hasHeader) {
      this.hasHeader = true
    } else {
      this.hasHeader = false
    }
    Animated.timing(this.fadeInOpacity, {
      toValue: toValue, // 目标值
      duration: 300, // 动画时间
      easing: fadeIn ? Easing.easeIn : Easing.easeOut // 缓动函数
    }).start();
    this.timer = setTimeout(() => {
      if (!fadeIn) {
        this.hasHeader = false
      }
    }, 300)
    this.noupdate = true
    this.props.navigation.setParams({
      opacity: this.fadeInOpacity
    })
  }

  handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y
    requestAnimationFrame(() => {
      const THRESHOLD = 100
      if (offsetY > THRESHOLD + 10 && !this.hasHeader) {
        this.fadeInOrOut(true)
      } else if (offsetY < THRESHOLD && this.hasHeader) {
        this.fadeInOrOut(false)
      }
    })
  }

  async getData(page = 0) {
    if (this.loading || this.state.showFoot == 1) return
    this.loading = true
    if (page > 0) {
      this.setState({ showFoot: 2 })
    }
    const { keyword = '' } = this
    try {
      this.loading = true
      const res = await post('api/mail/getList.html', {
        p: page,
        s: SIZE,
      })
      if (res.code == 1) {
        const { total, items } = res.data
        const newData = page == 0 ? items : this.state.data.concat(items)
        let showFoot = newData.length >= total ? 1 : 0
        this.setState({
          items: newData,
          showFoot,
        })
        this.page++
      } else if (res.code == 10001) {
        this.props.navigation.replace('Login')
      } else {
        this.refs.toast.show(res.msg || '慢聊飘走了')
        this.setState({ showFoot: 0 })
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
      if (!this.goLogin && this.state.showLoading) {
        this.setState({ showLoading: false })
      }
    }
  }

  async getSlides() {
    try {
      const res = await post('api/common/getSlideList.html')
      if (res.code == 1 && !this.goLogin) {
        this.setState({ images: res.data })
      }
    } catch (e) {

    }
  }
  // reset(navigation, routeName)  {
  //   const resetAction = NavigationActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({ routeName })]
  //   });
  //   navigation.dispatch(resetAction);
  // }

  handleLoadmore = () => {
    requestAnimationFrame(() => {
      this.getData(this.page + 1)
    })
  }
  handleRefresh = () => {
    this.initData()
  }
  handleGoDetail = (id) => {
    this.props.navigation.push('MailDetail', {id})
  }
  renderItem = (item) => {
    return <HomeItem data={item} onPress={this.handleGoDetail} />
  }
  handleGoNew = () => {
    this.props.navigation.push('NewMail')
  }
  renderHeader = () => {
    const { images, showLoading, showError } = this.state
    return (<Swiper items={images} onNew={this.handleGoNew} showLoading={showLoading} showError={showError} onError={this.handleRefresh} />)
  }
  renderFooter = () => {
    return <Footer showFoot={this.state.showFoot} />
  }
  render() {
    const { showLoading, showError, images, items } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={items}
          renderItem={this.renderItem}
          initialNumToRender={5}
          keyExtractor={(item, index) => String(item.id)}
          onScroll={this.handleScroll}
          onEndReachedThreshold={3}
          onEndReached={this.handleLoadmore}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
        />
        <Toast ref="toast" position="center" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  itemWrap: {
    backgroundColor: '#F6F6F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#333',
    fontWeight: 'bold',
  },
});
