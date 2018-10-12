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
import ImageBg from './ImageBg'
// import { isImage } from '../utils/util'
// const ICONS = {
//   head: require('../images/head_placeholder80.png'),
//   eye: require('../images/icon_eyes.png'),
//   comment: require('../images/icon_comment.png'),
// }

type Props = {};
export default class HomeItem extends PureComponent<Props> {
  state = {
    oneWidth: 0,
    oneHeight: 0,
    oneBottom: 0,
  }
  componentWillMount() {
    let { attach } = this.props.data.item || {}
    if (!attach) attach = []
    this.images = attach.filter(item => item.ext == 'image').slice(0, 9)
      .map((item, index) => ({index: index, url: item.thumb || item.url, origin: item.url }))
    if (this.images.length == 1) {
      Image.getSize(this.images[0].url, (width,height) => {
        if (width == 0 || height == 0) return
        if (width > 400 || height > 400) {
          const size = Math.max(width, height)
          this.setState({
            oneWidth: 400 * width / size,
            oneHeight: 400 * height / size,
            oneBottom: 6,
          })
        } else {
          this.setState({
            oneWidth: width,
            oneHeight: height,
            oneBottom: 6,
          })
        }
      })
    }
  }
  handlePress = () => {
    const { onPress, data } = this.props
    onPress && onPress(data.item.id)
  }
  formatImages(images) {
    const newImages = []
    let factor = images.length == 2 && images.length == 4 ? 2 : 3
    const num = images.length / factor
    let len = Math.floor(num)
    for (let i = 0; i < len; i++) {
      newImages.push({ index: i, items: images.slice(i * factor, (i + 1) * factor)})
    }
    if (len != num) {
      newImages.push({ index: len, items: images.slice((len) * factor) })
    }
    return {
      factor,
      newImages,
    }
  }
  handleImgPress = (index = 0) => {
    const images = this.images.map((item, index) => ({index: index, url: item.origin, thumb: item.url}))
    if (!images || images.length == 0) return null
    const { onImgPress } = this.props
    onImgPress && onImgPress(index, images)
  }
  renderImages() {
    const { images } = this
    if (!images || images.length == 0) return null
    if (images.length == 1) {
      const { oneWidth, oneHeight, oneBottom } = this.state
      return <TouchableOpacity activeOpacity={0.8} onPress={this.handleImgPress.bind(this, 0)}>
        <Image source={{uri: images[0].url}} style={[styles.oneImage, {width: oneWidth, height: oneHeight, marginBottom: oneBottom,}]} />
      </TouchableOpacity>
    }
    const { factor, newImages } = this.formatImages(images)
    return newImages.map((image, index) => {
      return <View key={image.index} style={styles.images}>
        {image.items.map(item => {
          return <TouchableOpacity activeOpacity={0.8} key={item.index} onPress={this.handleImgPress.bind(this, item.index)}>
            <Image style={styles.image} source={{uri: item.url}} />
          </TouchableOpacity>
        })}
      </View>
    })
  }
  render() {
    const { item } = this.props.data
    let { avatar } = (item || {}).user || {}
    const hasComment = item.comment && item.comment.length > 0
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={this.handlePress}>
        <View style={styles.avatarWrap}>
          <ImageBg src={avatar} />
          <View style={styles.avatarRight}>
            <View style={styles.nameWrap}>
              <Text style={styles.name}>{item.user.user_nickname}</Text>
              <Text style={styles.time}>{item.add_time}</Text>
            </View>
            <Text style={styles.date}>预定发送：{item.send_time}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.titleTxt}>{item.title}</Text>
          </View>

          <View style={styles.content}>
            <Text numberOfLines={3} ellipsizeMode="tail" style={styles.contentTxt}>{item.content}</Text>
          </View>
          {this.renderImages()}
          <View style={styles.attention}>
            <Image style={styles.eyeIcon} source={ICONS.eye} />
            <Text style={[styles.num, styles.eyeNum]}>{item.looks}</Text>
            <Image style={styles.commentIcon} source={ICONS.comment} />
            <Text style={styles.num}>{item.comments}</Text>
          </View>
          {
            hasComment && <View style={styles.comments}>
              <View style={styles.triangle} />
              {
                item.comment && item.comment.map(item => (<View key={item.id}>
                  <Text numberOfLines={1} style={styles.comment}>{item.user.user_nickname}：{item.content}</Text>
                </View>))
              }
            </View>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 0,
    // marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  avatarWrap: {
    flexDirection: 'row',
    paddingBottom: 10,
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
    fontFamily: 'PingFangSC-Regular',
    height: 17,
    fontSize: 12,
    color: '#B4B4B4',
    lineHeight: 17
  },
  body: {
    marginLeft: 50,
  },
  title: {
    // marginBottom: 5,
  },
  titleTxt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    lineHeight: 21,
    color: '#333333',
  },
  content: {
    paddingBottom: 10,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#EEEEEE',
    // borderStyle: 'solid',
  },
  contentTxt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  attention: {
    flexDirection: 'row',
    // marginTop: 10,
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
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#B4B4B4',
  },
  comments: {
    position: 'relative',
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F6F6F6',
    marginBottom: 10,
  },
  triangle: {
    position: 'absolute',
    top: -6,
    left: 48,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F6F6F6',
  },
  comment: {
    fontFamily: 'PingFangSC-Regular',
    height: 20,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },
  oneImage: {
    backgroundColor: '#D8D8D8',
  },
  images: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 6,
    backgroundColor: '#D8D8D8',
  },

});
