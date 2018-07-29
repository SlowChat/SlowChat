import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

// import QRCode from 'react-native-qrcode'

import AvatarHeader from '../components/AvatarHeader'

const ICONS = {
  head: require('../images/head_placeholder80.png'),
  sharebg: require('../images/bg_share.png'),
  wechat: require('../images/icon_wechat.png'),
  weibo: require('../images/icon_weibo.png'),
  save: require('../images/icon_save.png'),
  more: require('../images/icon_more.png'),
}

const QRCode_IMG = 'https://mmbiz.qpic.cn/mmbiz_jpg/oTQcjB03Y8yLqw2nfh6ibN7qJP69P4kJ5WypFmReMCEjCAYMpaiasEkQlHpx95W8Cw0BPBEEbiaB97xeYDdibjSviaw/640?wx_fmt=jpeg'

type Props = {};
export default class HeaderTip extends PureComponent<Props> {

  handleWechat = () => {

  }

  handleWeibo = () => {

  }

  handleSave = () => {

  }

  handleMore = () => {

  }

  render() {
    // <QRCode size="160" bgColor="#FFFFFF" />
    return (
      <View style={styles.container}>
        <ImageBackground source={ICONS.sharebg} style={styles.wrap}>
          <View style={styles.avatarWrap}>
            <Image style={styles.avatar} source={ICONS.head} />
            <View style={styles.avatarRight}>
              <View style={styles.nameWrap}>
                <Text style={styles.name}>给未来的自</Text>
                <Text style={styles.desc}>邀请你来慢邮~</Text>
              </View>
              <Text style={styles.title}>发信时间：2019年1月10日</Text>
            </View>
          </View>
          <View style={styles.qrcodeWrap}>
            <Image style={styles.qrcode} source={{uri: QRCode_IMG}} />
          </View>
        </ImageBackground>
        <Text style={styles.shareTxt}>分享二维码，邀请好友加入慢邮吧</Text>
        <View style={styles.icons}>
          <TouchableOpacity onPress={this.handleWechat}>
            <View style={styles.iconWrap}>
              <Image style={styles.icon} source={ICONS.wechat}></Image>
              <Text style={styles.iconTxt}>微信</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleWeibo}>
            <View style={styles.iconWrap}>
              <Image style={styles.icon} source={ICONS.weibo}></Image>
              <Text style={styles.iconTxt}>微博</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleSave}>
            <View style={styles.iconWrap}>
              <Image style={styles.icon} source={ICONS.save}></Image>
              <Text style={styles.iconTxt}>保存</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.iconWrap} onPress={this.handleMore}>
              <Image style={styles.icon} source={ICONS.more}></Image>
              <Text style={styles.iconTxt}>更多</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily: 'PingFangSC-Regular',
  },
  wrap: {
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    padding: 5,
  },
  qrcodeWrap: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrcode: {
    width: 160,
    height: 160,
  },
  shareTxt: {
    marginTop: 41,
    marginBottom: 25,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    height: 20,
    lineHeight: 20,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconWrap: {
    marginLeft: 15,
    marginRight: 15,
  },
  icon: {
    width: 50,
    height: 50,

  },
  iconTxt: {
    height: 17,
    fontSize: 12,
    color: '#E24B92',
    lineHeight: 17,
    textAlign: 'center',
  },
  avatarWrap: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 11,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 25,
    marginRight: 15,
  },
  avatarRight: {
    flex: 1,
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  name: {
    height: 25,
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#E24B92',
    lineHeight: 25,
  },
  desc: {
    fontSize: 14,
    color: '#666666',
  },
  title: {
    height: 17,
    fontSize: 12,
    color: '#999999',
    lineHeight: 17
  }
});
