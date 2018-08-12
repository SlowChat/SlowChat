import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';


const ICONS = {
  clock: require('../images/icon_clock.png'),
  inform: require('../images/icon_inform.png'),
  forward: require('../images/icon_forward.png'),
}

export default class User extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '用户反馈',
    }
  }
  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>问题与意见</Text>
        <TextInput
          style={styles.textArea}
          onChangeText={(text) => this.setState({text})}
          placeholder='请填写10个字以上的问题描述以便我们提供更好的帮助'
          value=''
        />
        <Text style={styles.label}>联系方式</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({text})}
          placeholder='选填，便于我们与您联系'
          value=''
        />
        <TouchableWithoutFeedback>
          <View style={styles.save}>
            <Text style={styles.saveTxt}>绑定</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  label: {
    marginTop: 30,
    marginBottom: 15,
    paddingLeft: 15,
    color: '#999',
  },
  textArea: {
    height: 200,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  input: {
    height: 44,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  save: {
    width: '80%',
    height: 50,
    marginLeft: '10%',
    marginTop: 50,
    borderRadius: 25,
    backgroundColor: '#E24B92',
    alignItems:'center',
    justifyContent: 'center',
  },
  saveTxt: {
    color: '#fff',
    fontSize: 18,
  },
});
