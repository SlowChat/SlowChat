import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView
} from 'react-native';

import Toast from 'react-native-easy-toast'
import TopTab from '../components/TopTab'
import HeaderTip from '../components/HeaderTip'
import SearchBox from '../components/SearchBox'
import HomeItem from '../components/HomeItem'
import Footer from '../components/Footer'
import Blank from '../components/Blank'
import ErrorTip from '../components/ErrorTip'

import { post } from '../utils/request'

const SIZE = 10
const ITEMS = [{id: 0, name: '最新发布'}, {id: 1, name: '热门'}]

type Props = {};
export default class Space extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: () => (<SafeAreaView style={styles.header} forceInset={{ top: 'always', horizontal: 'never' }}>
          <SearchBox onPress={params.searchBoxPress} />
        </SafeAreaView>)
    }
  }

  state = {
    showFoot: 0,
    activeTab: 0,
    data: [],
    total: 0,
    isBlank: false,
    isError: false,
  }
  componentWillMount() {
    this.init()
  }
  componentDidMount() {
    this.props.navigation.setParams({
      searchBoxPress: (txt) => {
        this.keyword = txt || ''
        this.init()
        this._flatList.scrollToOffset({animated: true, offset: 0})
      }
    })
  }
  tabSwitch = (index) => {
    if (this.state.activeTab == index) return
    this.init({activeTab: index})
    this._flatList.scrollToOffset({animated: true, offset: 0})
  }
  init = (state = {}) => {
    this.setState({ showFoot: 0, items: [], ...state }, () => {
      this.page = 0
      this.getData(0)
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
        const newData = page == 0 ? items : this.state.data.concat(items)
        let showFoot = newData.length >= total ? 1 : 0
        let isBlank = showFoot.length == 0
        this.setState({
          data: newData,
          showFoot,
          isBlank
        })
        this.page++
      } else {
        this.dealError()
      }
    } catch (e) {
      this.dealError()
    } finally {
      this.loading = false
    }
  }
  dealError() {
    const state = {}
    if (this.state.data.length == 0) {
      state.isError = true
    } else {
      // this.refs.toast.show(res.msg || '慢聊飘走了')
    }
    state.showFoot = 0
    this.setState({ state })
  }
  handleLoadmore = () => {
    this.getData(this.page+1)
  }

  handlePress = (id) => {
    this.props.navigation.push('MailDetail', {id})
  }
  renderFooter = () => {
    return <Footer showFoot={this.state.showFoot} />
  }
  render() {
    if (this.state.isError) {
      return <ErrorTip onPress={this.init} />
    }
    if (this.state.isBlank) {
      return <Blank />
    }
    const { activeTab, data } = this.state
    return (
      <View style={styles.container}>
        <HeaderTip tip="发送的邮件提交时选择公开，会在漫友圈显示" />
        <TopTab index={activeTab} items={ITEMS} onPress={this.tabSwitch} />
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={data}
          renderItem={(item) => <HomeItem key={item.id} data={item} onPress={this.handlePress} />}
          initialNumToRender={5}
          keyExtractor={(item) => String(item.id)}
          onEndReachedThreshold={1}
          onEndReached={this.handleLoadmore}
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
    backgroundColor: '#F9F9F9',
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
