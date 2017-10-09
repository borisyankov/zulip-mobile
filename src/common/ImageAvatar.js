/* @flow */
import React, { PureComponent } from 'react';
import { ImageBackground } from 'react-native';

import { nullFunction } from '../nullObjects';
import { Touchable } from './';

type Props = {
  avatarUrl: string,
  size: number,
  shape: string,
  children: React.ChildrenArray<any>,
  onPress?: () => void,
};

export default class ImageAvatar extends PureComponent<Props> {
  props: Props;

  static defaultProps = {
    onPress: nullFunction,
  };

  render() {
    const { avatarUrl, children, size, shape, onPress } = this.props;
    const touchableStyle = {
      height: size,
      width: size,
    };

    const borderRadius =
      shape === 'rounded' ? size / 8 : shape === 'circle' ? size / 2 : shape === 'square' ? 0 : 0;

    return (
      <Touchable onPress={onPress} style={touchableStyle}>
        <ImageBackground
          style={touchableStyle}
          source={{ uri: avatarUrl }}
          resizeMode="cover"
          borderRadius={borderRadius}
        >
          {children}
        </ImageBackground>
      </Touchable>
    );
  }
}
