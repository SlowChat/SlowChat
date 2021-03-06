import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';

export default class Alert extends PureComponent {
  state = {
    visible: false,
    type: 'confirm',
    title: '',
    txt: '',
    leftBtnTxt: '取消',
    rightBtnTxt: '确定'
  }
  componentWillMount() {
    const { title, txt, leftBtnTxt = '取消', rightBtnTxt = '确定' } = this.props
    this.setState({ title, txt, leftBtnTxt, rightBtnTxt })
  }
  show(data = {}) {
    if (data.onOk) {
      this.onOk = data.onOk
      delete data.onOk
    }
    if (data.onCancel) {
      this.onCancel = data.onCancel
      delete data.onCancel
    }
    this.setState({
      visible: true,
      ...data
    })
  }
  hide() {
    this.setState({ visible: false })
  }
  handleOk = () => {
    const onOk = this.onOk || this.props.onOk
    if (onOk) {
      onOk()
    } else {
      this.hide()
    }
  }
  handleClose = () => {
    if (this.onCancel) {
      this.onCancel()
    } else {
      this.hide()
    }
  }
  render() {
    const { type, visible, title, txt, leftBtnTxt, rightBtnTxt } = this.state
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={this.handleClose}
      >
        <View style={styles.succViewWrap}>
          <View style={styles.succView}>
            <View style={styles.titleView}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.txtView}>
              <Text style={styles.txt}>{txt}</Text>
            </View>
            {
              type == 'confirm' ? (<View style={styles.btn}>
                <TouchableOpacity activeOpacity={0.8} style={styles.leftBtn} onPress={this.handleClose}>
                  <Text style={styles.leftBtnTxt}>{leftBtnTxt}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.rightBtn} onPress={this.handleOk}>
                  <Text style={styles.rightBtnTxt}>{rightBtnTxt}</Text>
                </TouchableOpacity>
              </View>)
              : (<View style={styles.btn}>
                <TouchableOpacity activeOpacity={0.8} style={styles.rightBtn} onPress={this.handleOk}>
                  <Text style={styles.rightBtnTxt}>{rightBtnTxt}</Text>
                </TouchableOpacity>
              </View>)
            }
          </View>
        </View>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({
  succViewWrap: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  succView: {
    width: 275,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent:'center',
    alignItems:'center',
  },
  titleView: {
    width: 275,
    height: 43,
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D8D8D8',
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
  txtView: {
    width: 275,
    paddingTop: 24,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D8D8D8',
  },
  txt: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
    lineHeight: 22,
  },
  btn: {
    flexDirection: 'row',
  },
  leftBtn: {
    flex: 1,
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#D8D8D8',
  },
  leftBtnTxt: {
    color: '#777',
    fontSize: 18
  },
  rightBtn: {
    flex: 1,
    height: 50,
    alignItems:'center',
    justifyContent: 'center',
  },
  rightBtnTxt: {
    color: '#E24B92',
    fontSize: 18
  }
})
