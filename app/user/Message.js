import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import Swiper from '../components/Swiper'
import MsgItem from '../components/MsgItem'
import Footer from '../components/Footer'
import Loading from '../components/Loading'


import { post } from '../utils/request'
import dateFormat from '../utils/date'


const SIZE = 10

type Props = {};
export default class Message extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: '预约发送邮件提醒'
    }
  }
  state = {
    items: [],
    showFoot: 0,
    showLoading: false,
    showError: false,
    // refreshing: false,
  }
  componentWillMount() {
    this.initData()
  }

  componentWillUnmount() {
    if (this.timer) {
      this.timer && clearTimeout(this.timer)
    }
  }

  initData(state = {}) {
    this.setState({ showFoot: 0, items: [], ...state }, () => {
      this.page = 0
      this.getData(0)
      this.timer = setTimeout(() => {
        if (this.loading) {
          this.setState({ showLoading: true })
        }
      }, 300)
    })
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
      const res = await post('api/user_msg/getList.html', {
        p: page,
        s: SIZE,
        t: 1
      })
      if (res.code == 1) {
        const { total, items } = res.data
        const curr_item = dateFormat(new Date(), 'yyyy-MM-dd')
        items.forEach(item => {
          item.send_time = (item.send_time || '').split(' ')[0]
          const [ add_date, add_time ] = item.add_time.split(' ')
          item.add_time = curr_item == add_date ? add_time : add_date
        })
        const newData = page == 0 ? items : this.state.items.concat(items)
        let showFoot = newData.length >= total ? 1 : 0
        this.setState({
          items: newData,
          showFoot,
        })
        this.page++
      } else if (res.code == 10001) {
        this.props.navigation.navigate('Login')
      } else {
        this.refs.toast.show(res.msg || '慢聊信息飘走了')
        this.setState({ showFoot: 0 })
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
      if (!this.goLogin && this.state.showLoading) {
        this.setState({ showLoading: false })
      }
    }
  }

  handleLoadmore = () => {
    requestAnimationFrame(() => {
      if (this.page > 0) {
        this.getData(this.page)
      }
    })
  }
  // handleRefresh = () => {
  //   this.initData()
  // }
  handleGoDetail = (id) => {
    // this.props.navigation.push('MailDetail', {id})
  }
  renderItem = (item) => {
    return <MsgItem data={item} onPress={this.handleGoDetail} />
  }
  renderFooter = () => {
    return <Footer showFoot={this.state.showFoot} />
  }
  render() {
    const { showLoading, showError, items } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatlist}
          data={items}
          renderItem={this.renderItem}
          initialNumToRender={5}
          keyExtractor={(item, index) => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleLoadmore}
          ListFooterComponent={this.renderFooter}
        />
        <SafeAreaView />
        { showLoading && <Loading /> }
        <Toast ref="toast" position="center" />
      </View>
    )
  }
}

// refreshing={this.state.refreshing}
// onRefresh={this.handleRefresh}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 10,
  },
  itemWrap: {
    backgroundColor: '#F6F6F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  headerTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#333',
    fontWeight: 'bold',
  },
});
