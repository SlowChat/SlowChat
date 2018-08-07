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

import { post } from '../utils/request'

const IMGS = [
  'https://img.alicdn.com/bao/uploaded/i1/TB2Xy7fquySBuNjy1zdXXXPxFXa_!!0-paimai.jpg',
  'https://img.alicdn.com/bao/uploaded/i3/TB2Hhn4quSSBuNjy0FlXXbBpVXa_!!0-paimai.jpg'
]

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
    showFoot: 1,
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


  getData() {
    // if (this.loading) return
    // const { page, size } = this.state
    post('api/mail/getMyList.html', {
      p: 0,
      s: 10,
    }).then(res => {
      console.log("res===", res);
    }).catch(err => {
      console.log("err======", err);
    })


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
    if (this.state.showFoot === 1) {
      return (
        <View style={styles.nomore}>
          <Text style={styles.nomoreTxt}>
              没有更多数据了
          </Text>
        </View>
      )
    } else if(this.state.showFoot === 2) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text style={styles.footerTxt}>正在加载更多数据...</Text>
        </View>
      )
    } else if(this.state.showFoot === 0){
      return null
    }
  }
  render() {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push({key: i, title: i + ''});
    }
    const { images } = this.state
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
  footer:{
    flexDirection:'row',
    height:24,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
  },
  footerTxt: {
    color: '#999999',
    fontSize: 14,
    marginLeft: 5,
  },
  nomore: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nomoreTxt: {
    color: '#999999',
    fontSize: 14,
    marginLeft: 5,
    marginTop:5,
    marginBottom:5,
  }
});

// <Button title="测试" onPress={() => {
//     this.props.navigation.navigate('SendMail')
//   }}></Button>
