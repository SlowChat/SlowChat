import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

export default class AvatarHeader extends Component {
  handleReply = () => {

  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} />
        <TouchableWithoutFeedback>
          <Text style={styles.btn}>回复</Text>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingLeft: 15,
    flexDirection: 'row',
    fontFamily: 'PingFangSC-Regular',
  },
  input: {
    font-size:15,
    color: '#B4B4B4',
    width:300,
    height:32,
    backgroundColor:'rgba(246,246,246,1)',
    borderRadius:18,
  },
  btn: {
    fontSize: 16,
    color: '#999999',
  }
});
