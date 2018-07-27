
import React, {Component} from 'react';
import {Platform, StyleSheet, Image, Text, View} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import Home from './Home'
import Space from './Space'
import Share from './Share'
import Mime from './Mime'

const ICONS = {
  home_p: require('../../images/home_p.png'),
  home_w: require('../../images/home_w.png'),
  space_p: require('../../images/space_p.png'),
  space_w: require('../../images/space_w.png'),
  new: require('../../images/new.png'),
  share_p: require('../../images/share_p.png'),
  share_w: require('../../images/share_w.png'),
  person_p: require('../../images/person_p.png'),
  person_w: require('../../images/person_w.png'),
}

type Props = {};


export default class App extends Component<Props> {
  state = {
    selectedTab: 1
  }
  render() {
    return (
        <TabNavigator tabBarStyle={styles.wraper}>
          <TabNavigator.Item
              selected={this.state.selectedTab === 0}
              renderIcon={() => <Image style={styles.icon} source={ICONS.home_w} />}
              renderSelectedIcon={() => <Image style={styles.icon} source={ICONS.home_p} />}
              onPress={() => this.setState({ selectedTab: 0 })}>
              <Home />
          </TabNavigator.Item>
          <TabNavigator.Item
              selected={this.state.selectedTab === 1}
              renderIcon={() => <Image style={styles.icon} source={ICONS.space_w} />}
              renderSelectedIcon={() => <Image style={styles.icon} source={ICONS.space_p} />}
              onPress={() => this.setState({ selectedTab: 1 })}>
              <Space/>
          </TabNavigator.Item>
          <TabNavigator.Item
              selected={this.state.selectedTab === 2}
              renderIcon={() => <Image style={styles.icon} source={ICONS.new} />}
              renderSelectedIcon={() => <Image style={styles.icon} source={ICONS.new} />}
              onPress={() => this.setState({ selectedTab: 2 })}>
          </TabNavigator.Item>
          <TabNavigator.Item
              selected={this.state.selectedTab === 3}
              renderIcon={() => <Image style={styles.icon} source={ICONS.share_w} />}
              renderSelectedIcon={() => <Image style={styles.icon} source={ICONS.share_p} />}
              onPress={() => this.setState({ selectedTab: 3 })}>
              <Share />
          </TabNavigator.Item>
          <TabNavigator.Item
              selected={this.state.selectedTab === 4}
              renderIcon={() => <Image style={styles.icon} source={ICONS.person_w} />}
              renderSelectedIcon={() => <Image style={styles.icon} source={ICONS.person_p} />}
              onPress={() => this.setState({ selectedTab: 4 })}>
              <Mime />
          </TabNavigator.Item>
        </TabNavigator>
    );
  }
}


const styles = StyleSheet.create({
  wraper: {
    height: 50,
    backgroundColor: '#fff',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: -10,
  },
});
