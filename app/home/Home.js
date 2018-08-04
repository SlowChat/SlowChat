import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  Button,
  Animated,
  Easing,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

import Swiper from '../components/Swiper'
import HomeItem from '../components/HomeItem'


const IMGS = [
  'https://img.alicdn.com/bao/uploaded/i1/TB2Xy7fquySBuNjy1zdXXXPxFXa_!!0-paimai.jpg',
  'https://img.alicdn.com/bao/uploaded/i3/TB2Hhn4quSSBuNjy0FlXXbBpVXa_!!0-paimai.jpg'
]

type Props = {};
export default class App extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: params.header || null,
    }
  }
  state = {
    images: []
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ images: IMGS })
    }, 500)
  }
  transfromY() {
    this.springValue = new Animated.Value(-44)
    this.props.navigation.setParams({
      header: () => (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
        style={[styles.header, {transform: [{translateY: this.springValue}]}]}>
        <Text style={styles.headerTxt}>首页</Text>
      </SafeAreaView>),
    })
    Animated.spring(
      this.springValue,
      {
        toValue: 0,
        friction: 100
      }
    ).start()

      // Animated.timing(this.springValue, {
      //   toValue: 0, // 目标值
      //   duration: 300, // 动画时间
      //   easing: Easing.linear // 缓动函数
      // }).start();

  }
  fadeInOrOut(fadeIn) {
    const fromValue = fadeIn ? 0 : 1
    const toValue = fadeIn ? 1 : 0
    this.fadeInOpacity = this.fadeInOpacity || new Animated.Value(fromValue)
    if (!this.hasHeader) {
      this.hasHeader = true
      this.props.navigation.setParams({
        header: () => (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
          style={[styles.header, {opacity: this.fadeInOpacity}]}>
          <Text style={styles.headerTxt}>首页</Text>
        </SafeAreaView>),
      })
    } else {
      this.hasHeader = false
    }
    Animated.timing(this.fadeInOpacity, {
      toValue: toValue, // 目标值
      duration: 500, // 动画时间
      easing: fadeIn ? Easing.easeIn : Easing.easeOut // 缓动函数
    }).start();
    this.timer = setTimeout(() => {
      if (!fadeIn) {
        this.hasHeader = false
        this.props.navigation.setParams({
          header: null
        })
      }
    }, 500)
  }

  handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y
    if (offsetY > 80 && !this.hasHeader) {
      this.fadeInOrOut(true)
    } else if (offsetY < 80 && this.hasHeader) {
      this.fadeInOrOut(false)
    }
  }
  handleLoadmore = () => {

  }
  handlePress = (id) => {
    this.props.navigation.push('MailDetail', {id})
  }
  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    const { images } = this.state
    return (
      <FlatList
        style={styles.flatlist}
        ref={(flatList)=>this._flatList = flatList}
        data={data}
        renderItem={(item) => <HomeItem data={item} onPress={this.handlePress} />}
        initialNumToRender={5}
        keyExtractor={(item, index) => item.key + ''}
        onScroll={this.handleScroll}
        onEndReachedThreshold={3}
        onEndReached={this.handleLoadmore}
        ListHeaderComponent={() => (<Swiper items={images} />)}
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

  },
});

// <Button title="测试" onPress={() => {
//     this.props.navigation.navigate('SendMail')
//   }}></Button>
