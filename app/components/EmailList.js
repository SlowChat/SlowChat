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
    const { item, onPress, totalScore, navigate, cancelScore } = this.props;
    if (totalScore >= cancelScore) {
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

  renderStatusBtn() {
    const { status, item } = this.props
    if (item.state == 1) {
      return <TouchableOpacity style={styles.btn} onPress={this.cancel}>
          <Text style={styles.btnTxt}>取消发送</Text>
        </TouchableOpacity>
    } else if (item.state == 2) {
      return <View style={styles.statusRight}>
        <Image style={styles.finish} source={require('../images/icon_finish.png')} />
        <Text style={styles.rightTxt}>已完成发送</Text>
      </View>
    } else if (item.state == 4) {
      return <View style={styles.statusRight}>
        <Image style={styles.finish} source={require('../images/icon_fail.png')} />
        <Text style={styles.rightTxt}>发送失败</Text>
      </View>
    }
    return null
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
    } else {
      return (
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={require('../images/icon_eyes.png')}/>
            <Text style={styles.num}>{item.looks}</Text>
            <Image style={styles.statusIcon} source={require('../images/icon_comment.png')}/>
            <Text style={styles.num}>{item.comments}</Text>
          </View>
          {this.renderStatusBtn()}
        </View>
      )
    }
  }
  renderContent() {
    const { item, status, isAllSelect } = this.props;
    const icon = status === 'draft' ? null : <Image style={styles.icon} source={item.type == 1 ? require('../images/icon_hide.png') : require('../images/icon_overt.png')} />
    if (status === 'draft') {
      return <View style={[styles.list, this.state.isDelSel || isAllSelect ? {backgroundColor: '#eee'} : '']}>
        <View style={styles.header}>
          <Text style={[styles.name, styles.flex]}>{item.email ? item.email : '无收件人'}</Text>
          <View style={styles.time}>
            <Text style={styles.timeTxt}>{item.add_time}</Text>
          </View>
        </View>
        <Text style={[styles.name]}>{item.title ? item.title : '无主题'}</Text>
        <Text style={styles.sendTime}>{item.send_time ? `预定发送：${item.send_time}` : '无发信时间'}</Text>
      </View>
    } else {
      return <View style={[styles.list, this.state.isDelSel || isAllSelect ? {backgroundColor: '#eee'} : '']}>
        <View style={styles.header}>
          {icon}
          <Text style={[styles.name, styles.flex]}>{item.email ? item.email : '无收件人'}</Text>
          <View style={styles.time}>
            <Text style={styles.timeTxt}>{item.add_time}</Text>
          </View>
        </View>
        <Text style={[styles.name, styles.content]}>{item.title ? item.title : '无主题'}</Text>
        <Text style={[styles.sendTime, styles.content]}>{item.send_time ? `预定发送：${item.send_time}` : '无预定发送时间'}</Text>
      </View>
    }
  }
  render() {
    const { item, status, isAllSelect, isDelClick, totalScore, cancelScore } = this.props;
    let leftBtxTxt = ''
    if (status === 'draft') {
      leftBtxTxt = '取消'
    } else if (status === 'reservation' && totalScore >= cancelScore) {
      leftBtxTxt = '取消发送'
    } else {
      leftBtxTxt = '查看积分规则'
    }
    return (
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.handleNav}>
            {this.renderContent()}
          </TouchableWithoutFeedback>
          { this.renderStatus(item.id) }
          <Confirm
            tit={status === 'reservation' ? '确定取消发送邮件？' : '删除草稿'}
            leftBtnTxt={leftBtxTxt}
            rightBtnTxt={status === 'reservation' ? '再想想' : '确定删除'}
            autoView={
              status === 'reservation' ? (
                <View style={styles.cont}>
                  <Text style={styles.contTxt}>取消发送将从您的积分账户中扣除{cancelScore}积分</Text>
                  <Text style={styles.contTip}>{totalScore >= cancelScore ? `当前积分：${totalScore}` : `当前积分：${totalScore}（不足）`}</Text>
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
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
  },
  list: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#efefef',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  flex:  {
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 15,
    resizeMode: 'cover',
  },
  content: {
    paddingLeft: 35,
  },
  name: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  sendTime: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    marginTop: 5,
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
    height: 53,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'cover',
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
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightTxt: {
    color: '#B4B4B4',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  btn: {
    width: 90,
    height: 32,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  cont: {
    paddingLeft: 33,
    paddingRight: 33,
    paddingTop: 13,
    paddingBottom: 30,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderTopColor: '#d8d8d8'
  },
  contTxt: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#999999',
    lineHeight: 20,
  },
  contTip: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
  }
});
