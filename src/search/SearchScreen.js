import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';

import boundActions from '../boundActions';
import { getAuth } from '../account/accountSelectors';
import { Screen, SearchInput } from '../common';
import { searchNarrow } from '../utils/narrow';
import MessageList from '../message-list/MessageList';
import { getMessages } from '../api';

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    paddingLeft: 10,
    padding: 8,
    textAlign: 'center',
  },
  results: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 50,
  }
});

class SearchScreen extends Component {

  props: {
    fullName: string,
    email: string,
    avatarUrl: string,
  }

  state = {
    messages: [],
    isFetching: false,
  };

  handleQueryChange = async (query) => {
    const { auth } = this.props;
    this.query = query;

    throttle(async () => {
      this.setState({ isFetching: true });
      const messages = await getMessages(auth, Number.MAX_SAFE_INTEGER, 20, 0, searchNarrow(query));
      this.setState({
        messages,
        isFetching: false,
      });
    }, 500).call(this);
  }

  render() {
    const { isFetching, messages } = this.state;
    const { auth, subscriptions, twentyFourHourTime } = this.props;
    const noResults = !!this.query && !isFetching && !messages.list;

    return (
      <Screen title="Search">
        <SearchInput onChange={this.handleQueryChange} />
        <View style={styles.results}>
          <MessageList
            messages={messages}
            narrow={[]}
            isFetching={isFetching}
            twentyFourHourTime={twentyFourHourTime}
            subscriptions={subscriptions}
            auth={auth}
            fetchOlder={() => {}}
            doNarrow={() => {}}
          />
          {noResults &&
            <Text style={styles.text}>
              No results
            </Text>
          }
        </View>
      </Screen>
    );
  }
}

export default connect((state) => ({
  auth: getAuth(state),
  isOnline: state.app.isOnline,
  subscriptions: state.subscriptions,
  narrow: state.chat.narrow,
  startReached: state.chat.startReached,
  streamlistOpened: state.nav.opened,
}), boundActions)(SearchScreen);
