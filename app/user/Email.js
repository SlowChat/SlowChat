import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import EmailList from '../components/EmailList'
import UserSearch from '../components/UserSearch'
import { get, post } from '../utils/request'

export default class Email extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '草稿箱',
      headerRight: (
        <View style={styles.icon}>
          <Text style={styles.editBtn}>编辑</Text>
        </View>
      ),
    }
  }
  state = {
    isLoading: true,
    // 网络请求状态
    error: false,
    dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    isRefreshing: false, // 下拉控制
    spaceTxt: '请尝试搜索其他关键词',
    isSpacePage: true,
    total: 0,
    searchText: '',
    isShowResult: false
  }
  sendState = null //邮件状态 1 待发送 2已发送 3取消
  type = null  //公开状态 1 不公开 2公开
  pageNo = 0
  pageSize = 10

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params.status === 'reservation') {
      this.sendState = 1
    } else if (params.status === 'sent') {
      this.sendState = 2
    } else if (params.status === 'public') {
      this.type = 2
    }
    this.fetchData()
  }

  fetchData = () => {
    const params = {
      p: this.pageNo,
      s: this.pageSize,
      state: this.sendState,
      type: this.type,
      keyword: this.state.searchText
    }
    post(this.returnUrl(), params).then(res => {
      console.log(res)
      const { code, data } = res
      if (code === 1) {
        let foot = 0
        if (this.pageNo + 1 >= Math.ceil(data.total / this.pageSize)) {
          // listView底部显示没有更多数据了
          foot = 1
        }
        if (data.items && data.items.length <= 0) {
          this.setState({
            isSpacePage: true
          })
        }
        this.state.searchText !== '' ? this.setState({isShowResult: true}) : this.setState({isShowResult: false})
        this.setState({
          total: data.total,
          dataArray: this.state.dataArray.concat(data.items),
          isLoading: false,
          showFoot: foot,
          isRefreshing: data.total / this.pageSize > 1,
        })
      }
    }).catch(e => {
      // console.log(e)
    })
  }

  _renderItem = ({item}) => {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    return (
      <View>
        <EmailList status={params.status} item={item} navigate={navigate} />
      </View>
    )
  }

    // 列表底部显示
  _renderFooter = () => {
    console.log(this.state.showFoot)
    if (this.state.showFoot === 1) {
      return (
        <View style={styles.footer}>
          <Text style={{color: '#999'}}>
              没有更多数据了
          </Text>
        </View>
      )
    } else if (this.state.showFoot === 2) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text style={{color: '#999'}}>正在加载更多数据...</Text>
        </View>
      )
    } else if (this.state.showFoot === 0) {
      return (
        <View style={styles.footer}>
          <Text />
        </View>
      )
    }
  }

    // 下拉加载更多
  _onEndReached = () => {
    // 如果是正在加载中或没有更多数据了，则返回
    if (this.state.showFoot !== 0) {
      return
    }
    // 如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (this.pageNo + 1 >= Math.ceil(this.state.total_page / this.pageSize)) {
      return
    } else {
      this.pageNo ++
    }
    // 底部显示正在加载更多数据
    this.setState({showFoot: 2})
    // 获取数据
    this.fetchData()
  }

    // 列表分隔线
  _separator = () => {
    return <View style={{height: 1, backgroundColor: '#e0e0e0'}} />
  }

  handleSearch() {
    this.fetchData()
  }

  // 加载等待的view
  renderLoadingView = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating
          style={[styles.gray, {height: 80}]}
          color='red'
          size='large'
        />
      </View>
    )
  }

    // 加载失败view
  renderErrorView = () => {
    return (
      <View style={styles.container}>
        <Image style={styles.spaceImg} source={require('../images/icon_error.png')} />
        <Text>您遇到网络问题</Text>
      </View>
    )
  }

  renderData = () => {
    const { isShowResult } = this.state
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row',justifyContent: 'center',
  alignItems: 'center',}}>
          <Image style={styles.icon} source={require('../images/icon_search.png')} />
          <TextInput
            style={styles.search}
            onChangeText={(text) => this.setState({searchText: text})}
            placeholder='搜索'
            value={this.state.searchText}
          />
          <Text style={styles.btn} onPress={() => this.handleSearch()}>搜索</Text>
        </View>
        {
          isShowResult &&
          <Text>共查到{this.state.total}条结果</Text>
        }

        {
          this.state.dataArray.length > 0 ? (
            <FlatList
              data={this.state.dataArray}
              renderItem={this._renderItem}
              onLoad={this.getDataEvent}
              hasNext={false}
              extraData={this.state}
              ListFooterComponent={this._renderFooter}
              onEndReached={this._onEndReached}
              onEndReachedThreshold={0.1}
              ItemSeparatorComponent={this._separator}
              keyExtractor={(item, index) => String(item.id)}
            />

          ) : (
            <View style={styles.space}>
              {
                this.state.isSpacePage && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <Text style={styles.spaceTit}>没有找到相匹配的结果</Text>
                    <Text style={styles.spaceTxt}>{this.state.spaceTxt}</Text>
                  </View>
                )
              }
            </View>
          )
        }
      </View>
    )
  }

  returnUrl() {
    const { params } = this.props.navigation.state;
    if (params.status === 'draft') {
      return 'api/mail/getDraftList.html'
    } else {
      return 'api/mail/getMyList.html'
    }
  }

  render () {
    // 第一次加载等待的view
    if (this.state.isLoading && !this.state.error) {
      return this.renderLoadingView()
    } else if (this.state.error) {
      // 请求失败view
      return this.renderErrorView()
    }
    // 加载数据
    return this.renderData()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    height: 44,
    fontFamily: 'PingFangSC-Regular',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 30,
    height: 30,
    zIndex: 10
  },
  search: {
    flexDirection: 'row',
    width: '87%',
    alignItems: 'center',
    paddingLeft: 35,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  btn: {
    flexDirection: 'row',
    width: '13%',
    fontSize: 16,
    textAlign: 'center',
    color: '#E24B92'
  },
  editBtn: {
    paddingRight: 15,
    color: '#666',
    fontSize: 18
  },
  emailList: {
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: '#e0e0e0',
    borderTopWidth: 1,
    borderStyle: 'solid'
  },
  space: {
    flex: 1,
    // paddingLeft: '10%',
    // paddingRight: '10%',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f7f8',
    paddingTop: 170,
  },
  spaceImg: {
    width: 64,
    height: 64
  },
  spaceTit: {
    fontSize: 18,
    color: '#999',
  },
  spaceTxt: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24
  }
});
