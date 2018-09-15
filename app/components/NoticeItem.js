import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

type Props = {};
export default class MsgItem extends PureComponent<Props> {
  handlePress = () => {
    const { onPress, data } = this.props
    onPress && onPress(data.item.id)
  }
  render() {
    const { item } = this.props.data
    return (
      <TouchableWithoutFeedback>
        <View style={styles.container} onPress={this.handlePress}>
          <View style={styles.left}>
            <Text style={styles.desc}>
              {item.desc}：
            </Text>
            <Text style={styles.content}>
              {item.content}
            </Text>
          </View>
          <Text style={styles.time}>{item.add_time}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  left: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
    lineHeight: 22,
    marginRight: 15,
  },
  desc: {
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#333333',
    lineHeight: 22,
    marginRight: 15,
  },
  time: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#B4B4B4',
  }
});
