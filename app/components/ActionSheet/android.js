import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Modal,
  TouchableHighlight,
  StyleSheet,
} from 'react-native'

// import {SafeAreaView} from 'react-navigation'
// forceInset={{top: 'never', bottom: 'always'}}

const WARN_COLOR = '#FF3B30'

export default class ActionSheet extends PureComponent {
  static defaultProps = {
    tintColor: '#007AFF',
    buttonUnderlayColor: '#F4F4F4',
    onPress: () => {},
    styles: {}
  }

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  // get styles () {
  //   const { styles } = this.props
  //   const obj = {}
  //   Object.keys(styles2).forEach((key) => {
  //     const arr = [styles2[key]]
  //     if (styles[key]) {
  //       arr.push(styles[key])
  //     }
  //     obj[key] = arr
  //   })
  //   return obj
  // }

  show = () => {
    this.setState({visible: true})
  }

  hide = (index) => {
    this.setState({visible: false}, () => {
      this.props.onPress(index)
    })
  }

  _cancel = () => {
    const { cancelButtonIndex } = this.props
    // 保持和 ActionSheetIOS 一致，
    // 未设置 cancelButtonIndex 时，点击背景不隐藏 ActionSheet
    if (typeof cancelButtonIndex != 'undefined') {
      this.hide(cancelButtonIndex)
    }
  }

  _renderTitle () {
    const { title } = this.props
    if (!title) return null
    return (
      <View style={styles.titleBox}>
        {React.isValidElement(title) ? title : (
          <Text style={styles.titleText}>{title}</Text>
        )}
      </View>
    )
  }

  _renderMessage () {
    const { message } = this.props
    if (!message) return null
    return (
      <View style={styles.messageBox}>
        {React.isValidElement(message) ? message : (
          <Text style={styles.messageText}>{message}</Text>
        )}
      </View>
    )
  }

  _renderCancelButton () {
    const { options, cancelButtonIndex } = this.props
    if (typeof cancelButtonIndex == 'undefined') return null
    return this._createButton(options[cancelButtonIndex], cancelButtonIndex)
  }

  _createButton (title, index) {
    const { buttonUnderlayColor, cancelButtonIndex, destructiveButtonIndex, tintColor } = this.props
    const fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor
    const buttonBoxStyle = cancelButtonIndex === index ? styles.cancelButtonBox : styles.buttonBox
    return (
      <TouchableHighlight
        key={index}
        activeOpacity={1}
        underlayColor={buttonUnderlayColor}
        style={buttonBoxStyle}
        onPress={() => this.hide(index)}
      >
        {React.isValidElement(title) ? title : (
          <Text style={[styles.buttonText, {color: fontColor}]}>{title}</Text>
        )}
      </TouchableHighlight>
    )
  }

  _renderOptions () {
    const { cancelButtonIndex } = this.props
    return this.props.options.map((title, index) => {
      return cancelButtonIndex === index ? null : this._createButton(title, index)
    })
  }

  render () {
    const { visible } = this.state
    return (
      <Modal visible={visible}
        style={styles.wrapper}
        animationType='slide'
        transparent
        onRequestClose={this._cancel}
      >
        <Text
          style={[styles.overlay]}
          onPress={this._cancel}
        />
        <View style={styles.body}>
          {this._renderTitle()}
          {this._renderMessage()}
          {this._renderOptions()}
          {this._renderCancelButton()}
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // position: 'absolute',
    // top: 0,
    // right: 0,
    // bottom: 0,
    // left: 0,
    // opacity: 0.4,
    // backgroundColor: '#000'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    // flex: 1,
    // alignSelf: 'flex-end',
    backgroundColor: '#e5e5e5'
  },
  titleBox: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  titleText: {
    color: '#757575',
    fontSize: 14
  },
  messageBox: {
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  messageText: {
    color: '#9a9a9a',
    fontSize: 12
  },
  buttonBox: {
    height: 50,
    marginTop: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  buttonText: {
    fontSize: 18
  },
  cancelButtonBox: {
    height: 50,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
})
