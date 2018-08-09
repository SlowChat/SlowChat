import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';

import Swiper from 'react-native-swiper';

const ICONS = {
  banner: require('../images/banner_placeholder.png')
}

type Props = {};
export default class SwiperComponent extends PureComponent<Props> {
  static defaultProps = {
    items: []
  };

  render() {
    const { items, onNew } = this.props
    const dot = (<View style={styles.dot} />)
    const activeDot = (<View style={[styles.dot, styles.activeDot]} />)
    return (
      <View>
        <View style={styles.wrapper} >
          {
            !items || items.length == 0 ? <Image source={ICONS.banner} style={styles.image} /> :
            <Swiper autoplay dot={dot} activeDot={activeDot}>
              {items.map((item, index) => <Image key={index} source={{uri:item}} style={styles.image} />)}
            </Swiper>
          }

        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.tipWraper} onPress={onNew}>
          <View style={styles.tipHeader}><Text style={styles.tipHeaderTxt}>回到未来</Text></View>
          <View>
            <Text style={styles.tip}>给未来的自己写封信吧，给自己炖一碗鸡汤</Text>
            <Text style={styles.tip}>让若干年后的自己回味一下</Text>
          </View>
        </TouchableOpacity>
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
    width: 375,
    resizeMode: 'cover',
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

  tipWraper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: 30,
    paddingTop: 10,
    paddingBottom: 7,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid',
  },

  tipHeader: {
    paddingRight: 15,
  },
  tipHeaderTxt: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Medium',
    color: '#B4B4B4',
  },
  tip: {
    height: 17,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
    lineHeight: 17
  },
});
