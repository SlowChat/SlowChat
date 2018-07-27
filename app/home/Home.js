import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  PixelRatio
} from 'react-native';

import HomeItem from '../components/HomeItem'
// import Swiper from 'react-native-swiper2';

const onePx = 1 / PixelRatio.get()

type Props = {};
export default class App extends Component<Props> {
  // renderDot() {
  //   return (<View style={{
  //       backgroundColor:'#999999',
  //       width: 13,
  //       height: 13,
  //       borderRadius: 7,
  //       borderColor: "#eee",
  //       marginLeft: 7,
  //       marginRight: 7,
  //       shadowColor: "#000000",
  //       shadowOpacity: 0.8,
  //       shadowRadius: 2,
  //       shadowOffset: {
  //         height: 1,
  //         width: 0
  //       }}} />)
  // }
  // renderActiveDot() {
  //   return (<View style={{
  //     backgroundColor: '#4d7bd6',
  //     width: 13,
  //     height: 13,
  //     borderRadius: 7,
  //     marginLeft: 7,
  //     marginRight: 7,
  //     shadowColor: "#000000",
  //     shadowOpacity: 0.8,
  //     shadowRadius: 2,
  //     shadowOffset: {
  //       height: 1,
  //       width: 0
  //     }
  //   }} />)
  // }
  // renderSwiper() {
  //   const dot = this.renderDot()
  //   const activeDot = this.renderActiveDot()
  //   // const { images = [] } = this.state
  //   const images = [
  //     'https://img.alicdn.com/imgextra/i2/1115488308/TB2VEOeCeGSBuNjSspbXXciipXa_!!1115488308-0-item_pic.jpg_760x760Q50s50.jpg',
  //     'https://img.alicdn.com/imgextra/i1/1115488308/TB2xxQfXjfguuRjy1zeXXb0KFXa_!!1115488308.jpg_760x760Q50s50.jpg',
  //   ]
  //   const marginBottom = Platform.OS === 'android'? 125 : 100
  //   return (
  //     <Swiper style={styles.swiperWrapper}
  //       dot={dot}
  //       activeDot={activeDot}
  //       paginationStyle={{ bottom: 150 }}
  //       loop={true}>
  //       {images.map((item, index) => (
  //         <View style={[styles.swiperSlide, { marginBottom: marginBottom }]} key={'preview_image_'+index}>
  //             <Image style={[styles.swiperImage]} source={{uri:item}}></Image>
  //         </View>
  //       ))}
  //     </Swiper>
  //   )
  // }

  renderTip() {
    return (
      <View style={styles.tipWraper}>
        <View style={styles.tipHeader}><Text style={styles.tipHeaderTxt}>回到未来</Text></View>
        <View>
          <Text style={styles.tip}>给未来的自己写封信吧，给自己炖一碗鸡汤</Text>
          <Text style={styles.tip}>让若干年后的自己回味一下</Text>
        </View>
      </View>
    )
  }
  render() {
    // {this.renderSwiper()}

    return (
      <View style={styles.container}>
        {this.renderTip()}
        <Button title="测试" onPress={() => {
            this.props.navigation.navigate('SendMail')
          }}></Button>
        <HomeItem />
        <HomeItem />
        <HomeItem />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },

  // swiperWrapper: {
  //   backgroundColor: '#fff',
  // },
  // swiperSlide: {
  //   flex: 1,
  //   backgroundColor: 'transparent',
  // },
  // swiperImage: {
  //   flex:1,
  //   resizeMode:'contain'
  // },

  tipWraper: {
    marginTop: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: 29,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 7,
    borderBottomWidth: onePx,
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
