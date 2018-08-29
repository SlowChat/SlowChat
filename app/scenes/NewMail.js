import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TextInput,
  Switch,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

// import { openFile } from '../utils/opendoc'

// import ImagePicker from 'react-native-image-picker'
import Toast from 'react-native-easy-toast'
import DatePicker from 'react-native-datepicker'
import SaveBtn from '../components/SaveBtn'
import HeaderTip from '../components/HeaderTip'
import ImageChoose from '../components/ImageChoose'
import SuccessModal from '../components/SuccessModal'
import ErrorModal from '../components/ErrorModal'
import Loading from '../components/Loading'
import ICONS from '../utils/icon'
import dateFormat from '../utils/date'
import { post, upload, rnfsUpload } from '../utils/request'
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
      send_time: this.getSendTime(),
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
  }

  componentDidMount() {
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

  getSendTime(send_time) {
    let curr = send_time || dateFormat()
    if (curr.indexOf(':00') > -1) {
      return curr
    }
    curr = curr.replace(/\-/g, '/')
    const timesample = new Date(curr).getTime()
    const next_hour = Math.ceil(timesample / 1000 / 3600) * 1000 * 3600
    return dateFormat(new Date(next_hour))
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
        this.setState({
          showSendMe: items.email == '发给自己',
          params: {
            id: items.id,
            email: items.email,
            title: items.title,
            content: items.content,
            send_time: items.send_time,
          },
          defaultValue: {
            email: items.email,
            title: items.title,
            content: items.content,
          },
          attachs: items.attach,
          initAttaches: items.attach,
        }, () => {
          this.noupdate = true
          this.sendBtnEnable = true
          this.props.navigation.setParams({
            enable: true,
          })
        })
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  }

  handleDatePicker = (datetime) => {
    let send_time = datetime
    if (datetime.indexOf(':00') == -1) {
      this.refs.toast.show('邮件发送时间为整点，将自动调整为下一时刻整点')
      send_time = this.getSendTime(datetime)
    }
    this.setParams('send_time', send_time)
  }

  handleMailChange = (value) => {
    this.email = value
    let { showSendMe } = this.state
    if (value == '发给自己' && showSendMe != false) {
      showSendMe = false
    } else if (value != '发给自己' && showSendMe != true) {
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
    if (this.email == '发给自己') return
    const { params } = this.state
    params.email = this.email || ''
    this.setState({ params }, () => {
      requestAnimationFrame(() => {
        this.email = '发给自己'
        this.setParams('email', '发给自己')
      })
    })
  }
  setParams(key, value) {
    const { params } = this.state
    params[key] = value
    this.setState({
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
    if (!this.email) tips.push('收件人')
    //  || !isEmail(email)
    if (!title) tips.push('主题')
    // if (!send_time) tips.push('发信时间')
    // if (!content) tips.push('内容')
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

  handleSend = () => {
    console.log(this.email);
    if (this.state.showLoading) return false
    if (this.state.params.send_time < dateFormat()) {
      let tip = '发信时间不符合要求！'
      this.refs.toast.show(tip)
    }
    if (!this.checkParams(true)) return

    this.setState({ showLoading: true }, async () => {
      try {
        const params = {...this.state.params}
        params.attach = await this.uploadFile()
        const res = await post('api/mail/add.html', params)
        if (res.code == 10001) {
          this.setState({showLoading: false}, () => {
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
    if (this.state.params.send_time < dateFormat()) {
      let tip = '发信时间不符合要求！'
      this.refs.toast.show(tip)
      return
    }
    // rnfsUpload(this.state.attachs)
    // return
    if (this.state.showLoading) return
    if (!this.checkSave()) return
    this.setState({ showLoading: true }, async () => {
      try {
        const params = {...this.state.params}
        params.attach = await this.uploadFile()
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
          this.setState({showLoading: false}, () => {
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
        const res = await upload(item.url, item.filename)
        if (res.code == 1) {
          attachs[index] = {...res.data, ext: item.ext}
        } else {
          throw res
        }
      }
      console.log(attachs);
      return attachs.map(item => ({
        filename: item.name,
        url: item.url,
        size: item.size,
        ext: item.ext
      }))
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
  handleImageChoose = (items) => {
    this.setState({ attachs: items })
  }
  openImageChoose = () => {
    // openFile()
    Keyboard.dismiss()
    this.setState({ pickerModal: true })
  }
  closeImageChoose = (open = false) => {
    this.setState({ pickerModal: open })
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
            <TextInput autoFocus style={styles.input}
              value={params.email}
              onChangeText={this.handleMailChange}
              onEndEditing={this.onEndEditMail}
              autoCorrect={false} autoCapitalize="none" underlineColorAndroid='transparent' />
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
            <TouchableOpacity style={styles.itemTouch} onPress={this.openImageChoose}>
              <View style={styles.icons}>
                <Image style={styles.attachment} source={require('../images/icon_attachment2.png')} />
              </View>
              <Text style={styles.attachmentNum}>{attachTxt}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>发信时间：</Text>
            <DatePicker style={styles.datepicker} date={params.send_time}
              locale="zh" is24Hour mode="datetime" format="YYYY-MM-DD HH:mm"
              minuteInterval={30} minDate={new Date()}
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
            <Text style={styles.imgchoosebg} onPress={this.closeImageChoose.bind(this, false)}></Text>
        }
        <ImageChoose visible={this.state.pickerModal}
          initValue={initAttaches}
          onSave={this.handleSave}
          onChange={this.handleImageChoose}
          onClose={this.closeImageChoose}
          onError={this.showErrorModal} />
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
    borderWidth: 1,
    borderColor: '#B4B4B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    fontSize: 16,
    color: '#686868',
  },
  icons: {
    width: 40,
    height: 30,
    borderRadius: 2,
    borderWidth: 1,
    // borderWidth: StyleSheet.hairlineWidth,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
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
  }
});
