import React, {Component} from 'react';
import {
  StyleSheet,
  FlatList
} from 'react-native';

type Props = {};

import HomeItem from './HomeItem'

export default class HomeList extends Component<Props> {

  _flatList;

  _renderItem = (item) => {
    return
  }

  render() {
    let data = [];
    for (let i = 0; i < 100; i++) {
        data.push({key: i, title: i + ''});
    }
    return (
      <FlatList
        ref={(flatList)=>this._flatList = flatList}
        renderItem={(item) => <HomeItem key={item.key} item={item} />}
        data={data}
      />
    );
  }
}
