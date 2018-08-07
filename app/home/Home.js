import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  FlatList,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

import Swiper from '../components/Swiper'
import HomeItem from '../components/HomeItem'
import Footer from '../components/Footer'

import { post } from '../utils/request'

const IMGS = [
  'https://img.alicdn.com/bao/uploaded/i1/TB2Xy7fquySBuNjy1zdXXXPxFXa_!!0-paimai.jpg',
  'https://img.alicdn.com/bao/uploaded/i3/TB2Hhn4quSSBuNjy0FlXXbBpVXa_!!0-paimai.jpg'
]

const SIZE = 10

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
    images: IMGS,
    data: [],
    showFoot: 0,
    refreshing: false,
  }
  componentDidMount() {
    this.getData()
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
    this.props.navigation.setParams({
      opacity: this.fadeInOpacity
    })
  }

  handleScroll = (e) => {
    const THRESHOLD = 130
    const offsetY = e.nativeEvent.contentOffset.y
    if (offsetY > THRESHOLD + 10 && !this.hasHeader) {
      this.fadeInOrOut(true)
    } else if (offsetY < THRESHOLD && this.hasHeader) {
      this.fadeInOrOut(false)
    }
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
        hot: this.state.activeTab,
        keyword
      })
      if (res.code == 1) {
        const { total, items } = res.data
        const newData = page == 0 ? items : this.state.data.concat(items)
        let showFoot = newData.length >= total ? 1 : 0
        this.setState({
          data: newData,
          showFoot
        })
        this.page++
      } else {
        this.refs.toast.show(res.msg || '慢聊飘走了')
        this.setState({ showFoot: 0 })
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  handleLoadmore = () => {
    this.setState({ showFoot: 2 })

  }
  handleRefresh = () => {
    console.log("=Refresh=");
  }
  handlePress = (id) => {
    this.props.navigation.push('MailDetail', {id})
  }
  renderItem = (item) => {
    return <HomeItem data={item} onPress={this.handlePress} />
  }
  renderHeader = () => {
    const { images } = this.state
    return (<Swiper items={images} />)
  }
  renderFooter = () => {
    return <Footer showFoot={this.state.showFoot} />
  }
  render() {
    const { images, data } = this.state
    return (
      <FlatList
        style={styles.flatlist}
        ref={(flatList)=>this._flatList = flatList}
        data={data}
        renderItem={this.renderItem}
        initialNumToRender={5}
        keyExtractor={(item, index) => item.key + ''}
        onScroll={this.handleScroll}
        onEndReachedThreshold={3}
        onEndReached={this.handleLoadmore}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  itemWrap: {
    backgroundColor: '#F6F6F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
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

// <Button title="测试" onPress={() => {
//     this.props.navigation.navigate('SendMail')
//   }}></Button>
