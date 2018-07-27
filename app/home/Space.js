import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import TopTab from '../components/TopTab'
import HeaderTip from '../components/HeaderTip'

const ITEMS = [{id: 0, name: '最新发布'}, {id: 1, name: '热门'}]


type Props = {};
export default class App extends Component<Props> {
  state = {
    activeTab: 0,
  }
  tabSwitch = (index) => {
    this.setState({
      activeTab: index
    })
  }
  render() {

    const { activeTab } = this.state
    return (
      <View style={styles.container}>
        <HeaderTip tip="发送的邮件提交时选择公开，会在漫友圈显示" />
        <TopTab index={activeTab} items={ITEMS} onPress={this.tabSwitch} />

      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    fontFamily: 'PingFangSC-Regular',
  },
  tipWrap: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tip: {
    height: 17,
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 17,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
