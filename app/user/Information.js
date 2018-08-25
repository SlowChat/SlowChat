import React, {Component} from 'react';
import DatePicker from 'react-native-datepicker'
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
import ImagePicker from 'react-native-image-picker'
import Avatar from '../components/Avatar'
import Confirm from '../components/Confirm'
import { post, upload } from '../utils/request'
import { checkImagePermission, checkVideoPermission } from '../utils/permission'
import ICONS from '../utils/icon'

const SEX_OBJ = {
  0: '保密',
  1: '男',
  2: '女'
}

const SEXID_OBJ = {
  '保密': "0",
  '男': "1",
  '女': "2"
}

export default class Information extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '个人资料',
    }
  }
  constructor(props) {
    super(props)
    const { avatar, birthday, username, sex, level } = this.props.navigation.state.params || {}
    this.state = {
      switchBtn: true,
      isShow: false,
      sex: SEX_OBJ[sex] || '',
      date: birthday || '1980-01-01',
      username,
      avatar,
      level,
      isSucc: false
    }
  }

  changeSex(itemValue) {
    this.setState({sex: itemValue})
    setTimeout(() => {
      this.setState({isShow: false})
    }, 1000)
  }

  handleSubmit = () => {
    const { pop } = this.props.navigation;
    const { sex, username, avatar, date } = this.state;
    post('api/user/userInfo.html', { user_nickname: username, avatar, sex: SEXID_OBJ[sex], birthday: date}).then(res => {
      if (res.code == 1) {
        this.refs.toast.show(res.msg);
        setTimeout(() => {
          pop()
        }, 1000)
      }
    }).catch(e => {
      this.refs.toast.show(res.msg);
    })
  }

  onChangeName = () => {
    this.setState({ isSucc: true })
  }

  onRequestClose = () => {
    this.setState({ isSucc: false })
  }

  onRightPress = () => {
    this.setState({username: this.state.inputname, isSucc: false})
  }

  chooseAndUpload = async () => {
    let nopermission = await checkImagePermission((txt) => {
      this.refs.toast.show(txt)
    })
    if (nopermission) return
    const options = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择照片',
      cameraType: 'back',
      mediaType: 'photo',
      videoQuality: 'high',
      durationLimit: 10,
      maxWidth: 500,
      maxHeight: 500,
      // quality: 0.8,
      angle: 0,
      allowsEditing: false,
      noData: true,
      storageOptions: {
        skipBackup: true,
      }
    }
    ImagePicker.showImagePicker(options, async (response) => {
      if (response && response.uri) {
        let file = response.uri
        // if(Platform.OS === 'ios'){
        //   file = file.replace('file://', '')
        // }
        console.log(response);
        const res = await upload(response.uri, response.fileName)
        console.log(res);
        if (res.code == 1) {
          this.setState({ avatar: res.data.url })
        } else {
          this.refs.toast.show('上传失败，稍后重试！')
        }
      }
    });
  }

  render() {
    const { params } = this.props.navigation.state;
    const { avatar, username, level } = this.state
    return (
      <View style={styles.container}>
        <Avatar avatar={avatar} username={username} level={level} onPress={this.chooseAndUpload} />
        <View style={styles.link}>
          <View style={styles.menu}>
            <Text style={styles.label}>昵称</Text>
            <Text style={styles.input} onPress={() => this.onChangeName()}>{this.state.username}</Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>性别</Text>
            <Text style={styles.input} onPress = {() => this.setState({isShow: true})}>
              {this.state.sex}
            </Text>
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
          <View style={styles.menu}>
            <Text style={styles.label}>生日</Text>
            <DatePicker
              style={{width: '62%', justifyContent: 'flex-end'}}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="1900-05-01"
              maxDate={new Date()}
              confirmBtnText="确定"
              cancelBtnText="取消"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                  width: 0
                },
                dateInput: {
                  marginLeft: 0,
                  borderWidth: 0,
                  color: '#B4B4B4',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                },
              }}
              onDateChange={(date) => {this.setState({date: date})}}
              locale="zh"
            />
            <Image style={styles.forward} source={ICONS.forward} />
          </View>
        </View>
        <SafeAreaView style={styles.exitWrap}>
          <TouchableOpacity style={styles.exit} activeOpacity={0.6} onPress={this.handleSubmit}>
            <Text style={styles.exitTxt}>保 存</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <Picker
          selectedValue={this.state.sex}
          style={[styles.picker, {display: `${this.state.isShow ? 'flex' : 'none'}`}]}
          onValueChange={(itemValue, itemIndex) => this.changeSex(itemValue)}>
          <Picker.Item label="保密" value="保密" />
          <Picker.Item label="男" value="男" />
          <Picker.Item label="女" value="女" />
        </Picker>
        
        <Toast ref="toast" position="center" />
        <Confirm
          tit='请输入新的昵称'
          leftBtnTxt='取消'
          rightBtnTxt='确定'
          autoView={
            <TextInput
              style={styles.nickInput}
              onChangeText={(text) => this.setState({inputname: text})}
              placeholder='请输入填写您的用户名'
              value={this.state.username}
            />
          }
          visible={this.state.isSucc}
          onLeftPress={() => {
            this.onRequestClose()
          }}
          onRightPress={() => {
            this.onRightPress() // navigate
          }}
          onRequestClose={this.onRequestClose}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  link: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#f9f9f9',
  },
  menu: {
    flexDirection: 'row',
    height: 44,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
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
    width: '30%',
    color: '#666'
  },
  input: {
    width: '62%',
    height: 40,
    lineHeight: 40,
    textAlign: 'right',
    color: '#333',
    alignItems:'center',
    justifyContent: 'center',
  },
  nickInput: {
    width: '80%',
    height: 40,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    color: '#333',
    backgroundColor: '#eee',
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
  }
});
