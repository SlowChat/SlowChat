import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from 'react-native';

import Swiper from 'react-native-swiper';
import ErrorTip from './ErrorTip'
import URL from '../utils/url'

type Props = {};
export default class SwiperComponent extends PureComponent<Props> {
  static defaultProps = {
    items: []
  }

  handlePress({ url = '' }) {
    const { onNav } = this.props
    if (!url || !onNav) return
    if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
      onNav('Webview', { url })
    } else if (url.indexOf('/') == 0) {
      const { uri, query } = URL.parse(url)
      onNav(uri, query)
    }
  }

  handleGoNew = () => {
    const { onNav } = this.props
    onNav && onNav('NewMail')
  }

  render() {
    const { items, showError } = this.props
    const dot = (<View style={styles.dot} />)
    const activeDot = (<View style={[styles.dot, styles.activeDot]} />)
    return (
      <View>
        <View style={styles.wrapper} >
          {
            items && items.length > 1 ?
            <Swiper autoplay autoplayTimeout={3} paginationStyle={styles.pagination} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
              {items.map((item, index) =>
                  <TouchableWithoutFeedback key={index} onPress={() => this.handlePress(item)}>
                    <Image defaultSource={require('../images/banner_placeholder.png')} source={{uri:item.image}} style={styles.image} />
                  </TouchableWithoutFeedback>
              )}
            </Swiper>
            : <Image source={require('../images/banner_placeholder.png')} style={styles.image} />
          }
        </View>
        <TouchableOpacity activeOpacity={0.6} style={styles.tipWraper} onPress={this.handleGoNew}>
          <View style={styles.tipHeader}><Text style={styles.tipHeaderTxt}>回到未来</Text></View>
          <View>
            <Text style={styles.tip}>给未来的自己写封信吧，给自己炖一碗鸡汤</Text>
            <Text style={styles.tip}>让若干年后的自己回味一下</Text>
          </View>
        </TouchableOpacity>
        { showError && <View style={styles.errorTip}><ErrorTip onPress={this.props.onError} /></View> }
      </View>
    )
  }
}

// !items || items.length == 0 ? <Image source={ICONS.banner} style={styles.image} /> :

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  wrapper: {
    // height: 225,
    ...Platform.select({                //不同的平台执行不同的样式
      ios: {
        height: 225,
      },
      android: {
        height: 205,
      },
    })
  },
  image: {
    // height: 225,
    width: width,
    resizeMode: 'cover',
    ...Platform.select({                //不同的平台执行不同的样式
      ios: {
        height: 225,
      },
      android: {
        height: 205,
      },
    })
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
