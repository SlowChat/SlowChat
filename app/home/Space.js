import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView
} from 'react-native';

import TopTab from '../components/TopTab'
import HeaderTip from '../components/HeaderTip'

const ITEMS = [{id: 0, name: '最新发布'}, {id: 1, name: '热门'}]

import SearchBox from '../components/SearchBox'
import HomeItem from '../components/HomeItem'

type Props = {};
export default class Space extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      header: () => (<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <SearchBox onPress={params.searchBoxPress} />
        </SafeAreaView>)
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
  handleScroll = () => {

  }
  handlePress = (id) => {
    this.props.navigation.push('MailDetail', {id})
  }
  handleLoadmore = () => {

  }
  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({key: i, title: i + ''});
    }
    const { activeTab } = this.state
    return (
      <View style={styles.container}>
        <HeaderTip tip="发送的邮件提交时选择公开，会在漫友圈显示" />
        <TopTab index={activeTab} items={ITEMS} onPress={this.tabSwitch} />
        <FlatList
          style={styles.flatlist}
          ref={(flatList)=>this._flatList = flatList}
          data={data}
          renderItem={(item) => <HomeItem data={item} onPress={this.handlePress} />}
          initialNumToRender={5}
          keyExtractor={(item, index) => item.key + ''}
          onScroll={this.handleScroll}
          onEndReachedThreshold={1}
          onEndReached={this.handleLoadmore}
        />

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
