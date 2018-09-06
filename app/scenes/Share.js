import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  AppState,
  Platform,
  CameraRoll,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import JShareModule from 'jshare-react-native'
import QRCode from 'react-native-qrcode'
import ViewShot from "react-native-view-shot"
import Toast from 'react-native-easy-toast'

import ICONS from '../utils/icon'
import Storage from '../utils/storage'
import { post } from '../utils/request'
import { checkSavePermission } from '../utils/permission'
import AvatarHeader from '../components/AvatarHeader'
import AwardTip from '../components/AwardTip'

const SHARE_URL = 'https://www.baidu.com'
// ICONS.bg = require('../images/bg_share.png')

type Props = {};
export default class Share extends PureComponent<Props> {
  state = {
    shareUrl: SHARE_URL,
    moreModal: false,
    userName: ''
  }
  async componentWillMount() {
    try {
      const user = await Storage.getUser()
      this.setState({
        userName: user.user_nickname,
        avatar: user.avatar
      })
      this.getData()
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidMount() {
    if (Platform.OS == 'ios') {
      JShareModule.setup()
    }

    AppState.addEventListener('change', this.handleAppStateChange)
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    console.log("===handleAppStateChange===", nextAppState)
    if (nextAppState!= null && nextAppState === 'active') {
      if (this.shareSucc) {
        this.awardTip.show()
      }
      this.shareSucc = false
    }
  }

  async getData() {
    let shareUrl = ''
    try {
      const res = await post('api/user/getShareUrl.html')
      console.log(res);
      if (res.code == 1) {
        shareUrl = res.data
        this.setState({ shareUrl: shareUrl || SHARE_URL })
      } else if (res.code == 10001) {
        this.props.navigation.replace('Login', {url: 'Share'})
      }
    } catch (e) {
    }
  }

  handleWechat = (platform) => {
    JShareModule.isWeChatInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share(platform)
      } else {
        this.refs.toast.show('您尚未安装微信客户端')
      }
    })
  }

  handleQQ = (platform) => {
    JShareModule.isQQInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share(platform)
      } else {
        this.refs.toast.show('您尚未安装QQ客户端')
      }
    })
  }

  handleWeibo = () => {
    this.share('sina_weibo')
  }

  handleTwitter = () => {
    JShareModule.isTwitterInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share('twitter')
      } else {
        this.refs.toast.show('您尚未安装Facebook客户端')
      }
    })
  }

  handleFacebook = () => {
    JShareModule.isFacebookInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share('facebook')
      } else {
        this.refs.toast.show('您尚未安装Facebook客户端')
      }
    })
  }

  async share(platform) {
    let uri = this.uri
    if (!uri) {
      uri = await this.viewShot.capture()
      uri = uri.replace('file://', '')
      this.uri = uri
    }
    try {
      await post('api/user/addShareScore.html')
      this.shareSucc = true
    } catch (e) {
    }
    const message = {
      type: 'image',
      platform,
      imagePath: this.uri,
      imageArray: [this.uri]
    }
    this.setState({ moreModal: false }, () => {
      JShareModule.share(message, ({ state }) => {
        // if (state == 'success') {
        // } else if (state == 'fail') {
        //   // this.refs.toast.show('分享失败')
        // }
        console.log("share succeed, map: ", state);
      }, (map) => {
        console.log("share failed, map: ", map);
        // this.refs.toast.show('分享失败')
      })
    })
  }

  handleSave = async () => {
    try {
      await checkSavePermission()
    } catch (e) {
      this.refs.toast.show(e.message)
      return
    }
    try {
      let uri = this.uri
      if (!uri) {
        uri = await this.viewShot.capture()
        this.uri = uri
      }
      try {
        await CameraRoll.saveToCameraRoll(uri, 'photo')
        this.refs.toast.show('图片已保存到相册')
      } catch (e) {
        this.refs.toast.show('图片已保存失败')
      }
    } catch (e) {
      this.refs.toast.show('截图失败')
    }
  }

  render() {
    // <Image style={styles.qrcode} source={{uri: QRCode_IMG}} />
    // <QRCode size="160" bgColor="#FFFFFF" />
    const { userName, avatar } = this.state
    const source = avatar ? { uri: avatar } : ICONS.head
    return (
      <View style={styles.container}>
        <ViewShot ref={ref => this.viewShot = ref}>
          <View style={styles.shot}>
            <ImageBackground source={require('../images/bg_share.png')} style={styles.wrap}>
              <View style={styles.avatarWrap}>
                <Image style={styles.avatar} source={source} />
                <View style={styles.avatarRight}>
                  <View style={styles.nameWrap}>
                    <Text numberOfLines={1} style={styles.name}>{userName}</Text>
                    <Text style={styles.desc}>邀请你来慢邮~</Text>
                  </View>
                  <Text style={styles.title}>让我们 回到未来 回忆现在</Text>
                </View>
              </View>
              <View style={styles.qrcodeWrap}>
                  <View style={styles.qrcode}>
                    <QRCode value={this.state.shareUrl} size={160} fgColor="#000000" bgColor="#FFFFFF" />
                  </View>
                </View>
            </ImageBackground>
            <Text style={styles.shareTxt}>分享二维码，邀请好友加入慢邮吧</Text>
          </View>
        </ViewShot>
        <View style={styles.icons}>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={() => this.handleWechat('wechat_session')}>
            <Image style={styles.icon} source={require('../images/icon_wechat.png')}></Image>
            <Text style={styles.iconTxt}>微信</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={() => this.handleWechat('wechat_timeLine')}>
            <Image style={styles.icon} source={require('../images/friends.png')}></Image>
            <Text style={styles.iconTxt}>朋友圈</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={this.handleSave}>
            <Image style={styles.icon} source={require('../images/icon_save.png')}></Image>
            <Text style={styles.iconTxt}>保存</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={() => this.setState({moreModal: true})}>
            <Image style={styles.icon} source={require('../images/icon_more.png')}></Image>
            <Text style={styles.iconTxt}>更多</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={this.state.moreModal} transparent={true}
          animationType="fade" onRequestClose={() => this.setState({moreModal: false})}>
          <View style={styles.moreModalWrap}>
            <View style={styles.moreModal}>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={this.handleWeibo}>
                <Text style={styles.moreTxt}>微博</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleQQ('qq')}>
                <Text style={styles.moreTxt}>QQ</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleQQ('qzone')}>
                <Text style={styles.moreTxt}>QQ空间</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={this.handleTwitter}>
                <Text style={styles.moreTxt}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={this.handleFacebook}>
                <Text style={styles.moreTxt}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.setState({moreModal: false})}>
                <Text style={styles.cancelTxt}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <AwardTip ref={(ref) => this.awardTip = ref} num="30" txt="分享成功" />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  shot: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  wrap: {
    marginTop: 50,
    // marginLeft: 30,
    // marginRight: 30,
    padding: 5,
    width: 315,
    height: 300,
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
    fontFamily: 'PingFangSC-Regular',
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
    fontFamily: 'PingFangSC-Regular',
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
    borderRadius: 20,
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
    maxWidth: 110,
    height: 25,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#E24B92',
    lineHeight: 25,
  },
  desc: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666',
  },
  title: {
    height: 17,
    fontFamily: 'PingFangSC-Regular',
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
    width: 262,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtn: {
    width: 262,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreTxt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#ED0B83',
  },
  cancelTxt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#999999',
  },
});
