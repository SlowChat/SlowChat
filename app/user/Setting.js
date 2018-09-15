import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import Avatar from '../components/Avatar'
import Alert from '../components/Alert'
import Storage from '../utils/storage'
import { post, get } from '../utils/request'

import { CODE_PUSH_KEY } from '../constants'
import codePush from 'react-native-code-push'
import DeviceInfo from 'react-native-device-info'
import RNEasyUpgrade from 'react-native-easy-upgrade'

import ICONS from '../utils/icon'

class Setting extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '设置',
    }
  }
  state = {
    appVersion: '1.0.0',
    switchBtn: true,
    mobile: '',
    userEmail: '',
    username: '',
    avatar: '',
    level: '',
  }

  async componentWillMount() {
    this.viewAppear = this.props.navigation.addListener(
      'willFocus', payload => {
        this.getData()
      }
    )
  }

  componentDidMount() {
    this.setState({
      appVersion: DeviceInfo.getVersion()
    })
    codePush.notifyAppReady()

    if (Platform.OS == 'ios') {
      this.easyUpgrade = new RNEasyUpgrade({
        iOSAppId: '1428357149',
        downloadTitle: '安装包下载',
        downloadDescription: '安装包正在下载中...',
        downloadApkEnd: () => {
          this.easyUpgrade.installApk();
        },
        onError: () => {
          console.log('downloadApkError');
        }
      })
    }
  }

  getData() {
    get('api/user/userInfo.html').then(res => {
      console.log(res);
      const { code, data } = res
      if (code === 1) {
        if (data.sign && data.sign.count) this.setState({ sign: data.sign })
        this.setState({
          area_code: data.area_code,
          mobile: data.mobile,
          userEmail: data.user_email,
          username: data.user_nickname,
          avatar: data.avatar,
          level: data.level,
        })
      }
    }).catch(e => {
      console.log(e)
    })
  }

  handleSwitch = (value) => {
    this.setState({
      switchBtn: value
    }, async () => {
      const state = this.state.switchBtn ? 0 : 1
      const code = Storage.getPushID()
      try {
        const res = await post('api/user_msg/setPushState.html', { code, state })
        if (res.code == 1) {
          this.refs.toast.show('设置成功')
        } else if (res.code == 10001) {
          this.props.navigation.navigate('Login')
        } else {
          this.setState({ switchBtn: !this.state.switchBtn })
          this.refs.toast.show('设置失败')
        }
      } catch (e) {
          this.setState({ switchBtn: !this.state.switchBtn })
          this.refs.toast.show('设置失败')
      }
    })
  }

  handleLogout = () => {
    this.alert.show({
      title: '提示',
      txt: '确定退出当前账户吗？',
      leftBtnTxt: '确定退出',
      rightBtnTxt: '再想想',
      onCancel: () => {
        const { email, vCode } = this.state;
        post('api/user/logout.html').then(res => {
          this.alert.hide()
          if (res.code == 1) {
            Storage.clear()
            // this.props.navigation.popToTop()
            this.props.navigation.replace('BottomTabs')
            // const backAction = NavigationActions.back({
            //   index: 0,
            //   key: 'BottomTabs',
            // })
            // this.props.navigation.dispatch(backAction)
          } else {
            this.refs.toast.show(res.msg);
          }
        }).catch(e => {
          this.alert.hide()
          this.refs.toast.show('退出失败，请稍后重试')
        })
      }
    })
  }

  // checkUpgrade = async () {
  //   let updateInfo = {
  //     latestVersion: '1.0.1',
  //     hasNewVersion: false,
  //     apkUrl: 'http://{remoteApkDownloadUrl}'
  //   };
  //   if (isAndroid) {
  //     updateInfo = await fetch('http://{remoteUrl}/updateInfo.json')
  //   } else {
  //     updateInfo = await this.easyUpgrade.checkAppVersionIOS()
  //   }
  //   const updateInfo = await this.getUpdateInfo();
  //   if (updateInfo.hasNewVersion) {
  //     this.alert.show({
  //       title: '是否升级APP',
  //       txt: '发现新版本: ' + updateInfo.latestVersion,
  //       leftBtnTxt: '稍后',
  //       rightBtnTxt: '立即更新',
  //       onOk: () => {
  //         this.alert.hide()
  //       }
  //     })
  //   }
  // }
  checkUpdate = async () => {
    if (this.easyUpgrade) {
      // IOS检查APP Store是否有新版本
      try {
        let updateInfo = await this.easyUpgrade.checkAppVersionIOS()
        if (updateInfo.hasNewVersion) {
          this.alert.show({
            title: '发现新版本: ' + updateInfo.latestVersion,
            txt: '是否更新APP',
            leftBtnTxt: '稍等询问',
            rightBtnTxt: '更新',
            onOk: () => {
              this.easyUpgrade.startAppUpdate(updateInfo.apkUrl)
            }
          })
          return
        }
      } catch (e) {

      }
    }


    try {
      const update = await codePush.checkForUpdate(CODE_PUSH_KEY)
      console.log("checkUpdate", update)
      if (!update) {
        this.alert.show({
          type: 'alert',
          title: '提示',
          txt: '已是最新版本',
        })
        return
      }
    } catch (e) {
      console.log(e)
      return
    }
    codePush.sync({
      deploymentKey: CODE_PUSH_KEY,
      updateDialog: {
        title: '更新提示',
        appendReleaseDescription: true,
        descriptionPrefix:'\n',
        optionalIgnoreButtonLabel: '稍后',
        optionalInstallButtonLabel: '立即更新',
        optionalUpdateMessage: '有新版本了，是否更新？',
        mandatoryContinueButtonLabel: '立即更新',
        mandatoryUpdateMessage: '发现新版本',
      },
      installMode: codePush.InstallMode.IMMEDIATE
    }, (status) => {
      switch (status) {
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
          console.log("DOWNLOADING_PACKAGE");
          break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
          console.log(" INSTALLING_UPDATE");
          break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
          console.log(" UPDATE_INSTALLED");
          codePush.notifyAppReady();
          break;
      }
    }, (progress) => {
      console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    })
  }
  render() {
    const { switchBtn } = this.state
    const { navigate } = this.props.navigation;
    const { params = {} } = this.props.navigation.state;
    const { username, level, avatar, mobile, userEmail, area_code } = this.state;
    return (
      <View style={styles.container}>
        <Avatar username={username} level={level} avatar={avatar} />
        <View style={styles.link}>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditMobile', { mobile, area_code })}>
            <Text style={styles.label}>绑定手机号</Text>
            <Text style={styles.text}>{mobile}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditEmail', { userEmail })}>
            <Text style={styles.label}>绑定邮箱</Text>
            <Text style={styles.text}>{userEmail}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditPassword', { mobile, area_code, userEmail })}>
            <Text style={styles.label}>修改密码</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <View style={styles.menu}>
            <Text style={styles.label}>消息提醒</Text>
            <Switch style={styles.switch} value={switchBtn} onValueChange={this.handleSwitch} />
          </View>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('About')}>
            <Text style={styles.label}>关于慢邮</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('FeedBack')}>
            <Text style={styles.label}>用户反馈</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={this.checkUpdate}>
            <Text style={styles.label}>版本检测</Text>
            <Text>{this.state.appVersion}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.exitWrap} forceInset={{top: 'never', bottom: 'always'}}>
          <TouchableOpacity style={styles.exit} activeOpacity={0.6} onPress={this.handleLogout}>
            <Text style={styles.exitTxt}>退出当前账户</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <Alert ref={ref => this.alert = ref} />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};
export default codePush(codePushOptions)(Setting);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  link: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#efefef',
  },
  menu: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 44,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderBottomColor: '#eee',
    alignItems:'center',
  },
  forward: {
    // position: 'absolute',
    // right: 8,
    width: 24,
    height: 24,
  },
  label: {
    flex: 1,
    color: '#666'
  },
  text: {
    // width: '62%',
    // textAlign: 'right',
    color: '#333'
  },
  exitWrap: {
    backgroundColor: '#fff',
  },
  exit: {
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
  },
  exitTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#EC3632'
  },
  switch: {
    position: 'absolute',
    right: 15,
  }
});
