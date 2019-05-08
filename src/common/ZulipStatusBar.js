/* @flow strict-local */

import React, { PureComponent } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import Color from 'color';

import type { Dimensions, Narrow, Orientation, ThemeName, InjectedDispatch } from '../types';
import { connect } from '../react-redux';
import { DEFAULT_TITLE_BACKGROUND_COLOR, getTitleBackgroundColor } from '../title/titleSelectors';
import { foregroundColorFromBackground } from '../utils/color';
import { getSession, getSettings } from '../selectors';

type BarStyle = $PropertyType<$PropertyType<StatusBar, 'props'>, 'barStyle'>;

export const getStatusBarColor = (backgroundColor: string, theme: ThemeName): string =>
  backgroundColor === DEFAULT_TITLE_BACKGROUND_COLOR
    ? theme === 'night'
      ? '#212D3B'
      : 'white'
    : backgroundColor;

export const getStatusBarStyle = (statusBarColor: string): BarStyle =>
  foregroundColorFromBackground(statusBarColor) === 'white' /* force newline */
    ? 'light-content'
    : 'dark-content';

type OwnProps = {|
  backgroundColor?: string,
  hidden: boolean,
  narrow?: Narrow,
|};

type SelectorProps = {|
  theme: ThemeName,
  noBackground: boolean,
  backgroundColor: string,
  safeAreaInsets: Dimensions,
  orientation: Orientation,
|};

type Props = {|
  ...InjectedDispatch,
  ...OwnProps,
  ...SelectorProps,
|};

/**
 * Controls the status bar settings depending on platform
 * and current navigation position.
 * If narrowed to a stream or topic the color of the status bar
 * matches that of the stream.
 *
 * @prop [narrow] - Currently active narrow.
 * @prop [narrow] - If true, renders as black.
 */
class ZulipStatusBar extends PureComponent<Props> {
  static defaultProps = {
    hidden: false,
    noBackground: false,
  };

  render() {
    const {
      theme,
      backgroundColor,
      hidden,
      noBackground,
      safeAreaInsets,
      orientation,
    } = this.props;
    const style = { height: hidden ? 0 : safeAreaInsets.top, backgroundColor };
    const statusBarColor = getStatusBarColor(noBackground ? 'black' : backgroundColor, theme);

    return (
      orientation === 'PORTRAIT' && (
        <View style={style}>
          <StatusBar
            animated
            showHideTransition="slide"
            hidden={hidden && Platform.OS !== 'android'}
            backgroundColor={Color(statusBarColor).darken(0.1)}
            barStyle={getStatusBarStyle(statusBarColor)}
          />
        </View>
      )
    );
  }
}

export default connect((state, props: OwnProps): SelectorProps => ({
  safeAreaInsets: getSession(state).safeAreaInsets,
  theme: getSettings(state).theme,
  backgroundColor: getTitleBackgroundColor(props.narrow)(state),
  orientation: getSession(state).orientation,
}))(ZulipStatusBar);
