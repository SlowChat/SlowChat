import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from 'react-native';

import Toast from 'react-native-easy-toast'
import SendTip from '../components/SendTip'
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
      headerRight: params.rightBtnOnPress ? (
        <TouchableOpacity activeOpacity={0.6} style={styles.rightBtnWrap} onPress={params.rightBtnOnPress}>
          <Image style={styles.rightBtn} source={params.ispub ? require('../images/icon_overt.png') : require('../images/icon_hide.png')} />
        </TouchableOpacity>
      ) : <View />,

    }
  }
  state = {
    top: -44,
    status: 0, // 0 待发送  10 已发送 20 取消
    activeTab: 0,
    translateValue: new Animated.Value(-44),
    detail: {},
    comments: [],
  }
  componentWillMount() {
    this.getData()
    const { params = {} } = this.props.navigation.state
    let status = params.status
    let top = -44
    if (typeof status == 'undefined') {
      status = null
      top = 0
    }
    this.status = status
    this.setState({ status, top })
  }
  componentDidMount() {
    if (this.status != null) {
      this.props.navigation.setParams({
        rightBtnOnPress: this.rightBtnOnPress
      })
    }
  }
  shouldComponentUpdate() {
    if (this.noupdate) {
      this.noupdate = false
      return false
    }
    return true
  }

  handleScroll = (e) => {
    if (this.forbidscroll) return
    const offsetY = parseInt(e.nativeEvent.contentOffset.y)
    requestAnimationFrame(() => {
      let change = false
      const { title } = this.state.detail
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
      if (offsetY >= this.listHeaderHeight && this.state.activeTab !== 1) {
        this.setState({ activeTab: 1 })
      } else if (offsetY < this.listHeaderHeight && this.state.activeTab !== 0) {
        this.setState({ activeTab: 0 })
      }
    })
  }

  switchTab = (index) => {
    requestAnimationFrame(() => {
      this.forbidscroll = true
      if (index == 0) {
        Animated.timing(this.state.translateValue, {
          toValue: -44,
          duration: 0, // 动画时间
        }).start();
        this._flatList.scrollToOffset({animated: true, offset: 0})
      } else {
        if (this.listHeaderHeight) {
          this._flatList.scrollToOffset({animated: false, offset: this.listHeaderHeight })
        }
      }
      this.setState({ activeTab: index }, () => {
        this.forbidscroll = false
      })
    })
  }

  flatListHeaderLayout = ({nativeEvent: e}) => {
    this.listHeaderHeight = parseInt(e.layout.height - 44 - 38)
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
    const { id = 29 } = this.props.navigation.state.params || {}
    return id
  }
  async getData() {
    if (this.loading) return
    this.loading = true
    try {
      const id = this.getId()
      const url = this.status == null ? 'api/mail/getInfo.html' : 'api/mail/getMyInfo.html'
      const res = await post(url, { id })
      if (res.code == 1) {
        const { comment, ...items } = res.data.items
        const comments = comment && comment.length > 0 ? comment : []
        this.setState({
          detail: items,
          comments
        }, () => {
          this.ispub = this.state.detail.type == 2
          this.setEye()
        })
      } else {

      }
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  }

  rightBtnOnPress = () => {
    const url = this.ispub ? 'api/mail/setPra.html' : 'api/mail/setPub.html'
    const id = this.getId()
    post(url, { id }).then((res) => {
      if (res.code == 1) {
        this.refs.toast.show(res.msg || '设置成功')
        this.ispub = !this.ispub
        this.setEye()
      } else if (res.code == 10001) {
        this.props.navigation.navigate('Login')
      } else {
        this.refs.toast.show(res.msg || '设置失败');
      }
    })
  }

  setEye() {
    requestAnimationFrame(() => {
      this.noupdate = true
      this.props.navigation.setParams({
        ispub: this.ispub,
      })
    })
  }

  handleReply = (content) => {
    this.addComment(this.pid || 0, content)
  }

  handleSubReply = (pid) => {
    this.pid = pid
    this.refs.replyBox.focus()
  }

  async addComment(pid, content) {
    this.props.navigation.navigate('Login')
    return
    try {
      const id = this.getId()
      const res = await post('api/mail_comment/add.html', {
        pid, mail_id: id, content
      })
      if (res && res.code == 1) {
        this.refs.awardTipRef.show()
        this.refs.replyBox.clear()
        const { comments } = this.state
        if (pid == 0) {
          comments.unshift({
            id: new Date().getTime(),
            user: Global.user,
            content,
          })
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
        this.props.navigation.navigate('Login')
      } else {
        this.refs.errorModalRef.show({txt: res.msg || '回复失败，稍后尝试'})
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.pid = 0
    }
  }

  handleCancel = () => {
    const id = this.getId()
    post('api/mail/cancel.html', { id }).then((res) => {
      if (res.code == 1) {
        this.refs.toast.show('取消发送成功');
        this.setState({ status: 3 })
      } else if (res.code == 10001) {
         this.props.navigation.navigate('Login')
      } else {
        this.refs.toast.show(res.msg || '取消发送失败');
      }
    })
  }

  handleLoadmore = () => {

  }
  render() {
    const { status, activeTab, detail, comments } = this.state
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.topbar, {top: this.state.top}, {transform: [{translateY: this.state.translateValue}]}]}>
          <TopTab index={activeTab} items={ITEMS} onPress={this.switchTab} />
        </Animated.View>
        <SendTip type={status} onPress={this.handleCancel} />
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={comments}
          initialNumToRender={5}
          onScroll={this.handleScroll}
          onEndReachedThreshold={2}
          onEndReached={this.handleLoadmore}
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
    paddingBottom: 10,
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

  rightBtnWrap: {
    width: 54,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  rightBtn: {
    width: 24,
    height: 24,
  },

})
