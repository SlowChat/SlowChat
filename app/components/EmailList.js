import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import Confirm from '../components/Confirm'

const ICONS = {
  show: require('../images/icon_overt.png'),
  noShow: require('../images/icon_hide.png'),
  eyes: require('../images/icon_eyes.png'),
  comment: require('../images/icon_comment.png'),
  finish: require('../images/icon_finish.png')
}

export default class EmailList extends Component {

  state ={
    isSucc: false
  }

  cancel() {
    this.setState({isSucc: true})
  }

  renderStatus() {
    /*
    draft: 草稿
    reservation: 预约
    sent: 发送
    public: 公开
    */
    const { status } = this.props;
    if (status === 'draft') {
      return null
    } else if (status === 'reservation') {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
          </View>
          <View style={styles.btn}>
            <Text style={styles.btnTxt} onPress={() => this.cancel()}>取消发送</Text>
          </View>
        </View>
      )
    } else if (status === 'sent') {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={ICONS.eyes}/>
            <Text style={styles.num}>10</Text>
            <Image style={styles.statusIcon} source={ICONS.comment}/>
            <Text style={styles.num}>10</Text>
          </View>
          <View style={styles.statusRight}>
          <Image style={styles.finish} source={ICONS.finish} />
            <Text style={styles.rightTxt}>已完成发送</Text>
          </View>
        </View>
      )
    } else if (status === 'public') {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={ICONS.eyes}/>
            <Text style={styles.num}>10</Text>
            <Image style={styles.statusIcon} source={ICONS.comment}/>
            <Text style={styles.num}>10</Text>
          </View>
          <View style={styles.statusRight}>
          </View>
        </View>
      )
    }
  }
  render() {
    const { item, navigate, status } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => navigate('MailDetail', { id: item.id })}>
        <View>
          <View style={styles.list}>
            <Image style={styles.icon} source={ICONS.show} />
            <View style={styles.content}>
              <Text style={styles.name}>{item.email}</Text>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.sendTime}>发送时间：2020-01-01 18：00</Text>
            </View>
            <View style={styles.time}>
              <Text style={styles.timeTxt}>6-16</Text>
            </View>
          </View>
          { this.renderStatus() }
          <Confirm
            tit={status === 'reservation' ? '确定取消发送邮件吗' : '删除草稿'}
            leftBtnTxt={status === 'reservation' ? '查看积分规则' : '取消'}
            rightBtnTxt={status === 'reservation' ? '再想想' : '取消删除'}
            autoView={
              status === 'reservation' ? (
                <View>
                  <Text>取消发送将从您的积分账户中扣除10积分</Text>
                  <Text>当前积分：5（不足）</Text>
                </View>
              ) : (
                <Text>草稿删除后将不能修复</Text>
              )
            }
            visible={this.state.isSucc}
            onLeftPress={() => {
              this.onRequestClose()
            }}
            onRightPress={() => {
              this.onRightPress() // navigate
            }}
            onRequestClose={this.onRequestClose}
          />
      </View>
    </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    height: 100,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    backgroundColor: '#FFFFFF',
  },
  icon: {
    flexDirection: 'row',
    width: 20,
    height: 17,
    marginRight: 10,
  },
  content: {
    width: '80%'
  },
  name: {
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
  },
  sendTime: {
    color: '#999',
    fontSize: 16,
  },
  time: {
    flexDirection: 'row',
    width: '15%',
    textAlign: 'right',
  },
  timeTxt: {
    color: '#B4B4B4'
  },
  status: {
    flexDirection: 'row',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusLeft: {
    flexDirection: 'row',
    width: '65%',
  },
  statusIcon: {
    width: 20,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  num: {
    color: '#B4B4B4',
    marginRight: 10,
  },
  statusRight: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finish: {
    width: 20,
    height: 20,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightTxt: {
    color: '#B4B4B4'
  },
  btn: {
    flexDirection: 'row',
    width: '30%',
    height: 32,
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: '#666'
  }
});
