import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  PixelRatio
} from 'react-native';

const onePx = 1 / PixelRatio.get()

type Props = {};
export default class TopTab extends Component<Props> {
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
            return (<TouchableWithoutFeedback onPress={() => {onPress && onPress(i)}}>
              <View key={item.id} style={styles.tab}>
                <View style={txtWrap}>
                  <Text style={txt}>{item.name}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>)
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
    borderBottomWidth: onePx,
    borderBottomColor: '#EEEEEE',
    borderStyle: 'solid',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  txtWrap: {
    borderBottomWidth: 2 * onePx,
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
