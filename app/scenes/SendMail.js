import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Switch,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';

import DatePicker from 'react-native-datepicker'

import HeaderTip from '../components/HeaderTip'

const onePx = 1 / PixelRatio.get()

export default class SendMail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '写信',
      headerRight: (
        <Button
          onPress={params.rightOnPress}
          title='发送'
          color={params.rightColor || '#F9DBE9'}
        />
      ),
    }
  }

  state = {
    switchBtn: true
  }
  componentDidMount() {
    this.props.navigation.setParams({
      rightOnPress: this.rightBtnOnPress
    })
  }
  handleSwitch = (value) => {
    this.setState({
      switchBtn: value
    })
  }
  rightBtnOnPress = () => {
    this.props.navigation.setParams({
      rightColor: '#FFFFFF',
    })
  }
  render() {
    const { switchBtn } = this.state
    return (
      <View style={styles.container}>
        <HeaderTip tip="爱慢邮——让我们回到未来" />
        <View style={styles.item}>
          <Text style={styles.label}>收件人：</Text>
          <TextInput autoFocus style={styles.input} />
          <TouchableOpacity>
            <View style={styles.btnWrap}><Text style={styles.btn}>发给自己</Text></View>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>主题：</Text>
          <TextInput autoFocus style={styles.input} />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>附件：</Text>
          <View style={styles.icons}>
            <Image style={styles.attachment} source={require('../images/icon_attachment2.png')} />
          </View>
          <Text style={styles.attachmentNum}>3个附件</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>发信时间：</Text>
          <DatePicker style={styles.datepicker} date={this.state.datetime}
            mode="datetime" format="YYYY-MM-DD HH:mm"
            confirmBtnText="确定" cancelBtnText="取消" showIcon={false}
            customStyles={{
              dateInput: {
                borderWidth: 0,
              }
            }}
            onDateChange={(datetime) => {
              this.setState({datetime: datetime});
            }} />
          <Image style={styles.arrow} source={require('../images/icon_forward.png')} />
        </View>
        <View style={styles.item}>
          <Text style={styles.txt}>信件提交后在“慢友圈”公开</Text>
          <Switch value={switchBtn} onValueChange={this.handleSwitch} />
        </View>
        <View style={styles.content}>
          <TextInput multiline placeholder="在此输入正文" style={styles.textarea} />
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity>
            <View style={styles.saveBtn}>
              <Text style={styles.saveBtnTxt}>保存草稿</Text>
            </View>
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
    borderTopWidth: onePx,
    borderTopColor: '#EEEEEE',
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
});

// bottom
// saveBtn
// saveBtnTxt
