/* @flow strict-local */
import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-native';
import type { NavigationScreenProp } from 'react-navigation';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { connect } from '../react-redux';
import type { ThemeData } from '../styles';
import styles, { ThemeContext } from '../styles';
import type { Dispatch, Fetching, Narrow, EditMessage } from '../types';
import { KeyboardAvoider, OfflineNotice, ZulipStatusBar } from '../common';
import ChatNavBar from '../nav/ChatNavBar';

import MessageList from '../webview/MessageList';
import NoMessages from '../message/NoMessages';
import FetchError from './FetchError';
import { fetchMessagesInNarrow } from '../message/fetchActions';
import ComposeBox from '../compose/ComposeBox';
import UnreadNotice from './UnreadNotice';
import { canSendToNarrow } from '../utils/narrow';
import { getLoading, getSession } from '../directSelectors';
import { getTopMostNarrow } from '../nav/navSelectors';
import { getFetchingForNarrow } from './fetchingSelectors';
import { getShownMessagesForNarrow } from './narrowsSelectors';

type SelectorProps = {|
  fetching: Fetching,
  haveNoMessages: boolean,
  loading: boolean,
  eventQueueId: number,
  isLastNarrow: boolean,
  isTopMostNarrow: boolean,
|};

type Props = $ReadOnly<{|
  navigation: NavigationScreenProp<{ params: {| narrow: Narrow |} }>,
  dispatch: Dispatch,

  ...SelectorProps,
|}>;

type State = {|
  editMessage: EditMessage | null,
  fetchError: Error | null,
|};

class ChatScreen extends PureComponent<Props, State> {
  static contextType = ThemeContext;
  context: ThemeData;

  state = {
    editMessage: null,
    fetchError: null,
  };

  styles = {
    screen: {
      flex: 1,
      flexDirection: 'column',
    },
  };

  // This could live in `this.state`, but it isn't used in `render`.
  // If we don't use `this.setState` to update it, we don't have to
  // worry about pointless rerenders. We just check it in
  // `componentDidUpdate`.
  shouldFetchWhenNextFocused: boolean = false;

  componentDidMount() {
    this.fetch();
  }

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate(prevProps, prevState) {
    const isFocused = this.props.isLastNarrow || this.props.isTopMostNarrow;

    // When the event queue changes, fetch or schedule a fetch
    if (prevProps.eventQueueId !== this.props.eventQueueId) {
      if (isFocused) {
        this.fetch();
      } else {
        this.shouldFetchWhenNextFocused = true;
      }
    }

    // Do a scheduled fetch, if it's time
    if (this.shouldFetchWhenNextFocused && isFocused) {
      this.shouldFetchWhenNextFocused = false;
      this.fetch();
    }
  }

  clearError = () => {
    this.setState({ fetchError: null });
  };

  /**
   * Fetch messages for this narrow.
   *
   * See `MessagesState` for background about the fetching, including
   * why this is nearly the only place where additional data fetching
   * is required.  See `fetchMessagesInNarrow` and `fetchMessages` for
   * more details, including how Redux is kept up-to-date during the
   * whole process.
   */
  fetch = async () => {
    const { narrow } = this.props.navigation.state.params;
    try {
      await this.props.dispatch(fetchMessagesInNarrow(narrow));
    } catch (e) {
      this.setState({ fetchError: e });
    }
  };

  startEditMessage = (editMessage: EditMessage) => {
    this.setState({ editMessage });
  };

  completeEditMessage = () => {
    this.setState({ editMessage: null });
  };

  render() {
    const { fetching, haveNoMessages, loading, navigation } = this.props;
    const { narrow } = navigation.state.params;
    const { editMessage } = this.state;

    const isFetching = fetching.older || fetching.newer || loading;
    const showMessagePlaceholders = haveNoMessages && isFetching;
    const sayNoMessages = haveNoMessages && !isFetching;
    const showComposeBox = canSendToNarrow(narrow) && !showMessagePlaceholders;

    return (
      <ActionSheetProvider>
        <SafeAreaView
          style={[this.styles.screen, { backgroundColor: this.context.backgroundColor }]}
        >
          <KeyboardAvoider style={styles.flexed} behavior="padding">
            <ZulipStatusBar narrow={narrow} />
            <ChatNavBar narrow={narrow} editMessage={editMessage} />
            <OfflineNotice />
            <UnreadNotice narrow={narrow} />
            {(() => {
              if (this.state.fetchError !== null) {
                return <FetchError narrow={narrow} error={this.state.fetchError} />;
              } else if (sayNoMessages) {
                return <NoMessages narrow={narrow} />;
              } else {
                return (
                  <MessageList
                    narrow={narrow}
                    showMessagePlaceholders={showMessagePlaceholders}
                    startEditMessage={this.startEditMessage}
                  />
                );
              }
            })()}
            {showComposeBox && (
              <ComposeBox
                narrow={narrow}
                editMessage={editMessage}
                completeEditMessage={this.completeEditMessage}
              />
            )}
          </KeyboardAvoider>
        </SafeAreaView>
      </ActionSheetProvider>
    );
  }
}

export default connect<SelectorProps, _, _>((state, props) => ({
  loading: getLoading(state),
  fetching: getFetchingForNarrow(state, props.navigation.state.params.narrow),
  haveNoMessages:
    getShownMessagesForNarrow(state, props.navigation.state.params.narrow).length === 0,
  eventQueueId: getSession(state).eventQueueId,
  isLastNarrow: getSession(state).lastNarrow === props.navigation.state.params.narrow,
  isTopMostNarrow: getTopMostNarrow(state) === props.navigation.state.params.narrow,
}))(ChatScreen);
