import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';

import { post } from '../utils/request'

import ICONS from '../utils/icon'

export default class About extends Component {
  static navigationOptions = {
    title: '关于慢邮',
  }
  state = {
    articleList: []
  }
  componentWillMount() {
    this.fetchData()
  }

  async fetchData() {
    try {
      const res = await post('api/common/articleList.html')
      console.log(res);
      if (res.code == 1) {
        this.setState({ articleList: res.data || [] })
      }
    } catch (e) {

    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { articleList } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.link}>
          <TouchableWithoutFeedback onPress={() => navigate('Rule')}>
            <View style={styles.menu}>
              <Text style={styles.label}>积分规则</Text>
              <Image style={styles.forward} source={ICONS.forward} />
            </View>
          </TouchableWithoutFeedback>
          {
            articleList.map(item => {
              return <TouchableWithoutFeedback key={item.id} onPress={() => navigate('LocalWebview', {source: 'article', id: item.id})}>
                <View style={styles.menu}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={styles.label}>{item.post_title}</Text>
                  <Image style={styles.forward} source={ICONS.forward} />
                </View>
              </TouchableWithoutFeedback>
            })
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  link: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  menu: {
    flexDirection: 'row',
    height: 44,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderBottomColor: '#eee',
    alignItems:'center',
  },
  forward: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  label: {
    flex: 1,
    color: '#666'
  },

});


// <TouchableWithoutFeedback onPress={() => navigate('LocalWebview', {source: 'protocal'})}>
//   <View style={styles.menu}>
//     <Text style={styles.label}>网站软件许可协议</Text>
//     <Image style={styles.forward} source={ICONS.forward} />
//   </View>
// </TouchableWithoutFeedback>

// <TouchableWithoutFeedback onPress={() => navigate('LocalWebview', {source: 'faq'})}>
//   <View style={styles.menu}>
//     <Text style={styles.label}>常见问题</Text>
//     <Image style={styles.forward} source={ICONS.forward} />
//   </View>
// </TouchableWithoutFeedback>
