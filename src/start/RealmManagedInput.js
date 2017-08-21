/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';

import { Input } from '../common';

export default class RealmManagedInput extends PureComponent {
  render() {
    const { onChangeText } = this.props;

    return (
      <Input
        // style={styles.field}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Server URL"
        onChangeText={onChangeText}
        blurOnSubmit={false}
        keyboardType="url"
        onSubmitEditing={this.tryRealm}
      />
    );
  }
}
