/* @flow */
import React from 'react';

import type { Message, DoNarrowAction, PushRouteAction } from '../types';
import Chat from '../chat/Chat';
import MainNavBar from '../nav/MainNavBar';
import SideDrawer from './SideDrawer';
import StreamSidebar from '../nav/StreamSidebar';
import ConversationsContainer from '../conversations/ConversationsContainer';

type Props = {
  messages: Message[],
  doNarrow: DoNarrowAction,
  orientation: string,
  pushRoute: PushRouteAction,
};

export default class MainScreen extends React.Component {

  props: Props;

  state: {
    leftDrawerOpen: boolean,
    rightDrawerOpen: boolean,
  };

  state = {
    leftDrawerOpen: false,
    rightDrawerOpen: false,
  };

  static navigationOptions = {
    title: 'Welcome',
  };

  render() {
    const { messages, orientation, doNarrow, navigateToAllStreams, navigateToUsers, navigateToSearch } = this.props;
    const { leftDrawerOpen, rightDrawerOpen } = this.state;

    return (
      <SideDrawer
        side="left"
        open={leftDrawerOpen}
        orientation={orientation}
        onOpenStart={() => this.setState({ leftDrawerOpen: true })}
        onClose={() => this.setState({ leftDrawerOpen: false })}
        content={
          <StreamSidebar
            navigateToAllStreams={navigateToAllStreams}
            navigateToSearch={navigateToSearch}
            onNarrow={newNarrow => {
              doNarrow(newNarrow);
              this.setState({ leftDrawerOpen: false });
            }}
          />
        }
      >
        <SideDrawer
          side="right"
          open={rightDrawerOpen}
          orientation={orientation}
          onOpenStart={() => this.setState({ rightDrawerOpen: true })}
          onClose={() => this.setState({ rightDrawerOpen: false })}
          content={
            <ConversationsContainer
              navigateToUsers={navigateToUsers}
              onNarrow={newNarrow => {
                doNarrow(newNarrow);
                this.setState({ rightDrawerOpen: false });
              }}
            />
          }
        >
          <MainNavBar
            onPressPeople={() => this.setState({ rightDrawerOpen: true })}
            onPressStreams={() => this.setState({ leftDrawerOpen: true })}
          >
            <Chat messages={messages} />
          </MainNavBar>
        </SideDrawer>
      </SideDrawer>
    );
  }
}
