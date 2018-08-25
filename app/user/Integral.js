import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import { get, post } from '../utils/request'

import Footer from '../components/Footer'
import Blank from '../components/Blank'
import Loading from '../components/Loading'
import ErrorTip from '../components/ErrorTip'

export default class Integral extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    const { navigate } = navigation;
    return {
      title: '我的积分',
      headerRight: (
        <TouchableWithoutFeedback onPress={() => navigate('Rule')}>
          <View style={styles.icon}>
            <Text style={styles.ruleBtn}>积分规则</Text>
          </View>
        </TouchableWithoutFeedback>
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
    isSpacePage: true,
    total: 0
  }
  pageNo = 0
  pageSize = 10

  componentDidMount() {
    this.fetchData()
  }

  initData = () => {
    this.pageNo = 0
    this.fetchData()
  }

  fetchData = () => {
    post('api/user/score_log.html', { p:this.pageNo, s:this.pageSize}).then(res => {
      const { code, data } = res
      console.log(res)
      if (code === 1) {
        let foot = 0
        if (this.pageNo + 1 >= Math.ceil(data.total_page / this.pageSize)) {
          // listView底部显示没有更多数据了
          foot = 1
        }
        if (data.log && data.log.length <= 0) {
          this.setState({
            isSpacePage: true
          })
        }
        this.setState({
          total: data.total,
          dataArray: this.state.dataArray.concat(data.log),
          isLoading: false,
          showFoot: foot,
          isRefreshing: data.total_page / this.pageSize > 1,
        })

      }
    }).catch(e => {
      console.log(e)
    })
  }

  _renderItem = ({item}) => {
    return (
      <View style={styles.list}>
        <View style={styles.left}>
          <Text style={styles.time}>{item.time}</Text>
          <Text style={styles.detail}>{item.item}</Text>
        </View>
        <Text style={styles.right}>
          +{item.score}
        </Text>
      </View>
    )
  }

    // 列表底部显示
  _renderFooter = () => {
    return <Footer showFoot={this.state.showFoot} />
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
    return (
      <View style={styles.container}>
        <View style={styles.integralBox}>
          <Text style={styles.tit}>我的积分</Text>
          <Text style={styles.score}>{this.state.total}</Text>
        </View>
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
              // keyExtractor={(item, index) => item}
            />
          ) : this.state.isSpacePage && <Blank />
        }
      </View>
    )
  }

  render () {
    // 第一次加载等待的view
    if (this.state.isLoading && !this.state.error) {
      return <Loading />
    } else if (this.state.error) {
      // 请求失败view
      return <ErrorTip onPress={this.initData}  />
    }
    // 加载数据
    return this.renderData()
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  ruleBtn: {
    paddingRight: 15,
    color: '#E24B92',
    fontSize: 18
  },
  integralBox: {
    paddingTop: 50,
    paddingBottom: 50,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  tit: {
    fontSize: 18,
    color: '#666'
  },
  score: {
    color: '#E24B92',
    fontSize: 40,
  },
  list: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems:'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  left: {
    width: '80%'
  },
  time: {
    fontSize: 14,
    color: '#999',
    marginBottom: 3
  },
  detail: {
    fontSize: 18
  },
  right: {
    flexDirection: 'row',
    width: '20%',
    textAlign: 'right',
    color: '#E24B92',
    fontSize: 18
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
});
