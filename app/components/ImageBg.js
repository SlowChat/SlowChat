import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';

import ICONS from '../utils/icon'

export default class ImageBg extends PureComponent {
  static defaultProps = {
    defaultSource: ICONS.head,
  };
  state = {
    source: null
  }
  componentWillMount() {
    const { src, defaultSource } = this.props
    if (src) {
      this.setState({ source: { uri: src } })
    } else {
      this.setState({ source: defaultSource })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.src && nextProps.src != this.props.src) {
      this.setState({ source: { uri: nextProps.src } })
    }
  }
  handleError = () => {
    this.setState({ source: this.props.defaultSource })
  }
  render() {
    const { source } = this.state
    const { style = styles.avatar, defaultSource } = this.props
    return <Image resizeMode="cover" style={style} source={source} defaultSource={defaultSource} onError={this.handleError} />
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

// <ImageBackground resizeMode="cover" style={styles.avatar} source={ICONS.head}>
//   <Image resizeMode="cover" style={styles.avatar} source={{uri: avatar}} defaultSource={ICONS.head} />
// </ImageBackground>
