import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import ErrorTip from '../components/ErrorTip'
import Loading from '../components/Loading'
import { post } from '../utils/request'

export default class Rule extends Component {
  static navigationOptions = {
    title: '积分规则',
  }
  state = {
    items: [],
    showLoading: true,
    showError: false,
  }
  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({ showLoading: true })
    try {
      const res = await post('api/common/getScoreInfo.html')
      this.setState({ showLoading: false })
      if (res.code === 1) {
        this.setState({items: res.data, showError: false })
      } else {
        this.setState({ showError: true })
      }
    } catch (e) {
      this.setState({ showError: true, showLoading: false })
    }
  }

  render() {
    const { showLoading, showError } = this.state;
    if (showLoading) return <Loading />
    if (showError) return <ErrorTip onPress={this.getData} />
    const { items } = this.state
    console.log(items);
    return (
      <SafeAreaView style={styles.container} forceInset={{top: 'never', bottom: 'always'}}>
        <View style={styles.ruleBox}>
          <View style={styles.tit}>
            <Image style={styles.icon} source={require('../images/icon_info.png')} />
            <Text style={styles.titTxt}>如何获得积分</Text>
          </View>
          {
            items.map((item, index) => {
              return <View key={index}>
                <View style={styles.info}>
                  <Text style={styles.focus}>*</Text>
                  <Text style={styles.txt}>{item.label}</Text>
                  <Text style={styles.focus}>{item.score}</Text>
                </View>
                {item.desc ? <View style={styles.info}>
                  <Text style={[styles.remind]}>{item.desc}</Text>
                </View> : null}
              </View>
            })
          }
        </View>
        <View style={styles.ruleBox}>
          <View style={styles.tit}>
            <Image style={styles.icon} source={require('../images/icon_info.png')} />
            <Text style={styles.titTxt}>积分存在有效期？</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.txt}>不设置有效期，积分永久有效。</Text>
          </View>
        </View>
        <View style={styles.ruleBox}>
          <View style={styles.tit}>
            <Image style={styles.icon} source={require('../images/icon_info.png')} />
            <Text style={styles.titTxt}>严禁用作弊方法获得积分？</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.txt}>对于以不正当手段（包括但不限于作弊、网络攻击，扰乱系统等）参与积分获取的用户，慢邮有权禁止其参与并取消其所获得和操作分及冻结或删除其账户</Text>
          </View>
        </View>
        <View style={styles.ruleBox}>
          <View style={styles.tit}>
            <Image style={styles.icon} source={require('../images/icon_info.png')} />
            <Text style={styles.titTxt}>积分可以用来做什么？</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.txt}>已经提交等待发送的邮件想要撤回删除时，每一次消耗1000积分，若积分累计不足时无法撤回删除</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  ruleBox: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderBottomColor: '#eee'
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  tit: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 15,
    alignItems:'center',
  },
  titTxt: {
    color: '#E24B92',
    fontSize: 16,
  },
  info: {
    flexDirection: 'row',
    marginLeft: 25,
    marginBottom: 20,
    alignItems:'center',
  },
  remind: {
    fontSize: 14,
    lineHeight: 20,
    color: '#999',
    marginLeft: 10,
    marginTop: -15
  },
  focus: {
    flexDirection: 'row',
    color: '#E24B92',
    fontSize: 16,
  },
  txt: {
    flexDirection: 'row',
    lineHeight: 24,
    color: '#666',
    marginLeft: 5,
    marginRight: 5,
    fontSize: 16,
  }
});
