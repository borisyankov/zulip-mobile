import React from 'react';
import {
  KeyboardAvoidingView,
} from 'react-native';

import { styles, OfflineNotice } from '../common';
import MessageList from '../message-list/MessageList';
import NoMessages from '../message/NoMessages';
import ComposeBox from '../compose/ComposeBox';

export default class MainScreen extends React.Component {

  render() {
    const { auth, messages, narrow, isFetching, subscriptions,
      isOnline, twentyFourHourTime, doNarrow, fetchOlder } = this.props;

    return (
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
        {!isOnline && <OfflineNotice />}
        {messages.length === 0 && !isFetching && <NoMessages narrow={narrow} />}
        <MessageList
          messages={messages}
          narrow={narrow}
          isFetching={isFetching}
          twentyFourHourTime={twentyFourHourTime}
          subscriptions={subscriptions}
          auth={auth}
          fetchOlder={fetchOlder}
          doNarrow={doNarrow}
        />
        <ComposeBox onSend={this.sendMessage} />
      </KeyboardAvoidingView>
    );
  }
}
