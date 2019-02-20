/* @flow strict-local */
import { connect } from 'react-redux';

import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';

import type { GlobalState, User } from '../types';
import { getCurrentRealm } from '../selectors';
import ImageAvatar from './ImageAvatar';
import { getFullUrl } from '../utils/url';
import { getGravatarFromEmail } from '../utils/avatar';
import PresenceStatusIndicator from './PresenceStatusIndicator';

const componentStyles = StyleSheet.create({
  status: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
});

type PropsFromConnect = {|
  realm: string,
|};

type Props = {|
  ...PropsFromConnect,
  user: User,
  size: number,
  shape: 'square' | 'rounded' | 'circle',
  onPress?: () => void,
|};

/**
 * Renders a user's avatar incuding their presence indicator
 *
 * @prop [avatarUrl] - Absolute or relative url to an avatar image.
 * @prop [email] - User's' email address, to calculate Gravatar URL if not given `avatarUrl`.
 * @prop [name] - User's full name.
 * @prop [size] - Sets width and height in pixels.
 * @prop [shape] - One of 'square', 'rounded', 'circle'.
 * @prop [onPress] - Event fired on pressing the component.
 */
class Avatar extends PureComponent<Props> {
  static defaultProps = {
    size: 32,
    realm: '',
    shape: 'rounded',
  };

  render() {
    const { user, size, onPress, realm, shape } = this.props;
    const fullAvatarUrl =
      typeof user.avatar_url === 'string'
        ? getFullUrl(user.avatar_url, realm)
        : getGravatarFromEmail(user.email);

    return (
      <ImageAvatar avatarUrl={fullAvatarUrl} size={size} onPress={onPress} shape={shape}>
        <PresenceStatusIndicator style={componentStyles.status} email={user.email} hideIfOffline />
      </ImageAvatar>
    );
  }
}

export default connect((state: GlobalState) => ({
  realm: getCurrentRealm(state),
}))(Avatar);
