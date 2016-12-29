import React from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import MainTabBar from './MainTabBar';
import HomeTab from './HomeTab';
import StreamListContainer from '../streamlist/StreamListContainer';
import UserListContainer from '../userlist/UserListContainer';
import AccountContainer from '../account-info/AccountContainer';

export default class MainScreen extends React.Component {
  render() {
    const { doNarrow } = this.props;

    return (
      <ScrollableTabView
        renderTabBar={() => <MainTabBar />}
      >
        <HomeTab doNarrow={doNarrow} />
        <StreamListContainer doNarrow={doNarrow} />
        <UserListContainer doNarrow={doNarrow} />
        <AccountContainer />
      </ScrollableTabView>
    );
  }
}
