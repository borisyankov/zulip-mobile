/* @flow strict-local */

import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';

import type { InjectedDispatch } from '../types';
import { connect } from '../react-redux';
import { getCurrentRealm } from '../selectors';
import UserAvatar from './UserAvatar';
import { getAvatarUrl } from '../utils/avatar';
import PresenceStatusIndicator from './PresenceStatusIndicator';

const styles = StyleSheet.create({
  status: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
});

type OwnProps = {|
  avatarUrl: string | null,
  email: string,
  size: number,
  shape: 'rounded' | 'square',
  onPress?: () => void,
|};

type SelectorProps = {|
  realm: string,
|};

type Props = {|
  ...InjectedDispatch,
  ...OwnProps,
  ...SelectorProps,
|};

/**
 * Renders a user avatar with a PresenceStatusIndicator in the corner
 *
 * @prop [avatarUrl] - Absolute or relative url to an avatar image.
 * @prop [email] - User's' email address, to calculate Gravatar URL if not given `avatarUrl`.
 * @prop [size] - Sets width and height in pixels.
 * @prop [realm] - Current realm url, used if avatarUrl is relative.
 * @prop [shape] - 'rounded' (default) means a square with rounded corners.
 * @prop [onPress] - Event fired on pressing the component.
 */
class UserAvatarWithPresence extends PureComponent<Props> {
  static defaultProps = {
    avatarUrl: '',
    email: '',
    size: 32,
    realm: '',
    shape: 'rounded',
  };

  render() {
    const { avatarUrl, email, size, onPress, realm, shape } = this.props;
    const fullAvatarUrl = getAvatarUrl(avatarUrl, email, realm);

    return (
      <UserAvatar avatarUrl={fullAvatarUrl} size={size} onPress={onPress} shape={shape}>
        <PresenceStatusIndicator style={styles.status} email={email} hideIfOffline />
      </UserAvatar>
    );
  }
}

export default connect((state): SelectorProps => ({
  realm: getCurrentRealm(state),
}))(UserAvatarWithPresence);
