import React, {Component} from 'react';
import { StyleSheet, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen from './home/Home'
import SpaceScreen from './home/Space'
import NewScreen from './home/New'
import ShareScreen from './home/Share'
// import MimeScreen from './home/Mime'
import MimeScreen from './user/User'

const ICONS = {
  Home: {
    p: require('./images/home_p.png'),
    w: require('./images/home_w.png'),
  },
  Space: {
    p: require('./images/space_p.png'),
    w: require('./images/space_w.png'),
  },
  NewTab: require('./images/new.png'),
  ShareTab: {
    p: require('./images/share_p.png'),
    w: require('./images/share_w.png'),
  },
  Mime: {
    p: require('./images/person_p.png'),
    w: require('./images/person_w.png'),
  }
}


const HomeStack = createStackNavigator({
  Home: HomeScreen
})
const SpaceStack = createStackNavigator({
  Space: SpaceScreen
})
const MimeStack = createStackNavigator({
  Mime: MimeScreen
}, {
  navigationOptions: {
    headerBackTitleVisible: false,
    headerTintColor: '#E24B92',
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontSize: 18,
      fontFamily: 'PingFangSC-Regular',
      color: '#333'
    },
  }
})


export default createBottomTabNavigator(
  {
    Home: HomeStack,
    Space: SpaceStack,
    NewTab: NewScreen,
    ShareTab: ShareScreen,
    Mime: MimeStack,
  },
  {
    initialRouteName: 'Home',
    // lazy:true,
    navigationOptions: ({ navigation }) => ({
      title: '',
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let icon = ICONS[routeName]
        if (routeName !== 'NewTab') {
          icon = focused ? ICONS[routeName].p : ICONS[routeName].w
        }
        return <Image style={styles.icon} source={icon} />;
      },
      tabBarOnPress: ({navigation, defaultHandler}) => {
        const { routeName } = navigation.state;
        if (routeName == 'NewTab') {
          navigation.navigate('NewMail')
        } else if (routeName == 'ShareTab') {
          navigation.navigate('Share')
        } else {
          defaultHandler && defaultHandler()
        }
      }
    }),
    tabBarOptions: {
      style: {
        height: 50,
        backgroundColor: '#fff',
     },
    },
  }
);

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    marginBottom: -15,
  },
});
