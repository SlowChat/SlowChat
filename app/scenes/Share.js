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
  PermissionsAndroid
} from 'react-native';

// import ShareUtil from '../libs/um/ShareUtil'
import QRCode from 'react-native-qrcode'
import ViewShot from "react-native-view-shot"
import Toast from 'react-native-easy-toast'

import ICONS from '../utils/icon'
import Storage from '../utils/storage'
import AvatarHeader from '../components/AvatarHeader'
import AwardTip from '../components/AwardTip'

ICONS.bg = require('../images/bg_share.png')

type Props = {};
export default class Share extends PureComponent<Props> {
  state = {
    qrcodeUrl: 'https://www.baidu.com',
    moreModal: false,
    userName: ''
  }
  async componentWillMount() {
    const user = await Storage.getUser()
    console.log(user);
    this.setState({
      userName: user.user_nickname
    })
  }
  handleWechat = () => {
    // ShareUtil.auth(5, (code,result,message) =>{
    //   console.log(code,result,message)
    // });
  }

  handleWeibo = () => {
  //   ShareUtil.shareboard('qwqw','', 'https://www.baidu.com','测试',[0,1,2,3,4,5,6,33],(code,message) =>{
  //  });
  }

  handleShare() {
    this.refs.awardTip.show()
  }

  handleSave = async () => {
    let cannotSave = false
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '相册权限申请',
            message: '慢聊保存截图，需要访问你的相册'
          },
        );
        if (granted != PermissionsAndroid.RESULTS.GRANTED) {
          cannotSave = true
          this.refs.toast.show('授权拒绝，无法保存截图')
        }
      } catch (err) {
        cannotSave = true
        this.refs.toast.show('授权失败，无法保存截图')
      }
    }
    if (cannotSave) return
    try {
      let uri = this.uri
      if (!uri) {
        uri = await this.refs.viewShot.capture()
        this.uri = uri
      }
      try {
        await CameraRoll.saveToCameraRoll(uri)
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
    return (
      <View style={styles.container}>
        <ViewShot ref="viewShot">
          <View style={styles.shot}>
            <ImageBackground source={ICONS.bg} style={styles.wrap}>
              <View style={styles.avatarWrap}>
                <Image style={styles.avatar} source={ICONS.head} />
                <View style={styles.avatarRight}>
                  <View style={styles.nameWrap}>
                    <Text style={styles.name}>{this.state.userName}</Text>
                    <Text style={styles.desc}>邀请你来慢邮~</Text>
                  </View>
                  <Text style={styles.title}>让我们 回到未来 回忆现在</Text>
                </View>
              </View>
              <View style={styles.qrcodeWrap}>
                <View style={styles.qrcode}>
                  <QRCode value={this.state.qrcodeUrl} size={160} fgColor="#000000" bgColor="#FFFFFF" />
                </View>
              </View>
            </ImageBackground>
            <Text style={styles.shareTxt}>分享二维码，邀请好友加入慢邮吧</Text>
          </View>
        </ViewShot>
        <View style={styles.icons}>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={this.handleWechat}>
            <Image style={styles.icon} source={require('../images/icon_wechat.png')}></Image>
            <Text style={styles.iconTxt}>微信</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconWrap} onPress={this.handleWeibo}>
            <Image style={styles.icon} source={require('../images/icon_weibo.png')}></Image>
            <Text style={styles.iconTxt}>微博</Text>
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
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleShare(0)}>
                <Text style={styles.moreTxt}>微信朋友圈</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleShare(1)}>
                <Text style={styles.moreTxt}>QQ</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleShare(1)}>
                <Text style={styles.moreTxt}>QQ空间</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleShare(1)}>
                <Text style={styles.moreTxt}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.handleShare(1)}>
                <Text style={styles.moreTxt}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn} onPress={() => this.setState({moreModal: false})}>
                <Text style={styles.cancelTxt}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <AwardTip ref="awardTip" num="30" txt="分享成功" />
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
