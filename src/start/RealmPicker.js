/* TODO flow */
import React from 'react';
import { TabNavigator, TabBarTop } from 'react-navigation';

import { BRAND_COLOR } from '../styles';
import RealmManagedInput from './RealmManagedInput';
import RealmSelfHostedInput from './RealmSelfHostedInput';

export default TabNavigator(
  {
    hosted: {
      screen: props => <RealmManagedInput onChangeText={props.onChangeText} />,
      navigationOptions: {
        tabBarLabel: 'Managed',
      },
    },
    custom: {
      screen: props => <RealmSelfHostedInput onChangeText={props.onChangeText} />,
      navigationOptions: {
        tabBarLabel: 'Self-hosted',
      },
    },
  },
  {
    swipeEnabled: true,
    animationEnabled: true,
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    tabBarOptions: {
      upperCaseLabel: false,
      pressColor: 'white',
      labelStyle: {
        fontSize: 13,
        margin: 0,
      },
      tabStyle: {
        backgroundColor: BRAND_COLOR,
      },
    },
  },
);
