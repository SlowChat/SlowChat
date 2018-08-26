import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from 'react-native';
import {SafeAreaView} from 'react-navigation'

export default class Rule extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '积分规则',
    }
  }
  componentDidMount() {

  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.ruleBox}>
          <View style={styles.tit}>
            <Image style={styles.icon} source={require('../images/icon_info.png')} />
            <Text style={styles.titTxt}>如何获得积分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>新用户注册</Text>
            <Text style={styles.focus}>+20分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>发信（公开）</Text>
            <Text style={styles.focus}>+50分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>发信（不公开）</Text>
            <Text style={styles.focus}>+15分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>发表评论</Text>
            <Text style={styles.focus}>+10分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>分享</Text>
            <Text style={styles.focus}>+30分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>完善个人资料</Text>
            <Text style={styles.focus}>+30分</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>打卡</Text>
            <Text style={styles.focus}>+1至31分/天（按日累进）</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.remind}>每月重新起算每天一次，连续签到天数越多，可获得的积分值越高，一旦断签，签到积分从1开始累计计算</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.focus}>*</Text>
            <Text style={styles.txt}>删除未发送邮件</Text>
            <Text style={styles.focus}>-1000分</Text>
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
        <SafeAreaView />
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
