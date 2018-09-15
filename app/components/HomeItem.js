import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import ICONS from '../utils/icon'
// import { isImage } from '../utils/util'
// const ICONS = {
//   head: require('../images/head_placeholder80.png'),
//   eye: require('../images/icon_eyes.png'),
//   comment: require('../images/icon_comment.png'),
// }

type Props = {};
export default class HomeItem extends PureComponent<Props> {
  handlePress = () => {
    const { onPress, data } = this.props
    onPress && onPress(data.item.id)
  }
  handleError = (e) => {
    this.imageRef.source = ICONS.head
    // e.target.source = ICONS.head
  }
  render() {
    const { item } = this.props.data
    let { avatar } = (item || {}).user || {}
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={this.handlePress}>
        <View style={styles.avatarWrap}>
          <ImageBackground style={styles.avatar} source={ICONS.head}>
            <Image style={styles.avatar} source={{uri: avatar}} defaultSource={ICONS.head} />
          </ImageBackground>
          <View style={styles.avatarRight}>
            <View style={styles.nameWrap}>
              <Text style={styles.name}>{item.user.user_nickname}</Text>
              <Text style={styles.time}>{item.add_time}</Text>
            </View>
            <Text style={styles.date}>预定发送：{item.send_time}</Text>
          </View>
        </View>
        <View style={styles.title}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleTxt}>{item.title}</Text>
        </View>
        
        <View style={styles.content}>
          <Text numberOfLines={3} ellipsizeMode="tail" style={styles.contentTxt}>{item.content}</Text>
        </View>
        
        <View style={styles.attention}>
          <Image style={styles.eyeIcon} source={ICONS.eye} />
          <Text style={[styles.num, styles.eyeNum]}>{item.looks}</Text>
          <Image style={styles.commentIcon} source={ICONS.comment} />
          <Text style={styles.num}>{item.comments}</Text>
        </View>
        <View style={styles.comments}>
          {
            item.comment && item.comment.map(item => (<View key={item.id}>
              <Text numberOfLines={1} style={styles.comment}>{item.user.user_nickname}：{item.content}</Text>
            </View>))
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 6,
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  avatarWrap: {
    flexDirection: 'row',
    paddingBottom: 15,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#EEEEEE',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  avatarRight: {
    flex: 1,
  },
  title: {
    marginTop: 10,
    marginBottom: 5,
  },
  titleTxt: {
    height: 20,
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#999999',
    lineHeight: 20,
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
  titleTxt: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 21,
  },
  content: {
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid',
  },
  contentTxt: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 21,
  },
  attention: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 7,
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
  comments: {
  },
  comment: {
    height: 20,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },

});
