import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

import Toast from 'react-native-easy-toast'
import TopTab from '../components/TopTab'
import HeaderTip from '../components/HeaderTip'
import SearchBox from '../components/SearchBox'
import HomeItem from '../components/HomeItem'
import Footer from '../components/Footer'
import Blank from '../components/Blank'
import Loading from '../components/Loading'
import ErrorTip from '../components/ErrorTip'

import { post } from '../utils/request'
import dateFormat from '../utils/date'

const SIZE = 10
const ITEMS = [{id: 0, name: '最新发布'}, {id: 1, name: '热门'}]

type Props = {};
export default class Space extends Component<Props> {
  // static navigationOptions = ({navigation}) => {
  //   const { params = {} } = navigation.state
  //   return {
  //     header: () => (<SafeAreaView style={styles.header} forceInset={{ top: 'always', horizontal: 'never' }}>
  //         <SearchBox onPress={params.searchBoxPress} />
  //       </SafeAreaView>)
  //   }
  // }

  state = {
    showFoot: 0,
    activeTab: 0,
    data: [],
    total: 0,
    showBlank: false,
    showError: false,
    showLoading: false,
  }
  componentWillMount() {
    this.init()
  }
  // componentDidMount() {
  //   this.props.navigation.setParams({
  //     searchBoxPress: (txt) => {
  //       this.keyword = txt || ''
  //       this.init()
  //       this._flatList.scrollToOffset({animated: true, offset: 0})
  //     }
  //   })
  // }
  searchBoxPress = (txt) => {
    this.keyword = txt || ''
    this.init()
    this._flatList.scrollToOffset({animated: true, offset: 0})
  }
  tabSwitch = (index) => {
    if (this.state.activeTab == index) return
    this.init({activeTab: index})
  }
  init = (state = {}) => {
    this.setState({ showFoot: 0, items: [], showBlank: false, ...state }, () => {
      this.page = 0
      this.getData(0)
      setTimeout(() => {
        if (this.loading) {
          this.setState({ showLoading: true })
        }
      }, 200)
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
      const res = await post('api/mail/getList.html', {
        p: page,
        s: SIZE,
        hot: this.state.activeTab,
        keyword
      })
      if (res.code == 1) {
        const { total, items } = res.data
        const curr_item = dateFormat(new Date(), 'yyyy-MM-dd')
        items.forEach(item => {
          // item.send_time = (item.send_time || '').split(' ')[0]
          const [ add_date, add_time ] = item.add_time.split(' ')
          item.add_time = curr_item == add_date ? add_time : add_date
        })
        const newData = page == 0 ? items : this.state.data.concat(items)
        let showFoot = page > 0 && newData.length >= total ? 1 : 0
        let showBlank = page == 0 && newData.length == 0
        this.page++
        this.setState({
          data: newData,
          showFoot,
          showBlank,
        }, () => {
          if (this.page < 2) {
            this._flatList.scrollToOffset({animated: false, offset: 0})
          }
        })
      } else {
        this.dealError()
      }
    } catch (e) {
      this.dealError()
    } finally {
      this.loading = false
      if (this.state.showLoading) {
        this.setState({ showLoading: false })
      }
    }
  }
  dealError() {
    const state = {}
    if (this.page == 0) {
      state.showError = true
    } else {
      // this.refs.toast.show(res.msg || '慢邮飘走了')
    }
    state.showFoot = 0
    this.setState({ state })
  }
  handleLoadmore = () => {
    requestAnimationFrame(() => {
      if (this.page > 0) {
        this.getData(this.page)
      }
    })
  }

  handlePress = (id) => {
    this.props.navigation.push('MailDetail', {id})
  }
  renderHeader = () => {
    return <View style={styles.divider}></View>
  }
  renderFooter = () => {
    return <Footer safe={false} showFoot={this.state.showFoot} />
  }
  render() {
    const { showLoading, showError, showBlank } = this.state
    const { activeTab, data } = this.state
    const isSearch = Boolean(this.keyword)
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.header} forceInset={{ top: 'always', horizontal: 'never' }}>
          <SearchBox onPress={this.searchBoxPress} />
        </SafeAreaView>
        <HeaderTip tip="发送的邮件提交时选择公开，会在慢友圈显示" />
        <TopTab index={activeTab} items={ITEMS} onPress={this.tabSwitch} />
        { showLoading && <Loading /> }
        { showBlank && <Blank searchTxt={isSearch} /> }
        { showError && <ErrorTip onPress={this.init} /> }
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={data}
          renderItem={(item) => <HomeItem key={item.id} data={item} onPress={this.handlePress} />}
          initialNumToRender={5}
          keyExtractor={(item) => String(item.id)}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleLoadmore}
          // ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
        />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    fontFamily: 'PingFangSC-Regular',
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  tipWrap: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tip: {
    height: 17,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 17,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
