import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ICONS = {
  back: require('../images/icon_back.png'),
}

type Props = {};
export default class HomeItem extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.back} source={ICONS.back} />
        <Text style={styles.title}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
  },
  title {

  },
});
