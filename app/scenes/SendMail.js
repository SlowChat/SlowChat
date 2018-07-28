import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from 'react-native';

import HeaderTip from '../components/HeaderTip'

export default class SendMail extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '写信',
      headerRight: (
        <Button
          onPress={params.rightOnPress}
          title='发送'
          color={params.rightColor || '#F9DBE9'}
        />
      ),
    }
  }

  state = {
    sendbtnColor: '#F9DBE9'
  }
  componentDidMount() {
    this.props.navigation.setParams({
      rightOnPress: this.rightBtnOnPress
    })
  }
  rightBtnOnPress = () => {
    this.props.navigation.setParams({
      rightColor: '#FFFFFF',
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <HeaderTip tip="爱慢邮——让我们回到未来" />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
});
