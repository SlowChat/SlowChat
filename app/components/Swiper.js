import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform
} from 'react-native';

import Swiper from 'react-native-swiper';

const IMGS = [
  'https://img.alicdn.com/bao/uploaded/i1/TB2Xy7fquySBuNjy1zdXXXPxFXa_!!0-paimai.jpg',
  'https://img.alicdn.com/bao/uploaded/i3/TB2Hhn4quSSBuNjy0FlXXbBpVXa_!!0-paimai.jpg'
]
type Props = {};
export default class App extends PureComponent<Props> {
  static defaultProps = {
    items: IMGS
  };
  render() {
    const dot = (<View style={styles.dot} />)
    const activeDot = (<View style={[styles.dot, styles.activeDot]} />)
    const marginBottom = Platform.OS === 'android'? 125 : 500
    const { items } = this.props
    return (
      <View style={styles.wrapper} >
        <Swiper autoplay dot={dot} activeDot={activeDot}>
          {items.map((item, index) => <Image key={index} source={{uri:item}} style={styles.image} />)}
        </Swiper>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  wrapper: {
    height: 225,
  },
  image: {
    height: 225,
  },
  dot: {
    width:6,
    height:6,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
    borderRadius: 6,
    marginLeft: 3,
    marginRight: 3,
    bottom: -15,
  },
  activeDot: {
    opacity: 1,
  },
});
