import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Platform,
  CameraRoll,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import JShareModule from 'jshare-react-native';
import RNFS from 'react-native-fs'
// import ShareUtil from '../libs/um/ShareUtil'
import QRCode from 'react-native-qrcode'
import ViewShot from "react-native-view-shot"
import Toast from 'react-native-easy-toast'

import AvatarHeader from '../components/AvatarHeader'

const ICONS = {
  head: require('../images/head_placeholder80.png'),
  sharebg: require('../images/bg_share.png'),
  wechat: require('../images/icon_wechat.png'),
  weibo: require('../images/icon_weibo.png'),
  save: require('../images/icon_save.png'),
  more: require('../images/icon_more.png'),
}

type Props = {};
export default class HeaderTip extends PureComponent<Props> {
  state = {
    qrcodeUrl: 'https://www.baidu.com',
    moreModal: false,
  }

  // 微信
  handleWechat = () => {
    JShareModule.isWeChatInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share('wechat_session')
      } else {
        this.refs.toast.show('您尚未按照微信客户端')
      }
    })
  }
  // 朋友圈
  handleWechatTimeLine = () => {
    JShareModule.isWeChatInstalled((isInstalled) => {
      if (isInstalled === true) {
        share('wechat_timeline')
      } else {
        this.refs.toast.show('您尚未按照微信客户端')
      }
    })
  }
  // 微博
  handleWeibo = () => {
    this.share('sina_weibo')
  }
  // QQ
  handleQQ = () => {
    this.share('qq')
  }
  // QQ空间
  handleQZone = () => {
    this.share('qzone')
  }

  async share(platform) {
    let uri = this.uri
    if (!uri) {
      uri = await this.refs.viewShot.capture()
      this.uri = uri
    }
    const message = {
      type: 'image',
      platform,
      imagePath: this.uri,
      imageArray: [this.uri]
    }
    JShareModule.share(message, (map) => {
      console.log("share succeed, map: " + map);
    }, (map) => {
      console.log("share failed, map: " + map);
      this.refs.toast.show('分享失败')
    })
  }

  handleSave = async () => {
    try {
      let uri = this.uri
      if (!uri) {
        uri = await this.refs.viewShot.capture()
        this.uri = uri
      }
      if (Platform.OS === 'ios') {
        await CameraRoll.saveToCameraRoll(uri)
        this.refs.toast.show('图片已保存到相册')
      } else {
        const storeLocation = `${RNFS.DocumentDirectoryPath}`;
        let pathName = new Date().getTime() + ".png"
        let downloadDest = `${storeLocation}/${pathName}`;
        const res = await RNFS.downloadFile({fromUrl: uri, toFile: downloadDest}).promise
        if (res && res.statusCode === 200) {
          await CameraRoll.saveToCameraRoll(`file://${downloadDest}`)
          this.refs.toast.show('图片已保存到相册')
        }
      }
    } catch (e) {
      this.refs.toast.show('图片已保存失败')
    }
  }

  render() {
    // <Image style={styles.qrcode} source={{uri: QRCode_IMG}} />
    // <QRCode size="160" bgColor="#FFFFFF" />
    return (
      <View style={styles.container}>
        <ViewShot ref="viewShot">
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
              <View style={styles.qrcode}>
                <QRCode value={this.state.qrcodeUrl} size={160} fgColor="#000000" bgColor="#FFFFFF" />
              </View>
            </View>
          </ImageBackground>
          <Text style={styles.shareTxt}>分享二维码，邀请好友加入慢邮吧</Text>
        </ViewShot>
        <View style={styles.icons}>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={this.handleWechat}>
            <Image style={styles.icon} source={ICONS.wechat}></Image>
            <Text style={styles.iconTxt}>微信</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={this.handleWeibo}>
            <Image style={styles.icon} source={ICONS.weibo}></Image>
            <Text style={styles.iconTxt}>微博</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={this.handleSave}>
            <Image style={styles.icon} source={ICONS.save}></Image>
            <Text style={styles.iconTxt}>保存</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={() => this.setState({moreModal: true})}>
            <Image style={styles.icon} source={ICONS.more}></Image>
            <Text style={styles.iconTxt}>更多</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={this.state.moreModal} transparent={true}
          animationType="fade" onRequestClose={() => this.setState({moreModal: false})}>
          <View style={styles.moreModalWrap}>
            <View style={styles.moreModal}>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={this.handleWechatTimeLine}>
                <Text style={styles.moreTxt}>微信朋友圈</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={this.handleQQ}>
                <Text style={styles.moreTxt}>QQ</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={this.handleQZone}>
                <Text style={styles.moreTxt}>QQ空间</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.cancelBtn} onPress={() => this.setState({moreModal: false})}>
                <Text style={styles.cancelTxt}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Toast ref="toast" position="center" />
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
    padding: 2,
    backgroundColor: '#FFFFFF',
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
  },
  moreModalWrap: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  moreModal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  }
});
