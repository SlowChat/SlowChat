import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Picker,
  TouchableOpacity,
} from 'react-native';

import {SafeAreaView} from 'react-navigation'
import Toast from 'react-native-easy-toast'
// import ImagePicker from 'react-native-image-picker'
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-datepicker'
import ZhTextInput from '../components/ZhTextInput'
import Avatar from '../components/Avatar'
import Confirm from '../components/Confirm'
import ActionSheet from '../components/ActionSheet'
import { post, upload } from '../utils/request'
import { checkImagePermission } from '../utils/permission'
import Storage from '../utils/storage'
import ICONS from '../utils/icon'

const SEX_OPTIONS = ['保密', '男', '女', '返回']


export default class Information extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '个人资料',
    }
  }
  constructor(props) {
    super(props)
    const { avatar, birthday, username, sex, level, type } = this.props.navigation.state.params || {}
    this.state = {
      switchBtn: true,
      isShow: false,
      sex: SEX_OPTIONS[sex] || '',
      date: birthday || '1980-01-01',
      username,
      avatar,
      level,
      type,
      isSucc: false
    }
  }

  handleSubmit = () => {
    const { pop } = this.props.navigation;
    const { sex, username, avatar, date } = this.state;
    const sexKey = SEX_OPTIONS.findIndex(item => item == sex)
    const params = { user_nickname: username, avatar, sex: String(sexKey), birthday: date}
    post('api/user/userInfo.html', params).then(async (res) => {
      if (res.code == 1) {
        try {
          const token = await Storage.getToken()
          const user = await Storage.getUser()
          await Storage.setToken(token, {...user, ...params})
        } catch (e) {

        }
        this.refs.toast.show(res.msg)
        setTimeout(() => {
          pop()
        }, 1000)
      }
    }).catch(e => {
      this.refs.toast.show(res.msg);
    })
  }

  openSex = () => {
    this.actionSheet.show()
  }

  changeSex = (index) => {
    if (index < SEX_OPTIONS.length - 1) {
      this.setState({
        sex: SEX_OPTIONS[index]
      })
    }
  }

  openAvatar = () => {
    this.avatarSheet.show()
  }

  changeAvatar = (index) => {
    if (index == 0) {
      this.chooseAndUpload('camera')
    } else if (index == 1) {
      this.chooseAndUpload('album')
    }
  }

  onChangeName = () => {
    this.inputname = this.state.username
    this.setState({
      isSucc: true,
      isShow: false
    })
  }

  onRequestClose = () => {
    this.setState({ isSucc: false })
  }

  onRightPress = () => {
    this.setState({username: this.inputname || '', isSucc: false})
  }

  chooseAndUpload = async (type) => {
    try {
      await checkImagePermission()
    } catch (e) {
      this.refs.toast.show(e.message)
      return
    }

    try {
      let image = {}
      const options = {
        cropping: true,
        cropperCircleOverlay: true,
        cropperChooseText: '选择',
        cropperCancelText: '取消',
      }
      if (type == 'camera') {
        image = await ImagePicker.openCamera(options)
      } else {
        image = await ImagePicker.openPicker(options)
      }
      if (image.path) {
        const res = await upload({
          url: image.path,
          filename: image.filename
        })
        console.log(res);
        if (res.code == 1) {
          this.setState({ avatar: res.data.thumb || res.data.url })
        } else {
          this.refs.toast.show('上传失败，稍后重试！')
        }
      }
    } catch (e) {
      // this.refs.toast.show('获取图片失败，稍后重试！')
    }
  }

  render() {
    const { params } = this.props.navigation.state;
    const { avatar, username, level, type } = this.state
    return (
      <View style={styles.container}>
        <Avatar avatar={avatar} username={username} level={level} type={type} onPress={this.openAvatar} />
        <View style={styles.link}>
          <TouchableOpacity activeOpacity={0.8} style={styles.menu} onPress={this.onChangeName}>
            <Text style={styles.label}>昵称</Text>
            <Text style={styles.input}>{this.state.username}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.menu} onPress={this.openSex}>
            <Text style={styles.label}>性别</Text>
            <Text style={styles.input}>
              {this.state.sex || '请选择性别'}
            </Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.menu}>
            <Text style={styles.sexLabel}>生日</Text>
            <DatePicker
              style={{width: '100%', paddingRight: 20, justifyContent: 'flex-end', alignItems: 'flex-end'}}
              date={this.state.date}
              mode="date"
              placeholder="请设置生日"
              format="YYYY-MM-DD"
              minDate="1900-05-01"
              maxDate={new Date()}
              confirmBtnText="确定"
              cancelBtnText="取消"
              showIcon={false}
              customStyles={{
                dateInput: {
                  // marginLeft: 0,
                  borderWidth: 0,
                  color: '#B4B4B4',
                  alignItems: 'flex-end',
                },
                btnTextConfirm: {
                  color: '#E24B92',
                }
              }}
              onDateChange={(date) => {this.setState({date: date})}}
              onOpenModal={() => {this.setState({isShow: false})}}
              locale="zh"
            />
            <Image style={styles.forward} source={ICONS.forward} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.saveBtn} onPress={this.handleSubmit}>
            <Text style={styles.saveTxt}>保 存</Text>
          </TouchableOpacity>
        </View>

        <ActionSheet
          title="性别选择"
          ref={ref => this.actionSheet = ref}
          options={SEX_OPTIONS}
          cancelButtonIndex={3}
          onPress={this.changeSex}
        />

        <ActionSheet
          title="头像选择"
          ref={ref => this.avatarSheet = ref}
          options={['拍照', '选择图片', '取消']}
          cancelButtonIndex={2}
          onPress={this.changeAvatar}
        />

        <Toast ref="toast" position="center" />
        <Confirm
          leftBtnTxt='取消'
          rightBtnTxt='确定'
          autoView={
            <View style={styles.confirmWrap}>
              <Text style={styles.confirmTit}>请输入新的昵称</Text>
              <ZhTextInput autoFocus style={styles.nickInput} placeholder="请输入填写您的用户名"
                value={this.state.username} onChange={(text) => this.inputname = text} />
            </View>
          }
          visible={this.state.isSucc}
          onLeftPress={() => {
            this.onRequestClose()
          }}
          onRightPress={this.onRightPress}
          onRequestClose={this.onRequestClose}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  link: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#F6F6F6',
  },
  menu: {
    flexDirection: 'row',
    height: 44,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderBottomColor: '#eee',
    alignItems:'center',
  },
  forward: {
    position: 'absolute',
    right: 8,
    width: 24,
    height: 24,
  },
  label: {
    flex:1,
    flexDirection: 'row',
    color: '#666'
  },
  sexLabel: {
    position: 'absolute',
    left: 15,
    color: '#666'
  },
  input: {
    flex:1,
    flexDirection: 'row',
    fontFamily: 'PingFangSC-Regular',
    height: 40,
    lineHeight: 40,
    paddingRight: 20,
    textAlign: 'right',
    color: '#333',
    alignItems:'center',
    justifyContent: 'flex-end',
  },
  confirmWrap: {
    alignItems: 'center',
  },
  confirmTit: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#777777',
    lineHeight: 22,
    marginTop: 26,
    marginBottom: 15,
  },
  nickInput: {
    height: 36,
    marginBottom: 20,
    width: 215,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 18,
    color: '#333',
    backgroundColor: '#f7f7f7',
    alignItems:'center',
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
    position: 'absolute',
    bottom: 250,
    left: 0,
    width: '100%',
    height: 50,
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
  },
  saveBtn: {
    marginLeft: 53,
    marginRight: 53,
    height: 44,
    marginTop: 48,
    backgroundColor: '#D74B80',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
  },
  saveTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Regular',
    color: '#FFFFFF',
  }
});


// <SafeAreaView style={styles.exitWrap} forceInset={{top: 'never', bottom: 'always'}}>
//   <TouchableOpacity style={styles.exit} activeOpacity={0.6} onPress={this.handleSubmit}>
//     <Text style={styles.exitTxt}>保 存</Text>
//   </TouchableOpacity>
// </SafeAreaView>
