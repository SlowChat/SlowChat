import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import Confirm from '../components/Confirm'

// const ICONS = {
//   noShow: require('../images/icon_hide.png'),
// }

export default class EmailList extends Component {

  state ={
    isSucc: false
  }

  cancel() {
    this.setState({isSucc: true})
  }

  onLeftPress() {
    const { id, onPress, score, navigate } = this.props;
    if (score >= 10) {
      onPress(id) 
    } else {
      navigate('Rule')
    }
    this.onRequestClose()
  }

  onRightPress() {

    this.onRequestClose()
  }

  onRequestClose = () => {
    this.setState({ isSucc: false })
  }

  handleNav = () => {
    const { item, navigate, status } = this.props;
    if (status == 'draft') {
      navigate('DraftDetail', { id: item.id })
    } else {
      navigate('MailDetail', { id: item.id, status: item.state })
    }
  }

  renderStatus(id) {
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
          <TouchableOpacity style={styles.btn} onPress={() => this.cancel()}>
            <Text style={styles.btnTxt}>取消发送</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status === 'sent') {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={require('../images/icon_eyes.png')}/>
            <Text style={styles.num}>10</Text>
            <Image style={styles.statusIcon} source={require('../images/icon_comment.png')}/>
            <Text style={styles.num}>10</Text>
          </View>
          <View style={styles.statusRight}>
          <Image style={styles.finish} source={require('../images/icon_finish.png')} />
            <Text style={styles.rightTxt}>已完成发送</Text>
          </View>
        </View>
      )
    } else if (status === 'public') {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={require('../images/icon_eyes.png')}/>
            <Text style={styles.num}>10</Text>
            <Image style={styles.statusIcon} source={require('../images/icon_comment.png')}/>
            <Text style={styles.num}>10</Text>
          </View>
          <View style={styles.statusRight}>
          </View>
        </View>
      )
    }
  }
  render() {
    const { item, status, score } = this.props;
    let leftBtxTxt = ''
    if (status === 'draft') {
      leftBtxTxt = '取消'
    } else if (status === 'reservation' && score >=10) {
      leftBtxTxt = '取消发送'
    } else {
      leftBtxTxt = '查看积分规则'
    }
    return (
        <View>
          <TouchableWithoutFeedback onPress={this.handleNav}>
            <View style={styles.list}>
              <Image style={styles.icon} source={require('../images/icon_overt.png')} />
              <View style={styles.content}>
                <Text style={styles.name}>{item.email}</Text>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.sendTime}>发送时间：2020-01-01 18：00</Text>
              </View>
              <View style={styles.time}>
                <Text style={styles.timeTxt}>6-16</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          { this.renderStatus(item.id) }
          <Confirm
            tit={status === 'reservation' ? '确定取消发送邮件吗' : '删除草稿'}
            leftBtnTxt={leftBtxTxt}
            rightBtnTxt={status === 'reservation' ? '再想想' : '确定删除'}
            autoView={
              status === 'reservation' ? (
                <View style={styles.cont}>
                  <Text style={{color: '#999', marginBottom: 10}}>取消发送将从您的积分账户中扣除10积分</Text>
                  <Text style={{fontSize: 16, textAlign: 'center', color: '#333'}}>{score >= 10 ? `我的积分：${score}` : `当前积分：${score}（不足）`}</Text>
                </View>
              ) : (
                <Text>草稿删除后将不能修复</Text>
              )
            }
            visible={this.state.isSucc}
            onLeftPress={() => {
              this.onLeftPress()
            }}
            onRightPress={() => {
              this.onRightPress() // navigate
            }}
            onRequestClose={this.onRequestClose}
          />
      </View>
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
  },
  cont: {
    padding: 30,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#d8d8d8'
  }
});
