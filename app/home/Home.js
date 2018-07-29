import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  Button,
  PixelRatio
} from 'react-native';

import Swiper from '../components/Swiper'
import HomeItem from '../components/HomeItem'

import HomeList from '../components/HomeList'

const onePx = 1 / PixelRatio.get()

type Props = {};
export default class App extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: params.header || null
    }
  }
  componentDidMount() {

  }

  handleScroll = (e) => {
    return
    if (this.hasHeader) {
      this.hasHeader = false
      this.props.navigation.setParams({
        header: null
      })
    } else if (!this.hasHeader) {
      this.hasHeader = true
      this.props.navigation.setParams({
        header: <Text>'首页'</Text>
      })
    }
  }
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
  handleScroll = () => {

  }
  handleLoadmore = () => {

  }
  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    return (
      <FlatList
        style={styles.flatlist}
        ref={(flatList)=>this._flatList = flatList}
        data={data}
        renderItem={(item) => <HomeItem item={item} />}
        initialNumToRender={10}
        keyExtractor={(item, index) => item.key + ''}
        onScroll={this.handleScroll}
        onEndReachedThreshold={3}
        onEndReached={this.handleLoadmore}
        ListHeaderComponent={() => (<View>
          <Swiper />
          {this.renderTip()}
        </View>)}
      />
    )
    return (
      <ScrollView style={styles.container} onScroll={this.handleScroll}>
        <Swiper />
        {this.renderTip()}
        <View style={styles.itemWrap}>
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
          <HomeItem />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  itemWrap: {
    backgroundColor: '#F6F6F6',
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
