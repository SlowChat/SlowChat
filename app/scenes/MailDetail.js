import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Easing,
} from 'react-native';

import TopTab from '../components/TopTab'
import MailContent from '../components/MailContent'
import ReplyItem from '../components/ReplyItem'
import ReplyBox from '../components/ReplyBox'

const ITEMS = [{id: 0, name: '信件内容'}, {id: 1, name: '慢友圈'}]
const ANIMAT_TIME = 500

export default class MailDetail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: params.title || '邮件详情',
    }
  }
  static defaultProps = {
    title: '20岁，来自父亲的祝福！'
  }
  state = {
    activeTab: 0,
    translateValue: new Animated.Value(-44),
  }
  componentWillMount() {

  }

  shouldComponentUpdate(nextProps) {
    console.log(nextProps);
  }

  handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y
    const { title } = this.props
    let change = false
    if (offsetY > 130 && this.title != title) {
      change = true
      this.title = title
      this.translate(true)
    } else if (offsetY < 120 && this.title != '邮件详情') {
      change = true
      this.title = '邮件详情'
      this.translate(false)
    }
    if (change) {
      this.props.navigation.setParams({
        title: this.title
      })
    }
  }

  switchTab = (index) => {
    if (index == 0) {
      this._flatList.scrollToOffset({animated: true, offset: 0})
    } else {
      if (this.listHeaderHeight) {
        this._flatList.scrollToOffset({animated: true, offset: this.listHeaderHeight })
      }
    }
    if (this.state.activeTab == index) return
    this.setState({ activeTab: index })
  }

  flatListHeaderLayout = ({nativeEvent: e}) => {
    this.listHeaderHeight = e.layout.height - 44 - 38
  }

  translate(fadeIn) {
    const fromValue = fadeIn ? -44 : 0
    const toValue = fadeIn ? 0 : -44
    this.state.translateValue = this.state.translateValue || new Animated.Value(fromValue)
    Animated.timing(this.state.translateValue, {
      toValue: toValue, // 目标值
      duration: ANIMAT_TIME, // 动画时间
      easing: fadeIn ? Easing.easeIn : Easing.easeOut // 缓动函数
    }).start();
  }

  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    const { activeTab, fadeInOpacity } = this.state
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.topbar, {transform: [{translateY: this.state.translateValue}]}]}>
          <TopTab index={activeTab} items={ITEMS} onPress={this.switchTab} />
        </Animated.View>
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={data}
          initialNumToRender={5}
          onScroll={this.handleScroll}
          keyExtractor={(item, index) => item.key + ''}
          renderItem={(item) => <ReplyItem item={item} />}
          ListHeaderComponent={() => (<View onLayout={this.flatListHeaderLayout}>
            <MailContent />
            <View style={styles.replyHeader}>
              <Text style={[styles.replyComment, styles.replyNum]}>评论 3</Text>
              <Text style={styles.replyNum}>浏览 22</Text>
            </View>
          </View>)}
        />
        <ReplyBox />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    backgroundColor: '#F6F6F6',
  },
  flatlist: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    marginBottom: 10,
  },

  topbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 46,
    backgroundColor: 'transparent',
    zIndex: 10,
  },

  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 37,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF'
  },

  replyNum: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#999999',
  },
  replyComment: {
    flex: 1,
  },
})
