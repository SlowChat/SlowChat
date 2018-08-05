import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

type Props = {};
export default class TopTab extends PureComponent<Props> {
  render() {
    const { index, items, onPress } = this.props
    if (!items || !items.length) return null
    return (
      <View style={styles.container}>
        {
          items.map((item, i) => {
            let txtWrap, txt
            if (i == index) {
              txt = [styles.txt, styles.activeTxt]
              txtWrap = [styles.txtWrap, styles.activeTxtWrap]
            } else {
              txtWrap = styles.txtWrap
              txt = styles.txt
            }
            return (<TouchableOpacity activeOpacity={0.8} style={styles.tab} key={item.id} onPress={() => {onPress && onPress(i)}}>
              <View style={txtWrap}>
                <Text style={txt}>{item.name}</Text>
              </View>
            </TouchableOpacity>)
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: 44,
    flexDirection: 'row',
    fontFamily: 'PingFangSC-Regular',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  txtWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#B4B4B4',
    borderStyle: 'solid',
    height: 28,
    textAlign: 'center'
  },
  txt: {
    color: '#B4B4B4',
  },
  activeTxtWrap: {
    borderBottomColor: '#E24B92',
  },
  activeTxt: {
    color: '#E24B92',
  },
});
