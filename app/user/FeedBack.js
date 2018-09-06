import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-easy-toast'
import { post } from '../utils/request'

export default class FeedBack extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '用户反馈',
    }
  }
  state = {
    content: '',
    contact: ''
  }
  componentDidMount() {

  }

  handleSubmit = () => {
    const { pop } = this.props.navigation;
    const { content, contact } = this.state;
    post('api/user/feedback.html', { content, contact}).then(res => {
      if (res.code == 1) {
        this.refs.toast.show(res.msg);
        setTimeout(() => {
          pop()
        }, 1000)
      }
    }).catch(e => {
      this.refs.toast.show(res.msg);
    })
  }

  render() {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
        <Text style={styles.label}>问题与意见</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid='transparent'
          multiline
          style={styles.textArea}
          onChangeText={(text) => this.setState({content: text})}
          placeholder='请填写10个字以上的问题描述以便我们提供更好的帮助'
        />
        <Text style={styles.label}>联系方式</Text>
        <TextInput
          autoCapitalize="none"
          underlineColorAndroid='transparent'
          style={styles.input}
          onChangeText={(text) => this.setState({contact: text})}
          placeholder='选填，便于我们与您联系'
        />
        <TouchableOpacity onPress={() => this.handleSubmit()}>
          <View style={styles.save}>
            <Text style={styles.saveTxt}>提交</Text>
          </View>
        </TouchableOpacity>
        <Toast ref="toast" position="center" />
      </ScrollView>
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
    textAlignVertical: 'top',
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
