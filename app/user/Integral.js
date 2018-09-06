import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import { post } from '../utils/request'
import Footer from '../components/Footer'
import Blank from '../components/Blank'
import Loading from '../components/Loading'
import ErrorTip from '../components/ErrorTip'

export default class Integral extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    const { navigate } = navigation;
    return {
      title: '',
      headerRight: (
        <TouchableWithoutFeedback onPress={() => navigate('Rule')}>
          <View style={styles.icon}>
            <Text style={styles.ruleBtn}>积分规则</Text>
          </View>
        </TouchableWithoutFeedback>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EEEEEE',
        elevation: 0,
      },
    }
  }
  state = {
    showLoading: true,
    // 网络请求状态
    showError: false,
    dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    showBlank: true,
    total: 0
  }
  page = 0
  pageSize = 10

  componentWillMount() {
    this.initData()
  }

  componentWillUnmount(){
    this.setState = (state,callback)=>{
      return;
    };
  }

  initData(state = {}) {
    this.setState({ showFoot: 0, dataArray: [], ...state }, () => {
      this.page = 0
      this.fetchData()
      setTimeout(() => {
        if (this.loading) {
          this.setState({ showLoading: true })
        }
      }, 200)
    })
  }

  async fetchData() {
    if (this.loading || this.state.showFoot == 1) return
    this.loading = true
    if (this.page > 0) {
      this.setState({ showFoot: 2 })
    }
    try {
      const params = {
        p: this.page,
        s: this.pageSize,
      }
      const res = await post('api/user/score_log.html', params)
      this.loading = false
      console.log(res);
      if (res.code == 1) {
        const { total, total_page, log } = res.data
        const dataArray = this.state.dataArray.concat(log || [])
        let showFoot = dataArray.length >= total_page ? 1 : 0
        this.page++
        this.setState({
          total,
          dataArray,
          showLoading: false,
          showFoot,
          showBlank: dataArray && dataArray.length <= 0
        })
      } else {
        this.refs.toast.show(res.msg || '慢邮信息飘走了')
        this.dealError({showFoot: 0})
      }
    } catch (e) {
      this.setState(state)
    }
  }

  dealError(state = {}) {
    this.loading = false
    this.setState({
      showLoading: false,
      showError: this.page == 0,
      ...state
    })
  }

  handleLoadmore = () => {
    if (this.page > 0) {
      requestAnimationFrame(() => {
        this.fetchData(this.page)
      })
    }
  }

  _renderItem({item}) {
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

  _renderFooter = () => {
    return <Footer showFoot={this.state.showFoot} />
  }

  renderData() {
    if (this.state.showBlank) {
      return <Blank />
    }
    return (<FlatList
      style={styles.flatlist}
      keyExtractor={(item, index) => String(index)}
      data={this.state.dataArray}
      renderItem={this._renderItem}
      ListFooterComponent={this._renderFooter}
      onEndReached={this.handleLoadmore}
      onEndReachedThreshold={0.1}
    />)
  }

  render () {
    // 第一次加载等待的view
    if (this.state.showLoading) {
      return <Loading />
    } else if (this.state.showError) {
      // 请求失败view
      return <ErrorTip onPress={this.initData}  />
    }
    // 加载数据
    return <View style={styles.container}>
      <View style={styles.integralBox}>
        <Text style={styles.tit}>我的积分</Text>
        <Text style={styles.score}>{this.state.total}</Text>
      </View>
      {this.renderData()}
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  ruleBtn: {
    paddingRight: 15,
    color: '#E24B92',
    fontSize: 18
  },
  integralBox: {
    paddingTop: 30,
    paddingBottom: 20,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  tit: {
    color: '#666',
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    height: 25,
    lineHeight: 25,
    marginBottom: 5,
  },
  score: {
    color: '#E24B92',
    fontSize: 40,
    fontFamily: 'PingFang-SC-Semibold',
    fontWeight: 'normal',
    height: 56,
    lineHeight: 56,
  },
  flatlist: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems:'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  left: {
    flex: 1,
  },
  time: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#999',
    height: 20,
    lineHeight: 20,
  },
  detail: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    height: 22,
    lineHeight: 22,
  },
  right: {
    flex: 1,
    flexDirection: 'row',
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid'
  },
});
