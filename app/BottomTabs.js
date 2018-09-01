import React, {Component} from 'react';
import { StyleSheet, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

// import LoginScreen from './login/Login'
import HomeScreen from './home/Home'
// import SpaceScreen from './home/Space'
// import NewScreen from './home/New'
// import ShareScreen from './home/Share'
// import MimeScreen from './user/User'

// const HomeStack = createStackNavigator({
//   Home: HomeScreen,
//   // Login: LoginScreen,
// })
// const SpaceStack = createStackNavigator({
//   Space: require('./home/Space').default,
// })
const MimeStack = createStackNavigator({
  Mime: require('./user/User').default,
}, {
  navigationOptions: {
    headerBackTitleVisible: false,
    headerTintColor: '#E24B92',
    headerStyle: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitleContainerStyle: {
      justifyContent: 'center',
    },
    // headerLayoutPreset: 'center',
    headerTitleStyle: {
      fontSize: 18,
      fontFamily: 'PingFangSC-Regular',
      color: '#333',
      alignSelf: "center",
    },
  }
})

export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon:({focused,tintColor}) => (
          <Image style={styles.icon} source={
              focused ? require('./images/home_p.png') : require('./images/home_w.png')
          }/>
        )
      },
    },
    Space: {
      screen: require('./home/Space').default,
      navigationOptions: {
        tabBarIcon:({focused,tintColor}) => (
          <Image style={styles.icon} source={
              focused ? require('./images/space_p.png') : require('./images/space_w.png')
          }/>
        )
      },
    },
    NewTab: {
      screen: require('./home/Null').default,
      navigationOptions: {
        tabBarIcon:({focused,tintColor}) => (
          <Image style={styles.icon} source={require('./images/new.png')}/>
        )
      },
    },
    ShareTab: {
      screen: require('./home/Null').default,
      navigationOptions: {
        tabBarIcon:({focused,tintColor}) => (
          <Image style={styles.icon} source={
              focused ? require('./images/share_p.png') : require('./images/share_w.png')
          }/>
        )
      },
    },
    Mime: {
      screen: MimeStack,
      // lazy: true,
      navigationOptions: {
        tabBarIcon:({focused,tintColor}) => (
          <Image style={styles.icon} source={
              focused ? require('./images/person_p.png') : require('./images/person_w.png')
          }/>
        )
      },
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: ({ navigation }) => ({
      title: '',
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
      showLabel: false,
      style: {
        height: 50,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#EEEEEE',
     },
    },
  }
);

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    // marginBottom: -15,
  },
});
