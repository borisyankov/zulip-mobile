/* @flow */
import type { Props } from '../message/MessageListContainer';
import renderMessagesAsHtml from './renderMessagesAsHtml';
import messageTypingAsHtml from './messageTypingAsHtml';

let previousContent = '';

export default (prevProps: Props, nextProps: Props, sendMessage: any => void) => {
  if (
    prevProps.fetching.older !== nextProps.fetching.older ||
    prevProps.fetching.newer !== nextProps.fetching.newer
  ) {
    sendMessage({
      type: 'fetching',
      isFetching: nextProps.isFetching && nextProps.messages.length === 0,
      fetchingOlder: nextProps.fetching.older,
      fetchingNewer: nextProps.fetching.newer,
    });
  }

  if (prevProps.renderedMessages !== nextProps.renderedMessages) {
    const content = renderMessagesAsHtml(nextProps);

    if (content !== previousContent) {
      previousContent = content;
      sendMessage({
        type: 'content',
        anchor: nextProps.anchor,
        content,
      });
    }
  }

  if (prevProps.typingUsers !== nextProps.typingUsers) {
    sendMessage({
      type: 'typing',
      content: nextProps.typingUsers
        ? messageTypingAsHtml(nextProps.auth.realm, nextProps.typingUsers)
        : '',
    });
  }
};
