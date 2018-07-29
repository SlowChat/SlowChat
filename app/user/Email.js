import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView
} from 'react-native';
import EmailList from '../components/EmailList'
import UserSearch from '../components/UserSearch'

export default class Email extends Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      title: '草稿箱',
      headerRight: (
        <View style={styles.icon}>
          <Text style={styles.editBtn}>编辑</Text>
        </View>
      ),
    }
  }
  componentDidMount() {

  }
  
  render() {
    return (
      <View>
        <UserSearch />
        <ScrollView style={styles.emailList}>
          <EmailList />
          <EmailList />
          <EmailList />
          <EmailList />
          <EmailList />
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editBtn: {  
    paddingRight: 15,
    color: '#666',
    fontSize: 18
  },
  emailList: {
    marginTop: 10,
  }
});

// <Button title="测试" onPress={() => {
//     this.props.navigation.navigate('SendMail')
//   }}></Button>
