import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  AppState,
  Platform,
  CameraRoll,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'
import JShareModule from 'jshare-react-native'
import QRCode from 'react-native-qrcode'
import { captureRef } from "react-native-view-shot"
import Toast from 'react-native-easy-toast'

import ICONS from '../utils/icon'
import Storage from '../utils/storage'
import { post } from '../utils/request'
import { checkSavePermission } from '../utils/permission'
import AvatarHeader from '../components/AvatarHeader'
import AwardTip from '../components/AwardTip'
import Loading from '../components/Loading'
import ImageBg from '../components/ImageBg'

// const SHARE_URL = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1750833952,2529388352&fm=58&bpow=380&bpoh=380'
// ICONS.bg = require('../images/bg_share.png')
const { width: winWidth } = Dimensions.get('window');
type Props = {};
export default class Share extends PureComponent<Props> {
  state = {
    imageUrl: '',
    imageHeight: 406,
    imageWidth: winWidth,
    moreModal: false,
    userName: '',
    avatar: '',
    showLoading: false
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
    if (nextAppState!= null && nextAppState === 'active') {
      this.platform = null
      if (this.shareSucc) {
        this.awardTip.show()
      }
      this.shareSucc = false
    }
  }

  async getData() {
    try {
      const res = await post('api/common/getShareImg.html')
      if (res.code == 1) {
        let imageUrl = res.data
        // imageUrl = 'https://gw.alicdn.com/tfs/TB1DK2ZsHSYBuNjSspiXXXNzpXa-480-800.jpg'
        this.setState({ imageUrl })
        Image.getSize(imageUrl, (width, height) => {
          this.setState({
            imageUrl,
            imageHeight: parseInt(winWidth / width * height)
          })
        })
      } else if (res.code == 10001) {
        this.props.navigation.replace('Login', {url: 'Share'})
      }
    } catch (e) {
      console.log(e);
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
    JShareModule.isSinaWeiBoInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share('sina_weibo')
      } else {
        this.setState({ moreModal: false })
        this.refs.toast.show('您尚未安装微博客户端')
      }
    })
  }

  handleTwitter = () => {
    JShareModule.isTwitterInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share('twitter')
      } else {
        this.setState({ moreModal: false })
        this.refs.toast.show('您尚未安装Facebook客户端')
      }
    })
  }

  handleFacebook = () => {
    JShareModule.isFacebookInstalled((isInstalled) => {
      if (isInstalled === true) {
        this.share('facebook')
      } else {
        this.setState({ moreModal: false })
        this.refs.toast.show('您尚未安装Facebook客户端')
      }
    })
  }

  async capture() {
    if (this.uri) return
    try {
      this.setState({ showLoading: true })
      let uri = await captureRef(this.viewShot, {
        // width: this.width * 4,
        // height: this.height * 4,
        format: 'jpg',
        quality: 0.8,
      })
      uri = uri.replace('file://', '')
      this.uri = uri
      // this.setState({ showLoading: false })
    } catch (e) {
      this.refs.toast.show('分享图片获取失败')
      this.setState({ showLoading: false })
    }
  }

  async share(platform) {
    if (!this.imageLoaded) {
      this.setState({ moreModal: false }, () => {
        this.refs.toast.show('分享图片尚未加载完成');
      })
      return
    }
    if (this.state.showLoading) return
    await this.capture()
    if (!this.uri) return
    try {
      if (this.platform != platform) {
        await post('api/user/addShareScore.html')
        this.shareSucc = true
      }
      this.platform = platform
    } catch (e) {
    }
    const message = {
      type: 'image',
      platform,
      imagePath: this.uri,
      imageArray: [this.uri]
    }
    this.setState({ moreModal: false, showLoading: false }, () => {
      JShareModule.share(message, ({ state }) => {
        // if (state == 'success') {
        // } else if (state == 'fail') {
        //   // this.refs.toast.show('分享失败')
        // }
        this.platform = null
        console.log("share succeed, map: ", state);
      }, (map) => {
        this.platform = null
        if (map.description) {
          this.refs.toast.show(map.description)
        }
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
      await this.capture()
      this.setState({ showLoading: false })
      if (!this.uri) return
      try {
        await CameraRoll.saveToCameraRoll(this.uri, 'photo')
        this.refs.toast.show('图片已保存到相册')
      } catch (e) {
        this.refs.toast.show('图片已保存失败')
      }
    } catch (e) {
      this.refs.toast.show('截图失败')
    }
  }

  handleShotLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.width = width
    this.height = height
  }

  imageLoadEnd = () => {
    this.imageLoaded = true
  }

  render() {
    // <Image style={styles.qrcode} source={{uri: QRCode_IMG}} />
    // <QRCode size="160" bgColor="#FFFFFF" />
    const { userName, avatar, imageUrl, imageWidth, imageHeight } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.scrollview}>
          <ScrollView style={{ display: userName ? 'flex' : 'none' }}>
            <View style={styles.shot} ref={ref => this.viewShot = ref} onLayout={this.handleShotLayout}>
              <Image source={require('../images/sharebar1.png')} style={styles.sharebar1} />
              <View style={styles.avatarWrap}>
                <ImageBg style={styles.avatar} src={avatar} />
                <View style={styles.avatarRight}>
                  <View style={styles.nameWrap}>
                    <Text numberOfLines={1} style={styles.name}>{userName}</Text>
                    <Text style={styles.desc}>邀请你来慢邮~</Text>
                  </View>
                  <Text style={styles.title}>让我们回到未来回忆现在</Text>
                </View>
              </View>
              {
                imageUrl ? <Image source={{uri: imageUrl }} style={{width: imageWidth, height: imageHeight}} onLoadEnd={this.imageLoadEnd} />
                 : null
              }
            </View>
          </ScrollView>
        </View>
        <View style={styles.sharebar2Wrap}>
          <Image resizeMode="stretch" source={require('../images/sharebar2.png')} style={styles.sharebar2} />
        </View>
        <Text style={styles.shareTxt}>分享APP，邀请好友加入慢邮吧</Text>
        <SafeAreaView style={styles.icons} forceInset={{top: 'never', bottom: 'always'}}>
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
        </SafeAreaView>
        <Modal visible={this.state.moreModal} transparent={true}
          animationType="fade" onRequestClose={() => this.setState({moreModal: false})}>
          <View style={styles.moreModalWrap}>
            <View style={styles.moreModal}>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={this.handleWeibo}>
                <Text style={styles.moreTxt}>微博</Text>
              </TouchableOpacity>
              {
                Platform.OS == 'ios' ? <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleQQ('qq')}>
                  <Text style={styles.moreTxt}>QQ</Text>
                </TouchableOpacity> : null
              }
              {
                Platform.OS == 'ios' ? <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleQQ('qzone')}>
                  <Text style={styles.moreTxt}>QQ空间</Text>
                </TouchableOpacity> : null
              }
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
        {this.state.showLoading && <Loading />}
        <AwardTip ref={(ref) => this.awardTip = ref} num="30" txt="分享成功" />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

// <QRCode value={this.state.imageUrl} size={160} fgColor="#000000" bgColor="#FFFFFF" />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  shot: {
    backgroundColor: '#FFFFFF',
  },
  // wrap: {
  //   marginTop: 50,
  //   // marginLeft: 30,
  //   // marginRight: 30,
  //   padding: 5,
  //   width: 315,
  //   height: 300,
  // },
  sharebar1: {
    height: 5,
  },
  scrollview: {
    maxHeight: 481,
    flex: 1,
  },
  sharebar2: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 39,
    bottom: 0,
  },
  sharebar2Wrap: {
    position: 'relative',
  },
  // qrcode: {
  //   padding: 2,
  //   backgroundColor: '#FFFFFF',
  // },
  shareTxt: {
    // marginTop: 41,
    marginBottom: 10,
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
    marginBottom: 20,
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
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    marginLeft: 60,
    marginRight: 60,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
