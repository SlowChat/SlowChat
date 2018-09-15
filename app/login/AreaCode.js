import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import { post } from '../utils/request'
import Blank from '../components/Blank'
import Loading from '../components/Loading'
import ErrorTip from '../components/ErrorTip'

export default class AreaCode extends Component {
  static navigationOptions = {
    title: '区号选择',
  }
  
  state = {
    showLoading: true,
    // 网络请求状态
    showError: false,
    dataArray: [],
    showBlank: true,
    total: 0
  }

  componentWillMount() {
    this.fetchData()
    setTimeout(() => {
      if (this.loading) {
        this.setState({ showLoading: true })
      }
    }, 200)
  }

  componentWillUnmount(){
    this.setState = (state,callback)=>{
      return;
    };
  }

  fetchData = async () => {
    if (this.loading) return
    try {
      this.loading = true
      const res = await post('api/common/getMobileAreaCode.html')
      this.loading = false
      if (res.code == 1) {
        this.setState({
          dataArray: res.data,
          showBlank: res.data.length == 0,
          showLoading: false
        })
      } else {
        this.refs.toast.show(res.msg || '慢邮信息飘走了')
        this.dealError()
      }
    } catch (e) {
      this.dealError()
    }
  }
  
  dealError(state = {}) {
    this.loading = false
    this.setState({
      showLoading: false,
      showError: this.state.dataArray.length == 0,
      ...state
    })
  }
  handlePress = (code) => {
    const { navigation } = this.props
    const { setAreaCode } = navigation.state.params || {}
    setAreaCode && setAreaCode(code);
    navigation.goBack()
  }
  renderItem = ({item}) => {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={this.handlePress.bind(this, item.code)}>
        <Text style={[styles.left, styles.txt]}>{item.code}</Text>
        <Text style={styles.txt}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  renderContent () {
    // 第一次加载等待的view
    if (this.state.showLoading) {
      return <Loading />
    } else if (this.state.showError) {
      // 请求失败view
      return <ErrorTip onPress={this.fetchData}  />
    } else if (this.state.showBlank) {
      return <Blank />
    }
    // 加载数据
    return <FlatList
      style={styles.flatlist}
      keyExtractor={(item) => String(item.code)}
      data={this.state.dataArray}
      renderItem={this.renderItem}
    />
  }
  render() {
    return <SafeAreaView style={styles.container} forceInset={{top: 'never', bottom: 'always'}}>
      {this.renderContent()}
    </SafeAreaView>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  flatlist: {
    marginTop: 10,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
    height: 44,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems:'center',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  left: {
    flex: 1,
  },
  txt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  }
});
