/* @flow */
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Label } from '../common';
import ConversationUser from './ConversationUser';
import ConversationGroup from './ConversationGroup';
import type { User } from '../types';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'column',
  },
  groupHeader: {
    fontWeight: 'bold',
    paddingLeft: 8,
    fontSize: 18,
  },
  emptySlate: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default class ConversationList extends PureComponent {
  props: {
    conversations: User[],
    onPress: (email: string) => void,
  };

  render() {
    const { conversations, onPress } = this.props;

    if (!conversations.length) {
      return <Label style={styles.emptySlate} text="No recent conversations" />;
    }

    // const isSelected =
    //   narrow && isGroupNarrow(narrow) && email === normalizeRecipients(narrow[0].operand);
    // const isSelected = narrow && isPrivateNarrow(narrow) && narrow[0].operand === email;

    return (
      <FlatList
        style={styles.list}
        initialNumToRender={20}
        data={conversations}
        keyExtractor={item => item.recipients}
        renderItem={({ item }) =>
          item.recipients.indexOf(',') === -1 // if single recipient
            ? <ConversationUser
                email={item.recipients}
                unreadCount={item.unread}
                onPress={onPress}
              />
            : <ConversationGroup
                email={item.recipients}
                unreadCount={item.unread}
                onPress={onPress}
              />}
      />
    );
  }
}
