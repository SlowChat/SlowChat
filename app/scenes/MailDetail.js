import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Easing,
} from 'react-native';

import Toast from 'react-native-easy-toast'
import TopTab from '../components/TopTab'
import MailContent from '../components/MailContent'
import ReplyItem from '../components/ReplyItem'
import ReplyBox from '../components/ReplyBox'

import { post } from '../utils/request'

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
    detail: {},
    comments: [],
  }
  shouldComponentUpdate() {
    if (this.noupdate) {
      this.noupdate = false
      return false
    }
    return true
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
      this.noupdate = true
      this.props.navigation.setParams({
        title: this.title
      })
    }
    if (offsetY > this.listHeaderHeight && this.state.activeTab !== 1) {
      this.setState({ activeTab: 1 })
    } else if (offsetY < this.listHeaderHeight && this.state.activeTab !== 0) {
      this.setState({ activeTab: 0 })
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

  async getData() {
    if (this.loading) return
    this.loading = true
    try {
      const { id } = this.props.navigation.state.params
      const res = await post('api/mail/getInfo.html', { id })
      if (res.code == 1) {
        const { items } = res.data
        this.setState({
          detail: items,
          coments: []
        })
      } else {

      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }


  handleReply = (content) => {
    this.addComment(0, content)
  }

  async addComment(pid, content) {
    try {
      const { id } = this.props.navigation.state.params
      const res = await post('api/mail_comment/add.html', {
        pid, mail_id: id,content
      })
      if (res && res.code == 1) {

      } else {
        this.refs.toast.show(res.msg || '慢聊飘走了')
      }
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const { activeTab, fadeInOpacity } = this.state
    const { detail, comments } = this.state
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.topbar, {transform: [{translateY: this.state.translateValue}]}]}>
          <TopTab index={activeTab} items={ITEMS} onPress={this.switchTab} />
        </Animated.View>
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={comments}
          initialNumToRender={5}
          onScroll={this.handleScroll}
          keyExtractor={(item) => item.id + ''}
          renderItem={(item) => <ReplyItem item={item} />}
          ListHeaderComponent={() => (<View onLayout={this.flatListHeaderLayout}>
            <MailContent data={detail} />
            {
              detail.comments && detail.looks && (
                <View style={styles.replyHeader}>
                  <Text style={[styles.replyComment, styles.replyNum]}>评论 {detail.comments}</Text>
                  <Text style={styles.replyNum}>浏览 {detail.looks}</Text>
                </View>
              )
            }
          </View>)}
        />
        <ReplyBox onPress={this.handleReply} />
        <Toast ref="toast" position="center" />
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
