/* @flow */
import React, { PureComponent } from 'react';
import TitleSpecial from './TitleSpecial';

type Props = {
  color: string,
};

export default class TitleHome extends PureComponent<Props> {
  props: Props;

  static contextTypes = {
    styles: () => null,
  };

  render() {
    const { color } = this.props;

    return <TitleSpecial narrow={[{ operand: 'home' }]} color={color} />;
  }
}
