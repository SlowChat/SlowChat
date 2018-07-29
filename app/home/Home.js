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
  PixelRatio
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

import Swiper from '../components/Swiper'
import HomeItem from '../components/HomeItem'

import HomeList from '../components/HomeList'

const onePx = 1 / PixelRatio.get()

type Props = {};
export default class App extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: params.header || null,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.transfromY()
    }, 1000)
  }
  transfromY() {
    this.springValue = new Animated.Value(-44)
    this.props.navigation.setParams({
      header: () => (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
        style={[styles.header, {transform: [{translateY: this.springValue}]}]}>
        <Text style={styles.headerTxt}>首页</Text>
      </SafeAreaView>),
    })
    setTimeout(() => {
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

    }, 30)
  }
  fadeIn() {
    this.fadeInOpacity = new Animated.Value(0)
    this.props.navigation.setParams({
      header: () => (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
        style={[styles.header, {opacity: this.fadeInOpacity}]}>
        <Text style={styles.headerTxt}>首页</Text>
      </SafeAreaView>),
    })
    setTimeout(() => {
      Animated.timing(this.fadeInOpacity, {
        toValue: 1, // 目标值
        duration: 1000, // 动画时间
        easing: Easing.linear // 缓动函数
      }).start();
    }, 30)
  }

  handleScroll = (e) => {
    return
    if (this.hasHeader) {
      this.hasHeader = false
      this.props.navigation.setParams({
        header: null
      })
    } else if (!this.hasHeader) {
      this.hasHeader = true
      this.props.navigation.setParams({
        header: <Text>首页</Text>
      })
    }
  }
  renderTip() {
    return (
      <View style={styles.tipWraper}>
        <View style={styles.tipHeader}><Text style={styles.tipHeaderTxt}>回到未来</Text></View>
        <View>
          <Text style={styles.tip}>给未来的自己写封信吧，给自己炖一碗鸡汤</Text>
          <Text style={styles.tip}>让若干年后的自己回味一下</Text>
        </View>
      </View>
    )
  }
  handleLoadmore = () => {

  }
  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    return (
      <FlatList
        style={styles.flatlist}
        ref={(flatList)=>this._flatList = flatList}
        data={data}
        renderItem={(item) => <HomeItem item={item} />}
        initialNumToRender={10}
        keyExtractor={(item, index) => item.key + ''}
        onScroll={this.handleScroll}
        onEndReachedThreshold={3}
        onEndReached={this.handleLoadmore}
        ListHeaderComponent={() => (<View>
          <Swiper />
          {this.renderTip()}
        </View>)}
      />
    )
    return (
      <ScrollView style={styles.container} onScroll={this.handleScroll}>
        <Swiper />
        {this.renderTip()}
        <View style={styles.itemWrap}>
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
        </View>
      </ScrollView>
    );
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
  tipWraper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: 29,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 7,
    borderBottomWidth: onePx,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid',
  },

  tipHeader: {
    paddingRight: 15,
  },
  tipHeaderTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Medium',
    color: '#B4B4B4',
  },
  tip: {
    height: 17,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
    lineHeight: 17
  },
});

// <Button title="测试" onPress={() => {
//     this.props.navigation.navigate('SendMail')
//   }}></Button>
