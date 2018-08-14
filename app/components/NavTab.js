import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


type Props = {};
export default class NavTab extends PureComponent<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.back} source={require('../images/icon_back.png')} />
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
