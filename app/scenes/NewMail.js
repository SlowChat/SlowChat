import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Modal,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';

// import ImagePicker from 'react-native-image-picker'
import Toast from 'react-native-easy-toast'
import DatePicker from 'react-native-datepicker'
// import RNFileSelector from 'react-native-file-selector'
import HeaderTip from '../components/HeaderTip'
import ImageChoose from '../components/ImageChoose'
import SuccessModal from '../components/SuccessModal'
import ErrorModal from '../components/ErrorModal'

import { post, upload } from '../utils/request'
import { isEmail } from '../utils/validate'


export default class SendMail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    if (!params.rightOnPress) {
      params.rightOnPress = () => {}
    }
    return {
      title: '写信',
      headerRight: (
        <Button
          title='发送'
          color={params.enable ? '#E24B92' : '#F9DBE9'}
          onPress={params.rightOnPress}
        />
      ),
    }
  }

  state = {
    isSend: true,
    isSucc: false,
    pickerModal: false,
    attachs: ['http://img.alicdn.com/bao/uploaded/i2/TB1jZYfdRjTBKNjSZFwATwG4XXa_041742.jpg'],
    params: {
      title: '233233232',
      content: 'dsa四大花旦哈苏的挥洒打底衫',
      email: 'sanri.long@163.com',
      send_time: '2018-11-1 09:19',
      type: 2,
    },
  }
  componentDidMount() {
    this.props.navigation.setParams({
      rightOnPress: this.handleSend
    })
  }
  setParams(key, value) {
    const { params } = this.state
    params[key] = value
    this.setState({ params }, () => {
      const sendBtnEnable = this.checkParams()
      if (this.sendBtnEnable != sendBtnEnable) {
        this.noupdate = true
        this.sendBtnEnable = sendBtnEnable
        this.props.navigation.setParams({
          enable: sendBtnEnable,
        })
      }
    })
  }
  checkParams(showTip) {
    const { attachs } = this.state
    const { title, content, email, send_time, attach } = this.state.params
    const tips = []
    if (!email || !isEmail(email)) tips.push('收件人')
    if (!title) tips.push('主题')
    if (attachs.length == 0) tips.push('附件')
    if (!send_time) tips.push('发信时间')
    if (!content) tips.push('内容')
    if (tips.length > 0) {
      if (showTip) {
        const tip = '请保证' + tips.join('，') + '填写正确！'
        this.refs.toast.show(tip)
      }
      return false
    } else {
      return true
    }
  }
  handleSend = () => {
    if (!this.checkParams(true)) return
    const params = {...this.state.params}
    params.attach = this.state.attachs.join(',')
    post('api/mail/add.html', params).then(res => {
      if (res.code == 10001) {
        this.props.navigation.replace('Login', {back: true})
      } else if (res.code == 1) {
        this.setState({ isSucc: true, isSend: false })
      } else {
        this.dealError(true)
      }
    }).catch(e => {
      this.dealError(true)
    })
  }
  handleSave = () => {
    if (!this.checkParams(true)) return
    const params = {...this.state.params}
    params.attach = this.state.attachs.join(',')
    post('api/mail/save.html', params).then(res => {
      console.log(res);
      if (res.code == 10001) {
        this.props.navigation.navigate('Login', { back: true })
      } else if (res.code == 1) {
        this.setState({ isSucc: true, isSend: false })
      } else {
        this.dealError(false)
      }
    }).catch(e => {
      console.log(e);
      this.dealError(false)
    })
  }

  dealError(isSend) {
    let txt = (isSend ? '发送' : '保存草稿') + '失败，再试一次吧'
    this.refs.errorModalRef.show({txt})
  }

  rightBtnOnPress = () => {

  }
  onRequestClose = () => {
    this.setState({ isSucc: false })
  }
  render() {
    const { attachs, params, isSucc, isSend } = this.state
    const tipTxt = isSend ? '发送' : '保存草稿'
    const attachTxt = attachs.length == 0 ? '无附件' : `${attachs.length}个附件`
    return (
      <View style={styles.container}>
        <HeaderTip tip="爱慢邮——让我们回到未来" />
        <View style={styles.item}>
          <Text style={styles.label}>收件人：</Text>
          <TextInput autoFocus style={styles.input} onChangeText={(text) => this.setParams('email', text)}
            autoCapitalize="none" underlineColorAndroid='transparent' />
          <TouchableOpacity activeOpacity={0.8} onPress={() => { this.setParams('email', '') }}>
            <View style={styles.btnWrap}><Text style={styles.btn}>发给自己</Text></View>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>主题：</Text>
          <TextInput style={styles.input} onChangeText={(text) => this.setParams('title', text)}
            autoCapitalize="none" underlineColorAndroid='transparent' />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>附件：</Text>
          <TouchableOpacity style={styles.itemTouch} onPress={() => this.setState({ pickerModal: true })}>
            <View style={styles.icons}>
              <Image style={styles.attachment} source={require('../images/icon_attachment2.png')} />
            </View>
            <Text style={styles.attachmentNum}>{attachTxt}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>发信时间：</Text>
          <DatePicker style={styles.datepicker} date={this.state.datetime}
            locale="zh" is24Hour mode="datetime" format="YYYY-MM-DD hh:mm"
            confirmBtnText="确定" cancelBtnText="取消" showIcon={false}
            customStyles={{
              dateInput: {
                borderWidth: 0,
              }
            }}
            onDateChange={(datetime) => {
              this.setParams('send_time', datetime)
            }} />
          <Image style={styles.arrow} source={require('../images/icon_forward.png')} />
        </View>
        <View style={styles.item}>
          <Text style={styles.txt}>信件提交后在“慢友圈”公开</Text>
          <Switch value={params.type == 2} onValueChange={(value) => {
              this.setParams('type', value ? 2 : 1)
            }} />
        </View>
        <View style={styles.content}>
          <TextInput multiline placeholder="在此输入正文" style={styles.textarea} onChangeText={(text) => this.setParams('content', text)}
            autoCapitalize="none" underlineColorAndroid='transparent' />
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={this.handleSave}>
            <View style={styles.saveBtn}>
              <Text style={styles.saveBtnTxt}>保存草稿</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ImageChoose visible={this.state.pickerModal} onClose={() => this.setState({ pickerModal: false })} />
        <SuccessModal
          txt={`信件${tipTxt}成功`}
          btn="返回首页"
          visible={this.state.isSucc}
          onPress={() => {
            this.props.navigation.replace('BottomTabs') // navigate
          }}
          onRequestClose={this.onRequestClose}
        />
        <ErrorModal ref="errorModalRef" />
        <Toast ref="toast" position="center" />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontFamily: 'PingFangSC-Regular'
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
    height: 88,
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  bottom: {
    height: 44,
    paddingRight: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
  },
  saveBtn: {
    width: 90,
    height: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E24B92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnTxt: {
    fontSize: 16,
    color: '#E24B92',
  },
});

// bottom
// saveBtn
// saveBtnTxt
