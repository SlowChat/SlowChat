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
          <Image style={styles.icon} source={require('../images/icon_time.png')} />
          <Text style={styles.content}>
            {item.content}
          </Text>
          <Text style={styles.time}>{item.add_time}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  icon: {
    width: 20,
    height: 20,
  },
  content: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
    color: '#666666',
    lineHeight: 22,
    marginLeft: 10,
    marginRight: 15,
  },
  time: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    color: '#B4B4B4',
  }
});
