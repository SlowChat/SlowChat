import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';

export default class UserSearch extends PureComponent {
  state = {
    text: ''
  }

  onPressSearch() {
    
  }

  render() {
    const { onPress } = this.props
    return (
      <View style={styles.searchBox}>
        <TouchableWithoutFeedback onPress={() => {
            onPress && onPress()
          }}>
          <View style={{flexDirection: 'row',justifyContent: 'center',
    alignItems: 'center',}}>
            <Image style={styles.icon} source={require('../images/icon_search.png')} />
            <TextInput
              style={styles.search}
              onChangeText={(text) => this.setState({text})}
              placeholder='搜索'
              value={this.state.text}
            />
            <Text style={styles.btn} onPress={() => this.onPressSearch()}>搜索</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBox: {
    height: 44,
    fontFamily: 'PingFangSC-Regular',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 30,
    height: 30,
    zIndex: 10
  },
  search: {
    flexDirection: 'row',
    width: '87%',
    alignItems: 'center',
    paddingLeft: 35,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  btn: {
    flexDirection: 'row',
    width: '13%',
    fontSize: 16,
    textAlign: 'center',
    color: '#E24B92'
  }
});
