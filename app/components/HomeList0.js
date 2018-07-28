import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList
} from 'react-native';


type Props = {};

import HomeItem from './HomeItem'


export default class HomeList extends Component<Props> {

  _flatList;

  _renderItem = (item) => {
    return <HomeItem item={item} />
  }

  _header = () => {
      return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是头部</Text>;
  }

  _footer = () => {
      return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是尾部</Text>;
  }

  _separator = () => {
      return <View style={{height:2,backgroundColor:'yellow'}}/>;
  }

  render() {
    var data = [];
    for (var i = 0; i < 100; i++) {
        data.push({key: i, title: i + ''});
    }

    return (
      <FlatList
         ref={(flatList)=>this._flatList = flatList}
        ListHeaderComponent={this._header}
        ListFooterComponent={this._footer}
        ItemSeparatorComponent={this._separator}
        renderItem={this._renderItem}
        data={data}
      />
    );
  }
}

const styles = StyleSheet.create({
  txt: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 30,
  }

});
