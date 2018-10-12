import React, { Component } from 'react';

import { Image } from 'react-native'

export default class CustomeImage extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.src !== this.props.src) {
      return false
    }
    return false
  }
  render() {
    const { src } = this.props
    return <Image source={{uri: src}} style={{width: 300, height: 300 }} />
  }
}