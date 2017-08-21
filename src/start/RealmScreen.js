/* @flow */
import React, { PureComponent } from 'react';
import { ScrollView, View, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import type { Actions } from '../types';
import boundActions from '../boundActions';
import { Screen, ErrorMsg, ZulipButton } from '../common';
import { getServerSettings } from '../api';
import { fixRealmUrl } from '../utils/url';
import RealmPicker from './RealmPicker';

type Props = {
  actions: Actions,
};

type State = {
  realm: string,
  error: ?string,
  progress: boolean,
};

const componentStyles = StyleSheet.create({
  container: {},
});

class RealmScreen extends PureComponent {
  static contextTypes = {
    styles: () => null,
  };

  props: Props;
  state: State;
  scrollView: ScrollView;

  state = {
    progress: false,
    realm: '',
    error: undefined,
  };

  tryRealm = async () => {
    const { realm } = this.state;
    const fixRealm = fixRealmUrl(realm);
    this.setState({
      realm: fixRealm,
      progress: true,
      error: undefined,
    });

    const { actions } = this.props;

    try {
      const serverSettings = await getServerSettings({ realm: fixRealm });

      actions.realmAdd(fixRealm);
      actions.navigateToAuth(serverSettings.authentication_methods);
      Keyboard.dismiss();
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ progress: false });
    }
  };

  render() {
    const { styles } = this.context;
    const { progress, realm, error } = this.state;

    return (
      <Screen title="Welcome" keyboardAvoiding>
        <ScrollView
          contentContainerStyle={styles.container}
          centerContent
          keyboardShouldPersistTaps="always"
        >
          <View style={[styles.container, componentStyles.container]}>
            <RealmPicker onChangeText={value => this.setState({ realm: value })} />
            <ZulipButton text="Enter" progress={progress} onPress={this.tryRealm} />
            {error && <ErrorMsg error={error} />}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(null, boundActions)(RealmScreen);
