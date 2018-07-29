import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';


import HeaderTip from '../components/HeaderTip'
import Attachment from '../components/Attachment'

const onePx = 1 / PixelRatio.get()

const ICONS = {
  delete: require('../images/icon_attachment.png'),
  edit: require('../images/icon_attachment.png'),
  attachment: require('../images/icon_attachment.png'),
}

export default class DraftDetail extends Component {
  handleDelete = () => {

  }
  handleEdit = () => {
    this.props.navigation.push('SendMail')
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.body}>
          <HeaderTip tip="爱慢邮——让我们回到未来" />
          <View style={styles.item}>
            <Text style={styles.label}>收件人：</Text>
            <Text style={styles.txt}>收件人：</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>主题：</Text>
            <Text style={styles.txt}>收件人：</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>发信时间：</Text>
            <Text style={styles.txt}>收件人：</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.textarea}>
              心如镜，虽外景不断变化，镜面却不会转动，这就是一颗平常心，能够景转而心不转。 只要你确信自己正确就去做。做了有人说不好，不做还是有人说不好，不要逃避批判。
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>附件：</Text>
            <Image style={styles.attachment} source={ICONS.attachment} />
            <Text style={styles.attachmentNum}>3个附件</Text>
          </View>
          <Attachment />
        </ScrollView>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.bottomIconWrap} onPress={this.handleDelete}>
            <Image style={styles.bottomIcon} source={ICONS.delete} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIconWrap} onPress={this.handleEdit}>
            <Image style={styles.bottomIcon} source={ICONS.edit} />
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: onePx,
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
    borderTopWidth: onePx,
    borderTopColor: '#EEEEEE',
  },
  textarea: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  bottom: {
    height: 44,
    paddingRight: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: onePx,
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
  bottom: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomIconWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIcon: {
    width: 27,
    height: 29
  }
});
