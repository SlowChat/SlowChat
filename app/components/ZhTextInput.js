import React, {PureComponent} from 'react';
import {
  TextInput,
  Platform,
} from 'react-native';

type Props = {};
export default class TopTab extends PureComponent<Props> {
  value = ''
  state = {
    value: ''
  }

  componentWillMount() {
    const { value } = this.props
    if (value) {
      this.value = value
      this.setState({ value })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value != this.value) {
      this.setValue(nextProps.value)
    }
  }

  handleChangeTxt = (txt) => {
    this.value = txt
    if (Platform.OS != 'ios') {
      this.setState({ value: txt })
    }
    this.handleChange()
  }

  setValue(val = '') {
    this.value = val
    if (this.state.value == val) return
    if (Platform.OS == 'ios') {
      this.setState({ value: this.value }, () => {
        this.setState({ value: val })
      })
    } else {
      this.setState({ value: val })
    }
  }

  handleEndEditing = (e) => {
    this.value = e.nativeEvent.text
    this.handleChange()
  }

  handleChange = () => {
    const { onChange } = this.props
    onChange && onChange(this.value)
  }

  render() {
    const { style, autoFocus, placeholder, placeholderTextColor } = this.props
    return <TextInput
      style={style}
      value={this.state.value}
      autoFocus={autoFocus}
      autoCapitalize="none"
      underlineColorAndroid='transparent'
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      onChangeText={this.handleChangeTxt}
      onEndEditing={this.handleEndEditing}
    />
  }
}
