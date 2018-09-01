import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Switch,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Platform,
} from 'react-native';

// import { openFile } from '../utils/opendoc'

// import ImagePicker from 'react-native-image-picker'
import Toast from 'react-native-easy-toast'
import DatePicker from 'react-native-datepicker'
import SaveBtn from '../components/SaveBtn'
import HeaderTip from '../components/HeaderTip'
import FileChoose from '../components/FileChoose'
import SuccessModal from '../components/SuccessModal'
import ErrorModal from '../components/ErrorModal'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import ICONS from '../utils/icon'
import dateFormat from '../utils/date'
// rnfsUpload
import { get, post, upload } from '../utils/request'
import { isEmail } from '../utils/validate'

export default class NewMail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    if (!params.rightOnPress) {
      params.rightOnPress = () => {}
    }
    return {
      title: '写信',
      headerRight: (
        <TouchableOpacity activeOpacity={0.6} style={styles.headerRight} onPress={params.rightOnPress}>
          <Text style={[{color: params.enable ? '#E24B92' : '#F9DBE9'}, styles.headerRightTxt]}>发送</Text>
        </TouchableOpacity>
      ),
      // headerRight: (
      //   <Button
      //     title='发送'
      //     color={params.enable ? '#E24B92' : '#F9DBE9'}
      //     onPress={params.rightOnPress}
      //   />
      // ),
    }
  }
  email = ''
  state = {
    isSend: true,
    isSucc: false,
    showLoading: false,
    showSendMe: true,
    pickerModal: false,
    attachs: [],
    initAttaches: [],
    images: [],
    params: {
      title: '',
      content: '',
      email: '',
      send_date: dateFormat(new Date(), 'yyyy-MM-dd'),
      send_time: dateFormat(new Date(), 'hh:mm'),
      type: 2,
    },
    defaultValue: {
      title: '',
      content: '',
      email: '',
    }
  }

  componentWillMount() {
    this.getData()
    this.viewAppear = this.props.navigation.addListener(
      'willFocus', payload => {
        this.getUserInfo()
      }
    )
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardShow)
    this.keyboardHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardHide)
    this.props.navigation.setParams({
      rightOnPress: this.handleSend
    })
  }

  shouldComponentUpdate() {
    if (this.noupdate) {
      this.noupdate = false
      return false
    }
    return true
  }

  componentWillUnmount() {
    this.viewAppear.remove()
    this.keyboardWillShowSub.remove()
    this.keyboardShowSub.remove()
    this.keyboardHideSub.remove()
  }

  keyboardWillShow = (e) => {
    if (this.state.pickerModal) {
      this.setState({ pickerModal: false })
    }
  }

  keyboardShow = (e) => {
    this.keyboardShow = true
  }

  keyboardHide = (e) => {
    this.keyboardShow = false
    if (this.showChooseFile) {
      this.setState({ pickerModal: true })
      this.showChooseFile = false
    }
  }

  async getUserInfo() {
    this.user_email = ''
    try {
      const res = await get('api/user/userInfo.html')
      this.unLogin = true
      if (res.code === 1) {
        this.user_email = res.data.user_email
        if (this.state.showSendMe && this.isMyEmail()) {
          this.setState({ showSendMe: false })
        }
      } else if (res.code == 10001) {
        this.unLogin = false
      }
    } catch (e) {
      this.unLogin = true
    }
  }

  async getData() {
    if (this.loading) return
    const { id } = this.props.navigation.state.params || {}
    if (typeof id == 'undefined') return
    this.loading = true
    try {
      const res = await post('api/mail/getDraftInfo.html', { id })
      console.log(res);
      if (res.code == 1) {
        const { items } = res.data
        const [ send_date, send_time ] = items.send_time
        this.email = items.email
        this.setState({
          showSendMe: this.isMyEmail(items.email),
          params: {
            id: items.id,
            email: items.email,
            title: items.title,
            content: items.content,
            send_date,
            send_time,
            type: items.type || 2,
          },
          defaultValue: {
            email: items.email,
            title: items.title,
            content: items.content,
          },
          attachs: items.attach,
          initAttaches: items.attach,
        }, () => {
          this.setSendStatus(false)
        })
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  }

  isMyEmail(email) {
    if (!email) {
      email = Platform.OS == 'ios' ? this.email : this.state.params.email
    }
    return email && this.user_email && email == this.user_email
  }

  handleDatePicker = (date) => {
    this.setParams('send_date', date)
  }

  handleTimePicker = (time) => {
    this.setParams('send_time', time)
  }

  handleMailChange = (value) => {
    this.email = value
    let { showSendMe } = this.state
    if (this.isMyEmail(value) && showSendMe != false) {
      showSendMe = false
    } else if (!this.isMyEmail(value) && showSendMe != true) {
      showSendMe = true
    }
    if (this.state.showSendMe != showSendMe) {
      this.setState({ showSendMe })
    }
    this.setSendStatus(value)
  }
  onEndEditMail = (e) => {
    this.email = e.nativeEvent.text
  }
  sendMe = () => {
    if (this.isMyEmail(this.email)) return
    if (!this.unLogin) {
      this.props.navigation.navigate('Login')
      return
    }
    if (!this.user_email) {
      this.alert.show({
        title: '提示',
        txt: '您的邮箱尚未绑定',
        leftBtnTxt: '再想想',
        rightBtnTxt: '去绑定',
        onOk: () => {
          this.alert.hide()
          this.props.navigation.navigate('EditEmail')
        }
      })
      return
    }
    if (Platform.OS == 'ios') {
      const { params } = this.state
      params.email = this.email || ''
      this.setState({ params }, () => {
        requestAnimationFrame(() => {
          this.email = this.user_email
          this.setParams('email', this.user_email)
        })
      })
    } else {
      this.setParams('email', this.user_email)
    }
  }
  setParams(key, value) {
    let showSendMe = this.state.showSendMe
    if (key == 'email') {
      showSendMe = !this.isMyEmail(value)
    }
    const { params } = this.state
    params[key] = value
    this.setState({
      showSendMe,
      params,
    }, () => {
      this.setSendStatus()
    })
  }
  setSendStatus() {
    const sendBtnEnable = this.checkParams(false)
    if (this.sendBtnEnable != sendBtnEnable) {
      this.noupdate = true
      this.sendBtnEnable = sendBtnEnable
      this.props.navigation.setParams({
        enable: sendBtnEnable,
      })
    }
  }
  checkParams(showTip) {
    const { title, content } = this.state.params
    const tips = []
    if (Platform.OS == 'ios') {
      if (!this.email) tips.push('收件人')
    } else {
      if (!this.state.params.email) tips.push('收件人')
    }
    //  || !isEmail(email)
    if (!title) tips.push('主题')
    // if (!send_time) tips.push('发信时间')
    if (!content) tips.push('内容')
    let tip = ''
    if (tips.length > 0) {
      tip = '请保证' + tips.join('，') + '填写正确！'
    }
    if (tip) {
      if (showTip) {
        this.refs.toast.show(tip)
      }
      return false
    }
    return true
  }

  checkSave() {
    const { title, content, email, send_time } = this.state.params
    const { attachs } = this.state
    if (title.trim() || content.trim() || email.trim() || attachs.length > 0) return true
    return false
  }

  checkPre() {
    const tips = []
    const email = Platform.OS == 'ios' ? this.email : this.state.params.email
    if (!email || !isEmail(email)) {
      tips.push('邮箱格式错误')
    }
    const { send_time, send_date } =  this.state.params
    const datetime = send_date + ' ' + send_time
    if (datetime < dateFormat()) {
      tips.push('发信时间不符合要求')
    }
    if (tips.length > 0) {
      const tip = tips.join('，') + '!'
      this.refs.toast.show(tip)
      return false
    }
    return true
  }

  async getParams() {
    const params = {...this.state.params}
    const email = Platform.OS == 'ios' ? this.email : params.email
    params.email = email
    // params.self = '发给自己' == email ? 1 : 0
    params.attach = await this.uploadFile()
    params.send_time = params.send_date + ' ' + params.send_time
    delete params.send_date
    return params
  }

  handleSend = () => {
    if (this.state.showLoading) return
    if (!this.checkPre()) return
    if (!this.checkParams(true)) return
    this.setState({ showLoading: true }, async () => {
      try {
        const params = await this.getParams()
        const url = params.id ? 'api/mail/update.html' : 'api/mail/add.html'
        const res = await post(url, params)
        console.log(res);
        if (res.code == 10001) {
          this.setState({showLoading: false, attachs: params.attach}, () => {
            this.props.navigation.navigate('Login')
          })
        } else if (res.code == 1) {
          this.setState({ isSucc: true, isSend: true, showLoading: false })
        } else {
          this.dealError(res.msg, true)
        }
      } catch (e) {
        console.log(e);
        if (e.code == 10001) {
          this.setState({showLoading: false}, () => {
            this.props.navigation.navigate('Login')
          })
        } else {
          this.dealError('', false)
        }
      }
    })
  }
  handleSave = () => {
    if (this.state.showLoading) return
    if (!this.checkPre()) return
    if (!this.checkSave()) return
    this.setState({ showLoading: true }, async () => {
      try {
        const params = await this.getParams()
        const res = await post('api/mail/save.html', params)
        if (res.code == 10001) {
          this.setState({showLoading: false}, () => {
            this.props.navigation.navigate('Login')
          })
        } else if (res.code == 1) {
          this.setState({ pickerModal: false, isSucc: true, isSend: false, showLoading: false })
        } else {
          this.dealError(res.msg, false)
        }
      } catch (e) {
        if (e.code == 10001) {
          this.setState({showLoading: false, attachs: params.attach}, () => {
            this.props.navigation.navigate('Login')
          })
        } else {
          this.dealError('', false)
        }
      }
    })
  }

  async uploadFile() {
    const { attachs } = this.state
    if (attachs.length == 0) return []
    try {
      for (let index = 0; index < attachs.length; index++) {
        const item = attachs[index]
        if (item.url.indexOf('http') == 0) {
          continue
        }
        const res = await upload(item)
        console.log(res);
        if (res.code == 1) {
          attachs[index] = {...res.data, ext: item.ext}
        } else {
          throw res
        }
      }
      return attachs.map(item => {
        let filename = item.filename ? item.filename.substring(item.filename.lastIndexOf('/') + 1) : ''
        filename = filename || item.url.substring(item.url.lastIndexOf('/') + 1)
        const attach = {
          filename,
          url: item.url,
          thumb: item.thumb || '',
          size: item.size,
          ext: item.ext
        }
        if (item.ext == 'image') {
          attach.thumb = attach.thumb || attach.url
        }
        return attach
      })
    } catch (e) {
      console.log(e);
      throw e
    }
  }

  dealError(msg, isSend) {
    let txt = msg || ((isSend ? '发送' : '保存草稿') + '失败，再试一次吧')
    this.setState({
      showLoading: false
    }, () => {
      this.showErrorModal(txt)
    })
  }
  showErrorModal = (txt) => {
    this.refs.errorModalRef.show({txt})
  }
  handelSuccClose = () => {
    this.setState({ isSucc: false })
  }
  handleFileChoose = (items) => {
    this.setState({ attachs: items })
  }
  openFileChoose = () => {
    if (this.keyboardShow) {
      Keyboard.dismiss()
      this.showChooseFile = true
      // requestAnimationFrame(() => {
      //   this.setState({ pickerModal: true })
      // })
    } else {
      this.setState({ pickerModal: true })
    }
  }
  closeFileChoose = (open = false) => {
    this.setState({ pickerModal: open })
  }

  showToast = (txt) => {
    this.refs.toast.show(txt)
  }
  render() {
    // keyboardType="email-address"
    const { showLoading, attachs, defaultValue, params, isSucc, isSend, initAttaches } = this.state
    const tipTxt = isSend ? '发送' : '保存草稿'
    const attachTxt = attachs.length == 0 ? '' : `${attachs.length}个附件`
    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always">
          <HeaderTip tip="爱慢邮——让我们回到未来" />
          <View style={styles.item}>
            <Text style={styles.label}>收件人：</Text>
            {
              Platform.OS == 'ios' ?
                <TextInput autoFocus style={styles.input}
                  value={params.email}
                  onChangeText={this.handleMailChange}
                  onEndEditing={this.onEndEditMail}
                  autoCorrect={false} autoCapitalize="none" underlineColorAndroid='transparent' />
              : <TextInput autoFocus style={styles.input}
                value={params.email}
                onChangeText={(text) => this.setParams('email', text)}
                autoCorrect={false} autoCapitalize="none" underlineColorAndroid='transparent' />
            }
            <TouchableOpacity style={this.state.showSendMe ? {} : styles.hidden} activeOpacity={0.6} onPress={this.sendMe}>
              <View style={styles.btnWrap}><Text style={styles.btn}>发给自己</Text></View>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>主题：</Text>
            <TextInput style={styles.input} defaultValue={defaultValue.title} onChangeText={(text) => this.setParams('title', text)}
              returnKeyType="done" autoCorrect={false} autoCapitalize="none" underlineColorAndroid='transparent' />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>附件：</Text>
            <TouchableOpacity style={styles.itemTouch} onPress={this.openFileChoose}>
              <View style={styles.icons}>
                <Image style={styles.attachment} source={require('../images/icon_attachment2.png')} />
              </View>
              <Text style={styles.attachmentNum}>{attachTxt}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>发信日期：</Text>
            <DatePicker style={styles.datepicker} date={params.send_date}
              locale="zh" mode="date" format="YYYY-MM-DD"
              minDate={new Date()}
              confirmBtnText="确定" cancelBtnText="取消" showIcon={false}
              customStyles={{
                dateInput: {
                  // marginLeft: 0,
                  borderWidth: 0,
                  color: '#333333',
                  alignItems: 'flex-start',
                },
                btnTextConfirm: {
                  color: '#E24B92',
                }
              }}
              onDateChange={this.handleDatePicker} />
            <Image style={styles.arrow} source={ICONS.forward} />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>发信时间：</Text>
            <DatePicker style={styles.datepicker} date={params.send_time}
              locale="zh" is24Hour mode="time" format="HH:mm"
              minDate={new Date()}
              confirmBtnText="确定" cancelBtnText="取消" showIcon={false}
              customStyles={{
                dateInput: {
                  // marginLeft: 0,
                  borderWidth: 0,
                  color: '#333333',
                  alignItems: 'flex-start',
                },
                btnTextConfirm: {
                  color: '#E24B92',
                }
              }}
              onDateChange={this.handleTimePicker} />
            <Image style={styles.arrow} source={ICONS.forward} />
          </View>
          <View style={styles.item}>
            <Text style={styles.txt}>信件提交后在“慢友圈”公开</Text>
            <Switch value={params.type == 2} onValueChange={(value) => {
                this.setParams('type', value ? 2 : 1)
              }} />
          </View>
          <View style={styles.content}>
            <TextInput multiline defaultValue={defaultValue.content} placeholder="在此输入正文" style={styles.textarea} onChangeText={(text) => this.setParams('content', text)}
              autoCorrect={false} autoCapitalize="none" underlineColorAndroid='transparent' />
          </View>
        </ScrollView>

        <SaveBtn type="bottom" onPress={this.handleSave} />
        {
          this.state.pickerModal &&
            <Text style={styles.imgchoosebg} onPress={this.closeFileChoose.bind(this, false)}></Text>
        }
        <FileChoose visible={this.state.pickerModal}
          initValue={initAttaches}
          onSave={this.handleSave}
          onChange={this.handleFileChoose}
          onClose={this.closeFileChoose}
          onError={this.showErrorModal}
          onTip={this.showToast} />
        <Toast ref="toast" position="center" />
        <SuccessModal
          txt={`信件${tipTxt}成功`}
          btn="返回首页"
          visible={this.state.isSucc}
          onPress={() => {
            this.props.navigation.replace('BottomTabs') // navigate
          }}
        />
        <ErrorModal ref="errorModalRef" />
        <Alert ref={ref => this.alert = ref} />
        {showLoading && <Loading />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRight: {
    width: 64,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  headerRightTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
  },
  hidden: {
    display: 'none'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingLeft: 20,
    paddingRight: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  itemTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 88,
    fontSize: 16,
    color: '#999999',
  },
  input: {
    flex: 1,
    paddingRight: 15,
  },
  datepicker: {
    flex: 1,
    paddingRight: 15,
  },
  txt: {
    flex: 1,
    fontSize: 16,
    color: '#999999',
  },
  btnWrap: {
    width: 80,
    height: 30,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#B4B4B4',
  },
  btn: {
    fontSize: 16,
    color: '#686868',
  },
  icons: {
    width: 40,
    height: 30,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#B4B4B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachment: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  attachmentNum: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
  },
  arrow: {
    width: 25,
    height: 25,
  },
  content: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#EEEEEE',
  },
  textarea: {
    padding: 0,
    height: 88,
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  hide: {
    display: 'none',
  },
  imgchoosebg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  }
});
