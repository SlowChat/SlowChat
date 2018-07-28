import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  PixelRatio
} from 'react-native';

import Swiper from '../components/Swiper'
import HomeItem from '../components/HomeItem'

const onePx = 1 / PixelRatio.get()

type Props = {};
export default class App extends Component<Props> {
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
    return (
      <View style={styles.container}>
        <Swiper />
        {this.renderTip()}

        <HomeItem />
        <HomeItem />
        <HomeItem />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  tipWraper: {
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

// <Button title="测试" onPress={() => {
//     this.props.navigation.navigate('SendMail')
//   }}></Button>
