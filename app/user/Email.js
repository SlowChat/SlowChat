import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  FlatList,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import EmailList from '../components/EmailList'
import Toast from 'react-native-easy-toast'
import Loading from '../components/Loading'
import Blank from '../components/Blank'
import Footer from '../components/Footer'
import ErrorTip from '../components/ErrorTip'
import { post } from '../utils/request'
import dateFormat from '../utils/date'
import SuccessModal from '../components/SuccessModal'

const DATA = {
  reservation: '预定发送信件',
  sent: '完成发送信件',
  public: '我公开的信件',
}

export default class Email extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: DATA[params.status] || '草稿箱',
      headerRight: params.status == 'draft' ? (
        <TouchableOpacity activeOpacity={0.6} style={styles.headerRight} onPress={params.rightOnPress}>
          <Text style={styles.headerRightTxt}>编辑</Text>
        </TouchableOpacity>
      ) : <View />,
      headerStyle: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EEEEEE',
        elevation: 0,
      },
    }
  }


  state = {
    showLoading: false,
    // 网络请求状态
    showError: false,
    dataArray: [],
    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    showBlank: false,
    total: 0,
    searchText: '',
    isShowResult: false,
    isDel: false,
    isAllSelect: false,
    isDelClick: false,
    idList: '', // 全选删除id
    isSucc: false
  }
  sendState = null //邮件状态 1 待发送 2已发送 3取消
  type = null  //公开状态 1 不公开 2公开
  pageNo = 0
  pageSize = 10

  componentWillMount() {
    this.setDefault()
    this.initData()
  }
  componentDidMount() {
    this.props.navigation.setParams({
      rightOnPress: this.handleEdit
    })
  }

  componentWillUnmount(){
    this.setState = (state,callback)=>{
      return;
    };
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
    let title = `已选择${this.state.idList.split(',').length}邮件`
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

  initData(state = {}) {
    this.setState({ showFoot: 0, dataArray: [], idList: '', isShowResult: false, ...state }, () => {
      this.page = 0
      this.fetchData(0)
      setTimeout(() => {
        if (this.loading) {
          this.setState({ showLoading: true })
        }
      }, 200)
    })
  }

  getFetchUrl() {
    if (this.status === 'draft') {
      return 'api/mail/getDraftList.html'
    } else {
      return 'api/mail/getMyList.html'
    }
  }

  async fetchData(page = 0) {
    if (this.loading || this.state.showFoot == 1) return
    this.loading = true
    if (page > 0) {
      this.setState({ showFoot: 2 })
    }
    const { keyword = '' } = this
    try {
      const params = {
        p: this.page,
        s: this.pageSize,
        keyword: this.state.searchText || ''
      }
      if (this.type !== null) {
        params.type = this.type
      }
      if (this.sendState !== null) {
        params.state = this.sendState
      }
      const res = await post(this.getFetchUrl(), params)
      console.log(res);
      this.loading = false
      if (res.code == 1) {
        const { total, items, total_score, cancel_score } = res.data
        const curr_item = dateFormat(new Date(), 'yyyy-MM-dd')
        items.forEach(item => {
          item.send_time = (item.send_time || '').split(' ')[0]
          let [ add_date, add_time ] = item.add_time.split(' ')
          add_date = add_date.replace(/\-/g, '/')
          item.add_time = curr_item == add_date ? add_time : add_date
        })
        const dataArray = this.state.dataArray.concat(items)
        let showFoot = dataArray.length >= total ? 1 : 0
        this.page++
        this.setState({
          total: total,
          dataArray,
          totalScore: total_score,
          cancelScore: cancel_score,
          showLoading: false,
          showFoot,
          isShowResult: this.state.searchText !== '',
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
      showBlank: false,
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

  onSelDelItem = (id) => {
    let newArr = this.state.idList;
    console.log(newArr)
    if (this.state.idList.split(',').length >= 1){
      if (this.state.idList.indexOf(id) === -1) {
        console.log(1111111)
        newArr = newArr + id + ','
      } else {
        newArr = newArr.replace(`${id.toString()},`, '')
        console.log(newArr)
      }
    } else {
      newArr = id
    }
    this.setState({
      idList: newArr
    })
  }

  onPressCancel = (id) => {
    post('api/mail/cancel.html', {id: id}).then(res => {
      console.log(1111, res)
      const { code } = res
      if (code === 1) {
        // this.refs.toast.show('取消发送成功');
        this.initData({ isSucc: true })
      } else {
        this.refs.toast.show(res.msg);
      }
    }).catch(e => {
      // console.log(e)
    })
  }

  handleSearch = () => {
    Keyboard.dismiss()
    this.initData()
  }

  handleDelete = () => {
    this.setState({isDelClick: true})
  }

  handleDelClose = () => {
    this.setState({isDelClick: false})
  }

  submitDelete = () => {
    const { idList } = this.state;
    const id = idList.substring(0, idList.length-1)
    post('api/mail/delDraft.html', {id: id}).then(res => {
      const { code } = res
      if (code === 1) {
        this.refs.toast.show('删除成功');
        // 删除成功，重新请求接口
        this.initData({ isDelClick: false })
      } else {
        this.refs.toast.show(res.msg);
      }
    }).catch(e => {
      // console.log(e)
    })
  }

  handleCancel = () => {
    this.setDefault()
    this.setState({
      isAllSelect: false,
      isDel: false,
      idList: ''
    })
  }

  handleAllSelect = () => {
    this.state.dataArray.map((item, index) => (
      this.setState({
        // idList: this.state.idList.push(item.id)
        idList: `${this.state.idList},${item.id}`
      })

    ))
    console.log(this.state.idList)
    this.setState({isAllSelect: true})
  }

  onRequestClose = () => {
    this.setState({ isSucc: false })
  }

  renderItem = ({item}) => {
    const { navigate } = this.props.navigation;
    return (
      <EmailList status={this.status}
        isAllSelect={this.state.isAllSelect}
        item={item}
        navigate={navigate}
        onPress= {this.onPressCancel}
        isDel={this.state.isDel}
        onSelDelItem = {this.onSelDelItem}
        isDelClick={this.state.isDelClick}
        totalScore={this.state.totalScore}
        cancelScore={this.state.cancelScore}
        onSubmitDelete={() => this.submitDelete()}
        onHandleDelClose={() => this.handleDelClose()}
      />
    )
  }

  renderFooter = () => {
    return <Footer showFoot={this.state.showFoot} />
  }
  renderData() {
    const { showBlank, searchText } = this.state
    const isSearch = Boolean(searchText)
    if (this.state.showBlank) return <Blank searchTxt={isSearch} />
    const { dataArray } = this.state
    const { params } = this.props.navigation.state;
    return (
      <FlatList
        keyExtractor={(item, index) => String(item.id)}
        data={dataArray}
        extraData={this.state}
        renderItem={this.renderItem}
        onEndReached={this.handleLoadmore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={this.renderFooter}
      />
    )
  }

  render () {
    // 第一次加载等待的view
    if (this.state.showLoading) {
      return <Loading />
    } else if (this.state.showError) {
      // 请求失败view
      return <ErrorTip onPress={this.initData} />
    }
    // 加载数据
    const { searchText } = this.state
    return <View style={styles.container}>
      <View style={styles.searchBox}>
        <Image style={styles.icon} source={require('../images/icon_search.png')} />
        <TextInput
          style={styles.search}
          onChangeText={(text) => this.setState({searchText: text})}
          placeholder='搜索'
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          underlineColorAndroid='transparent'
          clearButtonMode="while-editing"
          placeholderColor="#D8D8D8"
          onSubmitEditing={this.handleSearch}
          // value={searchText}
        />
        <Text style={styles.btn} onPress={this.handleSearch}>搜索</Text>
      </View>
      {
        this.state.isShowResult &&
        <Text style={styles.result}>共查到{this.state.total}条结果</Text>
      }
      {this.renderData()}
      <SuccessModal
        txt={'取消发送成功'}
        btn={'返回'}
        visible={this.state.isSucc}
        onPress={this.onRequestClose}
        onClose={this.onRequestClose}
      />
      <Toast ref="toast" position="center" />
      {
        this.state.isDel && (
          <TouchableOpacity style={styles.exit} activeOpacity={0.6} onPress={this.handleDelete}>
            <Text style={styles.exitTxt}>删除</Text>
          </TouchableOpacity>
        )
      }
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  headerRight: {
    width: 64,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  searchBox: {
    position: 'relative',
    flexDirection: 'row',
    height: 44,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 7,
    left: 15,
    width: 30,
    height: 30,
    zIndex: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC',
  },
  search: {
    flex: 1,
    fontFamily: 'PingFangSC-Regular',
    alignItems: 'center',
    paddingLeft: 45,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCCCCC',
    fontSize: 16,
    padding: 0
  },
  result: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  btn: {
    width: 57,
    fontSize: 16,
    paddingLeft: 10,
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
    borderTopWidth: StyleSheet.hairlineWidth,
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
