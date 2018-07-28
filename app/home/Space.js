import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import TopTab from '../components/TopTab'
import HeaderTip from '../components/HeaderTip'

const ITEMS = [{id: 0, name: '最新发布'}, {id: 1, name: '热门'}]

import SearchBox from '../components/SearchBox'
import HomeList from '../components/HomeList'

type Props = {};
export default class Space extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: () => <SearchBox onPress={params.searchBoxPress} />
    }
  }

  state = {
    activeTab: 0,
  }
  componentDidMount() {
    this.props.navigation.setParams({
      searchBoxPress: () => {

      }
    })
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
        <HomeList />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
