import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Toast from 'react-native-easy-toast'
import Alert from '../components/Alert'
import HeaderTip from '../components/HeaderTip'
import Attachment from '../components/Attachment'

import { post } from '../utils/request'

const ICONS = {
  delete: require('../images/delete.png'),
  edit: require('../images/edit.png'),
  attachment: require('../images/icon_attachment.png'),
}

export default class DraftDetail extends Component {
  state = {
    showConfirm: true,
    data: {},
    attachs: []
  }

  componentWillMount() {
    this.getData()
  }
  getId() {
    const { id = 30 } = this.props.navigation.state.params || {}
    return id
  }
  async getData() {
    if (this.loading) return
    this.loading = true
    try {
      const id = this.getId()
      const res = await post('api/mail/getInfo.html', { id })
      if (res.code == 1) {
        const { items } = res.data
        this.setState({
          data: items,
          attachs: items.attach.split(',')
        })
      } else {

      }
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  closeConfirm = () => {
    this.setState({ showConfirm: false })
  }
  openDelete = () => {
    this.refs.alert.show()
  }
  handleDelete = async () => {
    const id = this.getId()
    const res = await post('api/mail/delDraft.html', { id })
    if (res.code == 1) {
      this.props.navigation.goBack()
    } else if (res.code == 10001) {
      this.props.navigation.navigate('Login', {back: true})
    } else {
      this.refs.alert.hide()
      this.refs.toast.show(res.msg || '请稍后重试')
    }
  }
  handleEdit = () => {
    const id = this.getId()
    this.props.navigation.push('NewMail', {id})
  }

  // this.props.navigation.setParams({
  //   header: () => (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}
  //     style={[styles.header, {transform: [{translateY: this.springValue}]}]}>
  //     <Text style={styles.headerTxt}>首页</Text>
  //   </SafeAreaView>),
  // })
  render() {
    const { data, attachs } = this.state
    return (
      <View style={styles.container}>
        <ScrollView style={styles.body}>
          <HeaderTip tip="爱慢邮——让我们回到未来" />
          <View style={styles.item}>
            <Text style={styles.label}>收件人：</Text>
            <Text style={styles.txt}>{data.email}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>主题：</Text>
            <Text style={styles.txt}>{data.title}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>发信时间：</Text>
            <Text style={styles.txt}>{data.send_time}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.textarea}>
              {data.content}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>附件：</Text>
            <Image style={styles.attachment} source={ICONS.attachment} />
            <Text style={styles.attachmentNum}>{attachs.length}个附件</Text>
          </View>
          <Attachment items={attachs} />
        </ScrollView>
        <View style={styles.bottom}>
          <TouchableOpacity activeOpacity={0.7} style={styles.bottomIconWrap} onPress={this.openDelete}>
            <Image style={styles.bottomIcon} source={ICONS.delete} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.bottomIconWrap} onPress={this.handleEdit}>
            <Image style={styles.bottomIcon} source={ICONS.edit} />
          </TouchableOpacity>
        </View>
        <Alert
          ref="alert"
          title="删除草稿"
          txt="草稿删除后将不可恢复"
          leftBtnTxt="取消"
          rightBtnTxt="确定删除"
          onOk={this.handleDelete}
        />
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
  body: {
    flex: 1,
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
    marginLeft: 19,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  textarea: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  bottom: {
    height: 50,
    flexDirection: 'row',
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
  bottomIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  confirmView: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  confirmTxt: {
    height: 22,
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
    lineHeight: 22
  }
});
