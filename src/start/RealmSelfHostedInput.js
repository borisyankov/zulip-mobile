/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';

import { Input } from '../common';

const componentStyles = StyleSheet.create({
  input: {
    flex: 1,
  },
});

export default class RealmSelfHostedInput extends PureComponent {
  render() {
    const { onChangeText, onSubmitEditing } = this.props;

    return (
      <Input
        style={componentStyles.field}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Server URL"
        onChangeText={onChangeText}
        blurOnSubmit={false}
        keyboardType="url"
        onSubmitEditing={onSubmitEditing}
      />
    );
  }
}
