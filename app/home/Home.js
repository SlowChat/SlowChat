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
import Loading from '../components/Loading'


import { post } from '../utils/request'
import dateFormat from '../utils/date'

const SIZE = 10

type Props = {};
export default class Home extends Component<Props> {
  state = {
    images: [],
    items: [],
    showFoot: 0,
    showLoading: false,
    showError: false,
    refreshing: false,
    fadeInOpacity: new Animated.Value(0),
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
      }, 200)
    })
  }
  fadeInOrOut(fadeIn) {
    const fromValue = fadeIn ? 0 : 1
    const toValue = fadeIn ? 1 : 0
    this.state.fadeInOpacity = this.state.fadeInOpacity || new Animated.Value(fromValue)
    if (!this.hasHeader) {
      this.hasHeader = true
    } else {
      this.hasHeader = false
    }
    Animated.timing(this.state.fadeInOpacity, {
      toValue: toValue, // 目标值
      duration: 250, // 动画时间
      easing: fadeIn ? Easing.easeIn : Easing.easeOut // 缓动函数
    }).start();
    this.timer = setTimeout(() => {
      if (!fadeIn) {
        this.hasHeader = false
      }
    }, 250)
    // this.noupdate = true
    // this.props.navigation.setParams({
    //   opacity: this.fadeInOpacity
    // })
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
        const curr_item = dateFormat(new Date(), 'yyyy-MM-dd')
        items.forEach(item => {
          item.send_time = (item.send_time || '').split(' ')[0]
          const [ add_date, add_time ] = item.add_time.split(' ')
          // add_date.replace(/\-/g, '/')
          item.add_time = curr_item == add_date ? add_time : add_date
        })
        const newData = page == 0 ? items : this.state.items.concat(items)
        let showFoot = page > 0 && newData.length >= total ? 1 : 0
        this.setState({
          items: newData,
          showFoot,
        })
        this.page++
      } else {
        this.refs.toast.show(res.msg || '慢聊信息飘走了')
        this.setState({ showFoot: 0 })
        if (this.page == 0) {
          this.setState({showError: true })
        }
      }
    } catch (e) {
      console.log(e)
      if (this.page == 0) {
        this.setState({showError: true })
      }
    } finally {
      this.loading = false
      if (this.state.showLoading) {
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
      if (this.page > 0) {
        this.getData(this.page)
      }
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
  handleNav = (routeName, params = {}) => {
    this.props.navigation.push(routeName, params)
  }
  renderHeader = () => {
    const { images, showError } = this.state
    return (<Swiper items={images} onNav={this.handleNav} showError={showError} onError={this.handleRefresh} />)
  }
  renderFooter = () => {
    return <Footer safe={false} showFoot={this.state.showFoot} />
  }
  render() {
    const { fadeInOpacity, showLoading, images, items } = this.state
    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
          style={[styles.header, {opacity: fadeInOpacity}]}>
          <Text style={styles.headerTxt}>首页</Text>
        </SafeAreaView>
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={items}
          extraData={this.state.showError}
          renderItem={this.renderItem}
          initialNumToRender={5}
          keyExtractor={(item, index) => String(item.id)}
          onScroll={this.handleScroll}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleLoadmore}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
        />
        { showLoading && <Loading /> }
        <Toast ref="toast" position="center" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
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
    zIndex: 100,
  },
  headerTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#333',
    fontWeight: 'bold',
  },
});
