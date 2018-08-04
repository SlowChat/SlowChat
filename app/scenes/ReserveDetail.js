import React, { Component } from 'react';


import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Switch,
  // ScrollView,
  FlatList,
  TouchableOpacity,
  UIManager,
} from 'react-native';

import SendTip from '../components/SendTip'
import TopTab from '../components/TopTab'
import MyMailContent from '../components/MyMailContent'
import ReplyItem from '../components/ReplyItem'
import ReplyBox from '../components/ReplyBox'


import { get, post } from '../utils/request'

const ICONS = {
  overt: require('../images/icon_overt.png'),
}

const ITEMS = [{id: 0, name: '信件内容'}, {id: 1, name: '慢友圈'}]

export default class ReserveDetail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '',
      headerRight: (
        <TouchableOpacity style={styles.rightBtnWrap}>
          <Image style={styles.rightBtn} source={ICONS.overt} />
        </TouchableOpacity>
      ),
    }
  }
  state = {
    status: 'ing',
    activeTab: 0,
    data: {},
  }
  componentDidMount() {
    this.props.navigation.setParams({
      rightOnPress: this.rightBtnOnPress
    })
  }
  rightBtnOnPress = () => {
    this.props.navigation.setParams({
      rightColor: '#FFFFFF',
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
  flatListHeaderLayout = ({nativeEvent: e}) => {
    this.listHeaderHeight = e.layout.height - 44 - 38
  }
  handleScroll = (e) => {
    // const { y } =e.nativeEvent.contentOffset
    // const { showTab } = this.state
    // if (y < 89 && showTab) { // 134
    //   this.setState({ showTab: false })
    // } else if (y > 100 && !showTab) {
    //   this.setState({ showTab: true })
    // }
  }
  handleLoadmore = () => {

  }

  handleCancel = () => {
    const { id } = this.state.data
    post('api/mail/cancel.html', { id, id }).then((res) => {
      if (res.code == 0) {
        this.refs.toast.show('取消发送成功');
      } else {
        this.refs.toast.show(res.msg || '取消发送失败');
      }
      // if (res.code == 10001) {
      //   // 跳转到登录页面
      // }
    })
  }

  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    const { status, activeTab, showTab } = this.state
    return (
      <View style={styles.container}>
        <SendTip type={status} onPress={this.handleCancel} />
        <View style={styles.toptab}>
          <TopTab index={activeTab} items={ITEMS} onPress={this.switchTab} />
        </View>
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
          onEndReachedThreshold={3}
          onEndReached={this.handleLoadmore}
          ListHeaderComponent={() => (<View  onLayout={this.flatListHeaderLayout}>
            <MyMailContent />
            <View style={styles.replyHeader} onLayout={({nativeEvent: e}) => console.log(e.layout)}>
              <Text style={[styles.replyComment, styles.replyNum]}>评论 3</Text>
              <Text style={styles.replyNum}>浏览 22</Text>
            </View>
          </View>)}
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
    width: 44,
    textAlign: 'right'
  },
  rightBtn: {
    width: 24,
    height: 24,
  },
});
