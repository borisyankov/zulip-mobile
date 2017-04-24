import React from 'react';
import htmlparser from 'htmlparser2';

import renderHtmlChildren from './html/renderHtmlChildren';
import MessageFull from './MessageFull';
import MessageBrief from './MessageBrief';

const htmlToDomTree = html => {
  let domTree = null;
  const parser = new htmlparser.Parser(new htmlparser.DomHandler((err, dom) => {
    if (!err) domTree = dom;
  }));
  parser.write(html);
  parser.done();
  return domTree;
};

export default class MessageContainer extends React.PureComponent {

  onLongPress = () => {
    const { message, onLongPress } = this.props;
    onLongPress(message);
  }

  render() {
    const { message, auth, avatarUrl, twentyFourHourTime, isBrief, doNarrow } = this.props;
    const MessageComponent = isBrief ? MessageBrief : MessageFull;
    const dom = htmlToDomTree(message.content);

    return (
      <MessageComponent
        message={message}
        avatarUrl={avatarUrl}
        twentyFourHourTime={twentyFourHourTime}
        selfEmail={auth.email}
        doNarrow={doNarrow}
        onLongPress={this.onLongPress}
      >
        {renderHtmlChildren({ childrenNodes: dom, auth })}
      </MessageComponent>
    );
  }
}
