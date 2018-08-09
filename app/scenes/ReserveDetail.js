import React, { Component } from 'react';


import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Switch,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import Toast from 'react-native-easy-toast'

import SendTip from '../components/SendTip'
import TopTab from '../components/TopTab'
import MyMailContent from '../components/MyMailContent'
import ReplyItem from '../components/ReplyItem'
import ReplyBox from '../components/ReplyBox'

import { post } from '../utils/request'

const ICONS = {
  overt: require('../images/icon_overt.png'),
  hide: require('../images/icon_hide.png'),
}
const ANIMAT_TIME = 500
const ITEMS = [{id: 0, name: '信件内容'}, {id: 1, name: '慢友圈'}]

export default class ReserveDetail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: params.title || '邮件详情',
      headerRight: (
        <TouchableOpacity activeOpacity={0.7} style={styles.rightBtnWrap} onPress={params.rightBtnOnPress}>
          <Image style={styles.rightBtn} source={params.ispub ? ICONS.overt : ICONS.hide} />
        </TouchableOpacity>
      ),
    }
  }
  static defaultProps = {
    title: '20岁，来自父亲的祝福！'
  }
  state = {
    status: 'ing',
    activeTab: 0,
    data: {},
    translateValue: new Animated.Value(-44),
  }
  componentDidMount() {
    this.props.navigation.setParams({
      rightBtnOnPress: this.rightBtnOnPress
    })
  }
  shouldComponentUpdate() {
    if (this.noupdate) {
      this.noupdate = false
      return false
    }
    return true
  }
  rightBtnOnPress = () => {
    this.noupdate = true
    this.ispub = !this.ispub
    const url = this.ispub ? 'api/mail/setPub.html' : 'api/mail/setPra.html'
    const { id } = this.state.data
    post(url, { id }).then((res) => {
      if (res.code == 1) {
        this.refs.toast.show(res.msg || '设置成功');
        this.props.navigation.setParams({
          ispub: this.ispub,
        })
      } else if (res.code == 10001) {
        this.props.navigation.navigate('Login', {back: true})
      } else {
        this.refs.toast.show(res.msg || '设置失败');
      }
    })



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
  handleLoadmore = () => {

  }
  handleCancel = () => {
    const { id } = this.state.data
    post('api/mail/cancel.html', { id }).then((res) => {
      if (res.code == 1) {
        this.refs.toast.show('取消发送成功');
      } else if (res.code == 10001) {
         this.props.navigation.navigate('Login')
      } else {
        this.refs.toast.show(res.msg || '取消发送失败');
      }
    })
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

  renderHeader = () => {
    return (<View onLayout={this.flatListHeaderLayout}>
      <MyMailContent />
      <View style={styles.replyHeader} onLayout={({nativeEvent: e}) => console.log(e.layout)}>
        <Text style={[styles.replyComment, styles.replyNum]}>评论 3</Text>
        <Text style={styles.replyNum}>浏览 22</Text>
      </View>
    </View>)
  }

  render() {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push({key: i, title: i + ''});
    }
    const { status, activeTab, showTab } = this.state
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.topbar, {transform: [{translateY: this.state.translateValue}]}]}>
          <TopTab index={activeTab} items={ITEMS} onPress={this.switchTab} />
        </Animated.View>
        <SendTip type={status} onPress={this.handleCancel} />
        {
          showTab && (
            <View style={styles.toptab}>
              <TopTab index={activeTab} items={ITEMS} onPress={this.switchTab} />
            </View>
          )
        }
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={data}
          renderItem={(item) => <ReplyItem item={item} />}
          initialNumToRender={10}
          keyExtractor={(item, index) => item.key + ''}
          onScroll={this.handleScroll}
          onEndReachedThreshold={2}
          onEndReached={this.handleLoadmore}
          ListHeaderComponent={this.renderHeader}
        />
        <ReplyBox/>
        <Toast ref="toast" position="bottom" />
      </View>
    )
  }
}

// keyExtractor={this._keyExtractor}

// ListHeaderComponent={() => (<View>
//   <MyMailContent />
//   <View style={styles.replyHeader}>
//     <Text style={[styles.replyComment, styles.replyNum]}>评论 3</Text>
//     <Text style={styles.replyNum}>浏览 22</Text>
//   </View>
// </View>)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    fontFamily: 'PingFangSC-Regular',
  },
  toptab: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  flatlist: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    marginBottom: 10,
  },

  topbar: {
    position: 'absolute',
    top: 44,
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

  rightBtnWrap: {
    width: 54,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  rightBtn: {
    width: 24,
    height: 24,
  },
});
