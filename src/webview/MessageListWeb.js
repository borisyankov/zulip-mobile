/* @flow */
import React, { Component } from 'react';
import { WebView } from 'react-native';

import type { Props } from '../message/MessageListContainer';
import type { WebviewInputMessage } from './webViewHandleUpdates';
import type { MessageListEvent } from './webViewEventHandlers';
import getHtml from './html/html';
import renderMessagesAsHtml from './html/renderMessagesAsHtml';
import webViewHandleUpdates from './webViewHandleUpdates';
import * as webViewEventHandlers from './webViewEventHandlers';

export default class MessageListWeb extends Component<Props> {
  webview: ?Object;
  props: Props;

  static contextTypes = {
    styles: () => null,
    theme: () => null,
  };

  handleError = (event: Object) => {
    console.error(event); // eslint-disable-line
  };

  sendMessages = (messages: WebviewInputMessage[]): void => {
    if (this.webview && messages.length > 0) {
      this.webview.postMessage(JSON.stringify(messages), '*');
    }
  };

  handleMessage = (event: { nativeEvent: { data: string } }) => {
    const eventData: MessageListEvent = JSON.parse(event.nativeEvent.data);
    const handler = `handle${eventData.type.charAt(0).toUpperCase()}${eventData.type.slice(1)}`;

    webViewEventHandlers[handler](this.props, eventData); // $FlowFixMe
  };

  shouldComponentUpdate = (nextProps: Props) => {
    webViewHandleUpdates(this.props, nextProps, this.sendMessages);
    return false;
  };

  render() {
    const { styles, theme } = this.context;
    const { anchor, auth, showMessagePlaceholders, debug } = this.props;
    const html = getHtml(renderMessagesAsHtml(this.props), theme, {
      anchor,
      highlightUnreadMessages: debug.highlightUnreadMessages,
      showMessagePlaceholders,
    });

    // For debugging issues in our HTML and CSS: Uncomment this line,
    // copy-paste the output to a file, and open in a browser.
    // console.log(html);

    return (
      <WebView
        source={{
          baseUrl: auth.realm,
          html,
        }}
        style={styles.webview}
        ref={webview => {
          this.webview = webview;
        }}
        onMessage={this.handleMessage}
        onError={this.handleError}
      />
    );
  }
}
