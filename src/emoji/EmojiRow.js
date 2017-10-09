/* @flow */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { RawLabel, Touchable } from '../common';
import Emoji from '../emoji/Emoji';

const styles = StyleSheet.create({
  emojiRow: {
    flexDirection: 'row',
    padding: 2,
    alignItems: 'center',
  },
  text: {
    paddingLeft: 6,
  },
});

type Props = {
  name: string,
  onPress: () => void,
};

export default class EmojiRow extends Component<Props> {
  props: Props;

  render() {
    const { name, onPress } = this.props;
    return (
      <Touchable onPress={onPress}>
        <View style={styles.emojiRow}>
          <Emoji name={name} size={20} />
          <RawLabel style={styles.text} text={name} />
        </View>
      </Touchable>
    );
  }
}
