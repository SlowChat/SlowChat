import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  PixelRatio
} from 'react-native';
// import Swiper from 'react-native-swiper2';

const onePx = 1 / PixelRatio.get()

const ICONS = {
  head: require('../images/head_placeholder80.png'),
  eye: require('../images/icon_eyes.png'),
  comment: require('../images/icon_comment.png'),
}

type Props = {};
export default class HomeItem extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.avatarWrap}>
          <Image style={styles.avatar} source={ICONS.head} />
          <View style={styles.avatarRight}>
            <View style={styles.nameWrap}>
              <Text style={styles.name}>给未来的自</Text>
              <Text style={styles.time}>12:00</Text>
            </View>
            <Text style={styles.date}>发信时间：2019年1月10日</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentTxt}>发信时间：2019年1月10日发信时间：2019年1月10日发信时间：2019年1月10日发信时间：2019年1月10日发信时间：2019年1月10日发信时间：2019年1月10日</Text>
        </View>
        <View style={styles.attention}>
          <Image style={styles.eyeIcon} source={ICONS.eye} /><Text style={[styles.num, styles.eyeNum]}>10</Text>
          <Image style={styles.commentIcon} source={ICONS.comment} />
          <Text style={styles.num}>6</Text>
        </View>
        <View><Text style={styles.comment}>Abagael：到了最后，我突然笑了</Text></View>
        <View><Text style={styles.comment}>Abagael：到了最后，我突然笑了</Text></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 10,
  },
  avatarWrap: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  avatarRight: {
    flex: 1,
  },
  nameWrap: {
    marginBottom: 2,
    flexDirection: 'row',
  },
  name: {
    flex: 1,
    height: 20,
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#E24B92',
    lineHeight: 20,
  },
  time: {
    height: 17,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#B4B4B4',
    lineHeight: 17
  },
  date: {
    height: 17,
    fontSize: 12,
    color: '#B4B4B4',
    lineHeight: 17
  },
  content: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: onePx,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid',
  },
  contentTxt: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 21,
  },
  attention: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 9,
    alignItems: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
    resizeMode: 'contain',
  },
  commentIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 2,
  },
  eyeNum: {
    marginRight: 11,
  },
  num: {
    fontSize: 12,
    color: '#B4B4B4',
  },
  comment: {
    height: 20,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },

});
