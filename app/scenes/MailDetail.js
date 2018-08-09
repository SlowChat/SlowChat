import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Easing,
} from 'react-native';

// import Toast from 'react-native-easy-toast'
import TopTab from '../components/TopTab'
import MailContent from '../components/MailContent'
import ReplyItem from '../components/ReplyItem'
import ReplyBox from '../components/ReplyBox'
import AwardTip from '../components/AwardTip'
import ErrorModal from '../components/ErrorModal'

import Global from '../utils/global'
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
  state = {
    activeTab: 0,
    translateValue: new Animated.Value(-44),
    detail: {},
    comments: [],
  }
  componentWillMount() {
    this.getData()
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
  getId() {
    const { id } = this.props.navigation.state.params || {}
    return id
  }
  async getData() {
    if (this.loading) return
    this.loading = true
    try {
      const id = getId()
      const res = await post('api/mail/getInfo.html', { id })
      console.log(res);
      if (res.code == 1) {
        const { comment, ...items } = res.data.items
        const comments = comment ? [comment] : []
        this.setState({
          detail: items,
          comments
        })
      } else {

      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  handleLoadmore = () => {

  }

  handleReply = (content) => {
    this.addComment(this.pid || 0, content)
  }

  handleSubReply = (pid) => {
    this.pid = pid
    this.refs.replyBox.focus()
  }

  async addComment(pid, content) {
    try {
      const id = getId()
      const res = await post('api/mail_comment/add.html', {
        pid, mail_id: id, content
      })
      if (res && res.code == 1) {
        this.refs.awardTipRef.show()
        const { comments } = this.state
        if (pid == 0) {
          comments.unshift()
        } else {
          const index = comments.findIndex(item => item.id == pid)
          if (index > -1) {
            comments[index].reply.push({
              id: new Date().getTime(),
              user: Global.user,
              content,
            })
          }
        }
        this.setState({ comments })
      } else if (res.code == 10001) {
        this.props.navigation.navigate('Login', { back: true })
      } else {
        this.refs.errorModalRef.show({txt: res.msg || '回复失败，稍后尝试'})
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.pid = 0
    }
  }

  render() {
    const { activeTab, fadeInOpacity, detail, comments } = this.state
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
          onEndReachedThreshold={2}
          onEndReached={this.handleLoadmore}
          onScroll={this.handleScroll}
          keyExtractor={(item) => item.id + ''}
          renderItem={(item) => <ReplyItem key={item.id} data={item} onReply={this.handleSubReply} />}
          ListHeaderComponent={() => (<View onLayout={this.flatListHeaderLayout}>
            <MailContent data={detail} />
            {
              detail.comments ? (
                <View style={styles.replyHeader}>
                  <Text style={[styles.replyComment, styles.replyNum]}>评论 {detail.comments}</Text>
                  <Text style={styles.replyNum}>浏览 {detail.looks}</Text>
                </View>
              ) : null
            }
          </View>)}
        />
        <ReplyBox ref="replyBox" onReply={this.handleReply} />
        <AwardTip ref="awardTipRef" num="10" txt="发表评论成功" />
        <ErrorModal ref="errorModalRef" />
      </View>
    )
  }
}

// <Toast ref="toast" position="center" />




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
    borderBottomWidth: 1,
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
