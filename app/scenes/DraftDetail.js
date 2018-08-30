import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'

import Toast from 'react-native-easy-toast'
import Alert from '../components/Alert'
import HeaderTip from '../components/HeaderTip'
import Attachment from '../components/Attachment'

import { post } from '../utils/request'

export default class DraftDetail extends Component {
  state = {
    showConfirm: true,
    data: {},
    attachs: []
  }

  componentWillMount() {
    this.getData()
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
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
      const res = await post('api/mail/getDraftInfo.html', { id })
      console.log(res);
      if (res.code == 1) {
        const { items } = res.data
        this.setState({
          data: items,
          attachs: items.attach || []
        })
      } else {

      }
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
      this.setState({ showLoading: false })
    }
    this.timer = setTimeout(() => {
      if (this.loading) {
        this.setState({ showLoading: true })
      }
    }, 300)
  }

  closeConfirm = () => {
    this.setState({ showConfirm: false })
  }
  openDelete = () => {
    requestAnimationFrame(() => {
      this.refs.alert.show()
    })
  }
  handleDelete = async () => {
    const id = this.getId()
    const res = await post('api/mail/delDraft.html', { id })
    if (res.code == 1) {
      this.props.navigation.goBack()
    } else if (res.code == 10001) {
      this.props.navigation.navigate('Login')
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
    const hasAttach = attachs && attachs.length > 0
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
            <Image style={styles.attachment} source={require('../images/icon_attachment.png')} />
            <Text style={styles.attachmentNum}>{hasAttach ? `${attachs.length}个附件` : ''}</Text>
          </View>
          <Attachment items={attachs} />
        </ScrollView>
        <SafeAreaView style={styles.bottom} forceInset={{top: 'never', bottom: 'always'}}>
          <TouchableOpacity activeOpacity={0.7} style={styles.bottomIconWrap} onPress={this.openDelete}>
            <Image style={styles.bottomIcon} source={require('../images/delete.png')} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.bottomIconWrap} onPress={this.handleEdit}>
            <Image style={styles.bottomIcon} source={require('../images/edit.png')} />
          </TouchableOpacity>
        </SafeAreaView>
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
});
