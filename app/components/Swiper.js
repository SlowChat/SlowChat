import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';

import Swiper from 'react-native-swiper';
import Loading from './Loading'
import ErrorTip from './ErrorTip'

type Props = {};
export default class SwiperComponent extends PureComponent<Props> {
  static defaultProps = {
    items: []
  }

  handlePress = () => {

  }

  render() {
    const { items, onNew, showLoading, showError } = this.props
    const dot = (<View style={styles.dot} />)
    const activeDot = (<View style={[styles.dot, styles.activeDot]} />)
    if (!items || items.length == 0) return <View style={styles.image} />
    return (
      <View>
        <View style={styles.wrapper} >
          {
            <Swiper autoplay autoplayTimeout={3} paginationStyle={styles.pagination} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
              {items.map((item, index) =>
                <ImageBackground key={index} style={styles.image} source={require('../images/banner_placeholder.png')}>
                  <Image source={{uri:item.image}} style={styles.image} />
                </ImageBackground>
              )}
            </Swiper>
          }
        </View>
        <TouchableOpacity activeOpacity={0.6} style={styles.tipWraper} onPress={onNew}>
          <View style={styles.tipHeader}><Text style={styles.tipHeaderTxt}>回到未来</Text></View>
          <View>
            <Text style={styles.tip}>给未来的自己写封信吧，给自己炖一碗鸡汤</Text>
            <Text style={styles.tip}>让若干年后的自己回味一下</Text>
          </View>
        </TouchableOpacity>
        { showLoading && <Loading /> }
        { showError && <View style={styles.errorTip}><ErrorTip onPress={this.props.onError} /></View> }
      </View>
    )
  }
}

// !items || items.length == 0 ? <Image source={ICONS.banner} style={styles.image} /> :


const styles = StyleSheet.create({
  wrapper: {
    height: 225,
  },
  image: {
    height: 225,
    width: 375,
    resizeMode: 'cover',
  },
  pagination: {
    bottom: 10,
  },
  dot: {
    width:6,
    height:6,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
    borderRadius: 6,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDot: {
    width:6,
    height:6,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    borderRadius: 6,
    marginLeft: 3,
    marginRight: 3,
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
  errorTip: {
    marginTop: -40,
  }
});
