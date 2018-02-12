import deepFreeze from 'deep-freeze';

import {
  getFirstMessageId,
  getLastMessageId,
  getLastTopicInActiveNarrow,
  getMessagesInActiveNarrow,
} from '../chatSelectors';
import { homeNarrow, homeNarrowStr, privateNarrow, streamNarrow } from '../../utils/narrow';
import { navStateWithNarrow } from '../../utils/testHelpers';

describe('getMessagesInActiveNarrow', () => {
  test('if no outbox messages returns messages with no change', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          '[]': [{ id: 123 }],
        },
      },
      outbox: [],
    });

    const anchor = getMessagesInActiveNarrow(state);

    expect(anchor).toBe(state.chat.messages['[]']);
  });

  test('combine messages and outbox in same narrow', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          '[]': [{ id: 123 }],
        },
      },
      outbox: [
        {
          email: 'donald@zulip.com',
          narrow: homeNarrow,
          parsedContent: '<p>Hello</p>',
          sender_full_name: 'donald',
          timestamp: 12,
        },
      ],
      caughtUp: {
        [homeNarrowStr]: { older: false, newer: true },
      },
    });

    const anchor = getMessagesInActiveNarrow(state);

    const expectedState = deepFreeze([
      { id: 123 },
      {
        email: 'donald@zulip.com',
        narrow: [],
        parsedContent: '<p>Hello</p>',
        sender_full_name: 'donald',
        timestamp: 12,
      },
    ]);

    expect(anchor).toEqual(expectedState);
  });

  test('do not combine messages and outbox if not caught up', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          [homeNarrowStr]: [{ id: 123 }],
        },
      },
      outbox: [
        {
          email: 'donald@zulip.com',
          narrow: homeNarrow,
          parsedContent: '<p>Hello</p>',
          sender_full_name: 'donald',
          timestamp: 12,
        },
      ],
    });

    const anchor = getMessagesInActiveNarrow(state);

    expect(anchor).toBe(state.chat.messages[homeNarrowStr]);
  });

  test('do not combine messages and outbox in different narrow', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(privateNarrow('john@example.com')),
      chat: {
        messages: {
          [JSON.stringify(privateNarrow('john@example.com'))]: [{ id: 123 }],
        },
      },
      outbox: [
        {
          email: 'donald@zulip.com',
          narrow: streamNarrow('denmark', 'denmark'),
          parsedContent: '<p>Hello</p>',
          sender_full_name: 'donald',
          timestamp: 12,
        },
      ],
    });

    const anchor = getMessagesInActiveNarrow(state);

    const expectedState = deepFreeze([{ id: 123 }]);

    expect(anchor).toEqual(expectedState);
  });
});

describe('getFirstMessageId', () => {
  test('return undefined when there are no messages', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          '[]': [],
        },
      },
      outbox: [],
    });

    const anchor = getFirstMessageId(state);

    expect(anchor).toEqual(undefined);
  });

  test('returns first message id', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          '[]': [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      },
      outbox: [],
    });

    const anchor = getFirstMessageId(state);

    expect(anchor).toEqual(1);
  });
});

describe('getLastMessageId', () => {
  test('return undefined when there are no messages', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          '[]': [],
        },
      },
      outbox: [],
    });

    const anchor = getLastMessageId(state);

    expect(anchor).toEqual(undefined);
  });

  test('returns last message id', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          '[]': [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      },
      outbox: [],
    });

    const anchor = getLastMessageId(state);

    expect(anchor).toEqual(3);
  });
});

describe('getLastTopicInActiveNarrow', () => {
  test('when no messages yet, return empty string', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {},
      },
      outbox: [],
    });

    const actualLastTopic = getLastTopicInActiveNarrow(state);

    expect(actualLastTopic).toEqual('');
  });

  test('when last message has a `subject` property, return it', () => {
    const state = deepFreeze({
      ...navStateWithNarrow(homeNarrow),
      chat: {
        messages: {
          [homeNarrowStr]: [
            { id: 0, subject: 'First subject' },
            { id: 1, subject: 'Last subject' },
          ],
        },
      },
      outbox: [],
    });

    const actualLastTopic = getLastTopicInActiveNarrow(state);

    expect(actualLastTopic).toEqual('Last subject');
  });

  test('when there are messages, but none with a `subject` property, return empty', () => {
    const narrow = privateNarrow('john@example.com');
    const state = deepFreeze({
      ...navStateWithNarrow(narrow),
      chat: {
        messages: {
          [JSON.stringify(narrow)]: [{ id: 0 }],
        },
      },
      outbox: [],
    });

    const actualLastTopic = getLastTopicInActiveNarrow(state);

    expect(actualLastTopic).toEqual('');
  });

  test('when last message has no `subject` property, return last one that has', () => {
    const narrow = privateNarrow('john@example.com');
    const state = deepFreeze({
      ...navStateWithNarrow(narrow),
      chat: {
        messages: {
          [JSON.stringify(narrow)]: [{ id: 0 }, { id: 1, subject: 'Some subject' }, { id: 2 }],
        },
      },
      outbox: [],
    });

    const actualLastTopic = getLastTopicInActiveNarrow(state);

    expect(actualLastTopic).toEqual('Some subject');
  });
});
