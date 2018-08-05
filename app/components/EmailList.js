import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

const ICONS = {
  show: require('../images/icon_overt.png'),
  noShow: require('../images/icon_hide.png'),
  eyes: require('../images/icon_eyes.png'),
  comment: require('../images/icon_comment.png'),
  finish: require('../images/icon_finish.png')
}

export default class EmailList extends Component {

  cancel() {
    alert(44444)
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
    const { navigate } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => navigate('MailDetail', { id: 1 })}>
        <View>
          <View style={styles.list}>
            <Image style={styles.icon} source={ICONS.show} />
            <View style={styles.content}>
              <Text style={styles.name}>Abagael@qq.com</Text>
              <Text style={styles.name}>20岁，来自父亲的祝福</Text>
              <Text style={styles.sendTime}>发送时间：2020-01-01 18：00</Text>
            </View>
            <View style={styles.time}>
              <Text style={styles.timeTxt}>6-16</Text>
            </View>
          </View>
          { this.renderStatus() }
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
    borderStyle: 'solid',
    borderBottomColor: '#eee',
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
