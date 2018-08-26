import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import EmailList from '../components/EmailList'
import Toast from 'react-native-easy-toast'
import Loading from '../components/Loading'
import Blank from '../components/Blank'
import Footer from '../components/Footer'
import ErrorTip from '../components/ErrorTip'
import { post } from '../utils/request'
import dateFormat from '../utils/date'

const DATA = {
  reservation: '预定发送信件',
  sent: '完成发送信件',
  public: '我公开的信件',
  // let title = '草稿箱'
}

export default class Email extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: DATA[params.status] || '草稿箱',
      // headerLeft: params.headerLeft,
      headerRight: params.status == 'draft' ? (
        <TouchableOpacity activeOpacity={0.6} style={styles.headerRight} onPress={params.rightOnPress}>
          <Text style={styles.headerRightTxt}>编辑</Text>
        </TouchableOpacity>
      ) : <View />
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
    total: 0,
    searchText: '',
    isShowResult: false,
    isDel: false,
    isAllSelect: false,
    isDelClick: false,
    idList: [] // 全选删除id
  }
  sendState = null //邮件状态 1 待发送 2已发送 3取消
  type = null  //公开状态 1 不公开 2公开
  pageNo = 0
  pageSize = 10

  componentWillMount() {
    this.setDefault()
    this.fetchData()
  }
  componentDidMount() {
    this.props.navigation.setParams({
      rightOnPress: this.handleEdit
    })
  }

  setDefault = () => {
    const { status } = this.props.navigation.state.params || {};
    if (status === 'reservation') {
      this.sendState = 1
    } else if (status === 'sent') {
      this.sendState = 2
    } else if (status === 'public') {
      this.type = 2
    }
    this.status = status
  }

  handleEdit = () => {
    this.setState({
      isDel: true
    })
    let title = `已选择${this.state.idList.length}邮件`
    this.props.navigation.setParams({
      title,
      headerLeft: (
        <Button title="全选" color="#666666" onPress={this.handleAllSelect} />
      ),
      headerRight: (
        <Button title="取消" color="#E24B92" onPress={this.handleCancel} />
      ),
    })
  }

  handleCancel = () => {
    this.setDefault()
    this.setState({
      isAllSelect: false,
      isDel: false,
      idList: []
    })
  }

  handleAllSelect = () => {
    this.state.dataArray.map((item, index) => (
      this.setState({
        idList: this.state.idList.push(item.id)
      })

    ))
    console.log(this.state.idList)
    this.setState({isAllSelect: true})
  }

  initData = () => {
    this.pageNo = 0
    this.fetchData()
  }

  fetchData = () => {
    const params = {
      p: this.pageNo,
      s: this.pageSize,
      keyword: this.state.searchText || ''
    }
    if (this.type !== null) {
      params.type = this.type
    }
    if (this.sendState !== null) {
      params.state = this.sendState
    }
    post(this.returnUrl(), params).then(res => {
      console.log(111111, res)
      const { code } = res
      if (code === 1) {
        let foot = 0
        const { total, items } = res.data
        if (this.pageNo + 1 >= Math.ceil(total / this.pageSize)) {
          // listView底部显示没有更多数据了
          foot = 1
        }

        if (items && items.length <= 0) {
          this.setState({
            isSpacePage: true
          })
        }
        const curr_item = dateFormat(new Date(), 'yyyy-MM-dd')
        items.forEach(item => {
          item.send_time = (item.send_time || '').split(' ')[0]
          const [ add_date, add_time ] = item.add_time.split(' ')
          item.add_time = curr_item == add_date ? add_time : add_date
        })

        this.state.searchText !== '' ? this.setState({isShowResult: true}) : this.setState({isShowResult: false})
        this.setState({
          total: total,
          dataArray: this.state.dataArray.concat(items),
          isLoading: false,
          showFoot: foot,
          isRefreshing: total / this.pageSize > 1,
        })
      }
    }).catch(e => {
      // console.log(e)
    })
  }

  _renderItem = ({item}) => {
    const { navigate, state } = this.props.navigation;
    return (
      <EmailList status={this.status}
        isAllSelect={this.state.isAllSelect}
        item={item}
        score={state.params.score}
        navigate={navigate}
        onPress= {this.onPressCancel}
        isDel={this.state.isDel}
        onSelDelItem = {this.onSelDelItem}
        isDelClick={this.state.isDelClick}
        onSubmitDelete={() => this.submitDelete()}
        onHandleDelClose={() => this.handleDelClose()}
      />
    )
  }



  onSelDelItem = (id) => {
    var newArr = this.state.idList;
    if (newArr.length >= 1) {
      for(var i in newArr) {
        if(newArr.indexOf(id) === -1) {
          newArr.push(id)
        }
      }
    } else {
      newArr.push(id)
    }
    this.setState({
      idList: newArr
    })
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

  onPressCancel = (id) => {
    post('api/mail/cancel.html', {id: id}).then(res => {
      const { code } = res
      if (code === 1) {
        this.refs.toast.show('取消发送成功');
        this.setState({
          dataArray: [],
          idList: []
        })
        this.pageNo = 0
        // 删除成功，重新请求接口
        this.fetchData()
      }
    }).catch(e => {
      // console.log(e)
    })
  }

  handleSearch = () => {
    this.setState({
      dataArray: [],
      idList: []
    })
    this.pageNo = 0
    this.fetchData()
  }

  handleDelete = () => {
    this.setState({isDelClick: true})
  }

  handleDelClose = () => {
    this.setState({isDelClick: false})
  }

  submitDelete = () => {
    console.log(this.state.idList)
    post('api/mail/delDraft.html', {id: this.state.idList}).then(res => {
      const { code } = res
      if (code === 1) {
        this.refs.toast.show('删除成功');
        this.setState({
          dataArray: [],
          idList: [],
          isDelClick: false
        })
        this.pageNo = 0
        // 删除成功，重新请求接口
        this.fetchData()
      } else {
        this.refs.toast.show(res.msg);
      }
    }).catch(e => {
      // console.log(e)
    })
  }

  renderData = () => {
    const { isShowResult } = this.state
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.searchBox}>
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
          <Text style={styles.result}>共查到{this.state.total}条结果</Text>
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
              keyExtractor={(item, index) => String(item.id)}
            />
          ) : this.state.isSpacePage && <Blank />
        }
        <SafeAreaView />
        <Toast ref="toast" position="bottom" />
        {
          this.state.isDel && (
            <TouchableOpacity style={styles.exit} activeOpacity={0.6} onPress={this.handleDelete}>
              <Text style={styles.exitTxt}>删除</Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
  }

  returnUrl() {
    if (this.status === 'draft') {
      return 'api/mail/getDraftList.html'
    } else {
      return 'api/mail/getMyList.html'
    }
  }

  render () {
    // 第一次加载等待的view
    if (this.state.isLoading && !this.state.error) {
      return <Loading />
    } else if (this.state.error) {
      // 请求失败view
      return <ErrorTip onPress={this.initData} />
    }
    // 加载数据
    return this.renderData()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  headerRight: {
    width: 64,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  searchBox: {
    flexDirection: 'row',
    height: 44,
    marginBottom: 10,
    fontFamily: 'PingFangSC-Regular',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 7,
    left: 20,
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
    padding: 0
  },
  result: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  btn: {
    flexDirection: 'row',
    width: '13%',
    fontSize: 16,
    textAlign: 'center',
    color: '#E24B92'
  },
  headerRightTxt: {
    fontFamily: 'PingFangSC-Regular',
    color: '#666',
    fontSize: 16
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

  spaceImg: {
    width: 64,
    height: 64
  },
  exitWrap: {
    backgroundColor: '#fff',
  },
  exit: {
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
  },
  exitTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#EC3632'
  },
});
