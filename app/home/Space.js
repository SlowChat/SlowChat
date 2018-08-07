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

import { post } from '../utils/request'

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
    activeTab: 0,
    data: [],
    total: 0,
  }
  componentWillMount() {
    this.page = 0
    this.getData(0)
  }
  componentDidMount() {
    this.props.navigation.setParams({
      searchBoxPress: (txt) => {
        this.keyword = txt || ''
      }
    })
  }
  tabSwitch = (index) => {
    this.setState({
      activeTab: index
    }, () => {
      this.page = 0
      this.getData(0)
    })
  }
  async getData(page = 0) {
    if (this.loading) return
    this.loading = true
    this.setState({ showFoot: 2 })
    const { keyword = '' } = this
    try {
      this.loading = true
      const res = await post('api/mail/getList.html', {
        p: page,
        s: 10,
        hot: this.state.activeTab,
        keyword
      })
      if (res.code == 1) {
        const { total, items } = res.data
        const newData = page == 0 ? items : this.state.data.concat(items)
        let showFoot = newData.length >= total ? 1 : 0
        this.setState({
          data: newData,
          showFoot
        })
        this.page++
      } else {
        this.refs.toast.show(res.msg || '慢聊飘走了')
        this.setState({ showFoot: 0 })
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }
  handleLoadmore = () => {
    this.getData(this.page+1)
  }

  handlePress = (id) => {
    this.props.navigation.push('MailDetail', {id})
  }
  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    const { activeTab } = this.state
    return (
      <View style={styles.container}>
        <HeaderTip tip="发送的邮件提交时选择公开，会在漫友圈显示" />
        <TopTab index={activeTab} items={ITEMS} onPress={this.tabSwitch} />
        <FlatList
          style={styles.flatlist}
          data={data}
          renderItem={(item) => <HomeItem data={item} onPress={this.handlePress} />}
          initialNumToRender={5}
          keyExtractor={(item) => item.id + ''}
          onEndReachedThreshold={1}
          onEndReached={this.handleLoadmore}
        />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
