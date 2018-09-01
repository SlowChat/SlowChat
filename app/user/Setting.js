import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Switch,
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

  getData() {
    get('api/user/userInfo.html').then(res => {
      console.log(res);
      const { code, data } = res
      if (code === 1) {
        if (data.sign && data.sign.count) this.setState({ sign: data.sign })
        this.setState({
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

  componentDidMount() {
    this.setState({
      appVersion: DeviceInfo.getVersion()
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
  checkUpdate = async () => {
    const update = await codePush.checkForUpdate(CODE_PUSH_KEY)
    if (!update) {
      this.alert.show({
        type: 'alert',
        title: '提示',
        txt: '已是最新版本',
      })
      return
    }
    codePush.sync({
      deploymentKey: CODE_PUSH_KEY,
      updateDialog: {
        appendReleaseDescription: true,
        descriptionPrefix:'\n',
        optionalIgnoreButtonLabel: '稍后',
        optionalInstallButtonLabel: '立即更新',
        optionalUpdateMessage: '有新版本了，是否更新？',
        title: '更新提示'
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
        case CodePush.SyncStatus.UPDATE_INSTALLED:
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
    const { username, level, avatar, mobile, userEmail } = this.state;
    return (
      <View style={styles.container}>
        <Avatar username={username} level={level} avatar={avatar} />
        <View style={styles.link}>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditMobile', { mobile: mobile })}>
            <Text style={styles.label}>绑定手机号</Text>
            <Text style={styles.text}>{mobile}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditEmail', { userEmail: userEmail })}>
            <Text style={styles.label}>绑定邮箱</Text>
            <Text style={styles.text}>{userEmail}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.menu} onPress={() => navigate('EditPassword', { mobile: mobile, userEmail: userEmail })}>
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
