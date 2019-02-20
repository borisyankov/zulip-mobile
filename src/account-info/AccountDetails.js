/* @flow strict-local */
import React, { PureComponent } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

import type { Dispatch, User } from '../types';
import { Avatar, ComponentList, RawLabel, ZulipButton } from '../common';
import { IconPrivateChat } from '../common/Icons';
import { privateNarrow } from '../utils/narrow';
import PresenceStatusIndicator from '../common/PresenceStatusIndicator';
import ActivityText from '../title/ActivityText';
import { getMediumAvatar } from '../utils/avatar';
import { nowInTimeZone } from '../utils/date';
import { doNarrow } from '../actions';
import styles from '../styles';

const componentStyles = StyleSheet.create({
  componentListItem: {
    alignItems: 'center',
  },
  statusWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

type Props = {|
  dispatch: Dispatch,
  user: User,
|};

export default class AccountDetails extends PureComponent<Props, void> {
  handleChatPress = () => {
    const { user, dispatch } = this.props;
    dispatch(doNarrow(privateNarrow(user.email)));
  };

  render() {
    const { user } = this.props;
    const screenWidth = Dimensions.get('window').width;

    return (
      <View>
        <Avatar user={user} size={screenWidth} shape="square" />
        <ComponentList outerSpacing itemStyle={componentStyles.componentListItem}>
          <View style={componentStyles.statusWrapper}>
            <PresenceStatusIndicator email={user.email} hideIfOffline={false} />
            <RawLabel style={[styles.largerText, styles.halfMarginLeft]} text={user.email} />
          </View>
          <View>
            <ActivityText style={styles.largerText} email={user.email} />
          </View>
          {user.timezone ? (
            <View>
              <RawLabel
                style={styles.largerText}
                text={`${nowInTimeZone(user.timezone)} Local time`}
              />
            </View>
          ) : null}
          <ZulipButton
            text="Send private message"
            onPress={this.handleChatPress}
            Icon={IconPrivateChat}
          />
        </ComponentList>
      </View>
    );
  }
}
