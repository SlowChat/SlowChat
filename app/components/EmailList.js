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
    isCancel: false,
    isDelSel: false
  }

  cancel = () => {
    this.setState({isCancel: true})
  }

  onLeftPress = () => {
    const { item, onPress, totalScore, navigate } = this.props;
    if (totalScore >= 10) {
      onPress(item.id)
    } else {
      navigate('Rule')
    }
    this.onRequestClose()
  }

  onRightPress = () => {
    const { status, onSubmitDelete } = this.props;
    if (status === 'reservation') {
      this.onRequestClose()
    } else {
      onSubmitDelete()
      this.onRequestClose()
    }
  }

  onRequestClose = () => {
    this.setState({ isCancel: false })
    this.props.onHandleDelClose()
  }

  handleNav = () => {
    const { item, navigate, isDel, onSelDelItem } = this.props;
    if (isDel) {
      onSelDelItem(item.id)
      this.setState({isDelSel: !this.state.isDelSel})
    } else {
      if (item.state) {
        navigate('MailDetail', { id: item.id, status: item.state })
      } else {
        navigate('DraftDetail', { id: item.id })
      }
    }
  }

  renderStatus(id) {
    /*
    draft: 草稿
    reservation: 预约
    sent: 发送
    public: 公开
    */
    const { status, item } = this.props;
    if (status === 'draft') {
      return null
    } else if (status === 'reservation') {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={require('../images/icon_eyes.png')}/>
            <Text style={styles.num}>{item.looks}</Text>
            <Image style={styles.statusIcon} source={require('../images/icon_comment.png')}/>
            <Text style={styles.num}>{item.comments}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={this.cancel}>
            <Text style={styles.btnTxt}>取消发送</Text>
          </TouchableOpacity>
        </View>
      )
    } else if (status === 'sent') {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={require('../images/icon_eyes.png')}/>
            <Text style={styles.num}>{item.looks}</Text>
            <Image style={styles.statusIcon} source={require('../images/icon_comment.png')}/>
            <Text style={styles.num}>{item.comments}</Text>
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
            <Text style={styles.num}>{item.looks}</Text>
            <Image style={styles.statusIcon} source={require('../images/icon_comment.png')}/>
            <Text style={styles.num}>{item.comments}</Text>
          </View>
          <View style={styles.statusRight}>
          </View>
        </View>
      )
    }
  }
  render() {
    const { item, status, isAllSelect, isDelClick, totalScore, cancelScore } = this.props;
    let leftBtxTxt = ''
    if (status === 'draft') {
      leftBtxTxt = '取消'
    } else if (status === 'reservation' && totalScore >=10) {
      leftBtxTxt = '取消发送'
    } else {
      leftBtxTxt = '查看积分规则'
    }
    const icon = status === 'draft' ? null : <Image style={styles.icon} source={item.type == 1 ? require('../images/icon_hide.png') : require('../images/icon_overt.png')} />
    return (
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.handleNav}>
            <View style={[styles.list, this.state.isDelSel || isAllSelect ? {backgroundColor: '#eee'} : '']}>
              {icon}
              <View style={styles.content}>
                <Text style={styles.name}>{item.email ? item.email : '无收件人'}</Text>
                <Text style={styles.name}>{item.title ? item.title : '无主题'}</Text>
                <Text style={styles.sendTime}>{item.send_time ? `发信时间：${item.send_time}` : '无发信时间'}</Text>
              </View>
              <View style={styles.time}>
                <Text style={styles.timeTxt}>{item.add_time}</Text>
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
                  <Text style={{color: '#999', marginBottom: 10}}>取消发送将从您的积分账户中扣除{cancelScore}积分</Text>
                  <Text style={{fontSize: 16, textAlign: 'center', color: '#333'}}>{totalScore >= 10 ? `我的积分：${totalScore}` : `当前积分：${totalScore}（不足）`}</Text>
                </View>
              ) : (
                <View style={styles.cont}>
                  <Text style={{fontSize: 16, textAlign: 'center', color: '#333'}}>草稿删除后将不能修复</Text>
                </View>
              )
            }
            visible={this.state.isCancel || isDelClick}
            onLeftPress={this.onLeftPress}
            onRightPress={this.onRightPress}
            onRequestClose={this.onRequestClose}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
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
    flex: 1,
    justifyContent: 'center',
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
    textAlign: 'right',
    marginRight: 5,
  },
  timeTxt: {
    color: '#B4B4B4',
    textAlign: 'right',
  },
  status: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusLeft: {
    flex: 1,
    flexDirection: 'row',
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: '#666',
    fontSize: 16
  },
  cont: {
    padding: 30,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderTopColor: '#d8d8d8'
  }
});
