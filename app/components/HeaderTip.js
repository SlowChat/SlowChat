import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


type Props = {};
export default class HeaderTip extends Component<Props> {
  render() {
    console.log(this.props.tip);
    return (
      <View style={styles.container}>
        <Text style={styles.tip}>
          {this.props.tip}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  tip: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#8E8E93',
  },
});
