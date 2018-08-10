import React, {Component} from 'react';
import DatePicker from 'react-native-datepicker'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Picker,
  TouchableWithoutFeedback
} from 'react-native';
import Toast from 'react-native-easy-toast'
import Avatar from '../components/Avatar'
import Confirm from '../components/Confirm'
import { get, post } from '../utils/request'

const ICONS = {
  forward: require('../images/icon_forward.png'),
}

export default class Information extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '个人资料',
    }
  }
  state = {
    switchBtn: true,
    isShow: false,
    sex: '',
    date: this.props.navigation.state.params.birthday,
    nickname: this.props.navigation.state.params.username,
    avatar: this.props.navigation.state.params.avatar,
    isSucc: false
  }

  componentDidMount() {
    this.setState({
      sex: this.getSexValue()
    })
  }

  getSexValue() {
    const { sex } = this.props.navigation.state.params;
    if (sex === 0) {
      return '保密';
    } else if (sex === 1) {
      return '男'
    } else if (sex === 2) {
      return '女'
    }
  }

  getSexid() {
    const { sex } = this.state;
    if (sex === '保密') {
      return 0;
    } else if (sex === '男') {
      return 1
    } else if (sex === '女') {
      return 2
    }
  }

  changeSex(itemValue) {
    this.setState({sex: itemValue})
    setTimeout(() => {
      this.setState({isShow: false})
    }, 1000)
  }

  handleSubmit() {
    const { navigate, pop } = this.props.navigation;
    const { sex, nickname, avatar, date } = this.state;
    post('api/user/userInfo.html', { user_nickname: nickname, avatar, sex: this.getSexid(), birthday: date}).then(res => {
      console.log(res)
      if (res.code == 1) {
        this.refs.toast.show(res.msg);
        setTimeout(() => {
          pop()
        })
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
    this.setState({nickname: this.state.inputname, isSucc: false})
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <Avatar />
        <View style={styles.link}>
          <View style={styles.menu}>
            <Text style={styles.label}>昵称</Text>
            <Text style={styles.input} onPress={() => this.onChangeName()}>{this.state.nickname}</Text>
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
              style={styles.input}
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
          
          
        <TouchableWithoutFeedback onPress={() => this.handleSubmit()}>
          <View style={styles.exit}>
            <Text style={styles.exitTxt}>保存</Text>
          </View>
        </TouchableWithoutFeedback>
        <View>
            <Picker
              selectedValue={this.state.sex}
              style={[styles.picker, {display: `${this.state.isShow ? 'flex' : 'none'}`}]}
              onValueChange={(itemValue, itemIndex) => this.changeSex(itemValue)}>
              <Picker.Item label="保密" value="保密" />
              <Picker.Item label="男" value="男" />
              <Picker.Item label="女" value="女" />
            </Picker>
          </View>
        </View>
        <Toast ref="toast" position="bottom" />
        <Confirm
          tit='请输入新的昵称'
          leftBtnTxt='取消'
          rightBtnTxt='确定'
          autoView={
            <TextInput
              style={styles.nickInput}
              onChangeText={(text) => this.setState({inputname: text})}
              placeholder='请输入填写您的用户名'
              value={this.state.nickname}
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
    backgroundColor: '#efefef',
  },
  link: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
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
    textAlign: 'right',
    color: '#B4B4B4'
  },
  nickInput: {
    width: '80%',
    height: 40,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    color: '#B4B4B4',
    backgroundColor: '#eee',
    alignItems:'center',
  },
  picker: {
    position: 'absolute',
    top: 100,
    bottom: 0,
    left: 0,
    width: '100%',
  },
  exit: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent: 'center',
  },
  exitTxt: {
    color: '#EC3632'
  },
  switch: {
    position: 'absolute',
    right: 15,
  }
});
