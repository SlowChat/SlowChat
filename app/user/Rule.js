import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import { get, post } from '../utils/request'

export default class Rule extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '积分规则',
    }
  }
  state = {
    scoreInfo: []
  }
  componentDidMount() {
    this.getData()
  }

  getData() {
    get('api/common/getScoreInfo.html').then(res => {
      const { code, data } = res
      console.log(111111, data.score)
      if (code === 1) {
        this.setState({scoreInfo: data.score})
      }
    }).catch(e => {
      console.log(e)
    })
  }

  render() {
    const { scoreInfo } = this.state;
    console.log(scoreInfo.length)
    if (scoreInfo.length <= 0) return null
    return (
      <ScrollView style={styles.container} forceInset={{top: 'never', bottom: 'always'}}>
        <View style={styles.ruleBox}>
          <View style={styles.tit}>
            <Image style={styles.icon} source={require('../images/icon_info.png')} />
            <Text style={styles.titTxt}>如何获得积分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>新用户注册</Text>
            <Text style={styles.focus}>{scoreInfo[0].score}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>发信（公开）</Text>
            <Text style={styles.focus}>{scoreInfo[4].score}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>发信（不公开）</Text>
            <Text style={styles.focus}>{scoreInfo[5].score}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>发表评论</Text>
            <Text style={styles.focus}>{scoreInfo[6].score}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>分享</Text>
            <Text style={styles.focus}>{scoreInfo[7].score}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>完善个人资料</Text>
            <Text style={styles.focus}>{scoreInfo[1].score}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>打卡</Text>
            <Text style={styles.focus}>{scoreInfo[2].score}至{scoreInfo[3].score}分/天（按日累进）</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.remind}>每月重新起算每天一次，连续签到天数越多，可获得的积分值越高，一旦断签，签到积分从1开始累计计算</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>删除未发送邮件</Text>
            <Text style={styles.focus}>{scoreInfo[8].score}</Text>
          </View>
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
        <SafeAreaView style={{backgroundColor: '#FFFFFF'}} forceInset={{top: 'never', bottom: 'always'}} />
      </ScrollView>
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
