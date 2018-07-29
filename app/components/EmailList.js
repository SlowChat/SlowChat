import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from 'react-native';

const ICONS = {
  show: require('../images/icon_overt.png'),
  noShow: require('../images/icon_hide.png'),
  eyes: require('../images/icon_eyes.png'),
  comment: require('../images/icon_comment.png'),
}

export default class EmailList extends Component {
  render() {
    return (
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
        <View style={styles.status}>
          <View style={styles.statusLeft}>
            <Image style={styles.statusIcon} source={ICONS.eyes}/>
            <Text style={styles.num}>10</Text>
            <Image style={styles.statusIcon} source={ICONS.comment}/>
            <Text style={styles.num}>10</Text>
          </View>
          <View style={styles.btn}>
            <Text style={styles.btnTxt}>取消发送</Text>
          </View>
      </View>
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
    width: '70%',
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
  btn: {
    flexDirection: 'row',
    width: '25%',
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
