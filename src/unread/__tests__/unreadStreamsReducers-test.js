import deepFreeze from 'deep-freeze';

import unreadStreamsReducers from '../unreadStreamsReducers';
import {
  REALM_INIT,
  ACCOUNT_SWITCH,
  EVENT_NEW_MESSAGE,
  MARK_MESSAGES_READ,
  //  EVENT_UPDATE_MESSAGE_FLAGS,
} from '../../actionConstants';

describe('unreadStreamsReducers', () => {
  describe('ACCOUNT_SWITCH', () => {
    test('resets state to initial state', () => {
      const initialState = deepFreeze([
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2, 3],
        },
      ]);

      const action = deepFreeze({
        type: ACCOUNT_SWITCH,
      });

      const expectedState = [];

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('REALM_INIT', () => {
    test('received data from "unread_msgs.streams" key replaces the current state ', () => {
      const initialState = deepFreeze([]);

      const action = deepFreeze({
        type: REALM_INIT,
        data: {
          unread_msgs: {
            streams: [
              {
                stream_id: 1,
                topic: 'some topic',
                unread_message_ids: [1, 2],
              },
            ],
            huddles: [{}, {}, {}],
            pms: [{}, {}, {}],
            mentions: [1, 2, 3],
          },
        },
      });

      const expectedState = [
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2],
        },
      ];

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('EVENT_NEW_MESSAGE', () => {
    test('if message id already exists, do not mutate state', () => {
      const initialState = deepFreeze([
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2],
        },
      ]);

      const action = deepFreeze({
        type: EVENT_NEW_MESSAGE,
        message: {
          id: 1,
          type: 'stream',
          stream_id: 1,
          subject: 'some topic',
        },
      });

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toBe(initialState);
    });

    test('if message is not stream, return original state', () => {
      const initialState = deepFreeze([
        {
          sender_id: 1,
          unread_message_ids: [1, 2, 3],
        },
      ]);

      const action = deepFreeze({
        type: EVENT_NEW_MESSAGE,
        message: {
          id: 4,
          type: 'private',
          sender_id: 1,
        },
      });

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toBe(initialState);
    });

    test('if message id does not exist, append to state', () => {
      const initialState = deepFreeze([
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2, 3],
        },
      ]);

      const action = deepFreeze({
        type: EVENT_NEW_MESSAGE,
        message: {
          id: 4,
          type: 'stream',
          stream_id: 1,
          subject: 'some topic',
        },
      });

      const expectedState = [
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2, 3, 4],
        },
      ];

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toEqual(expectedState);
    });

    test('if stream with topic does not exist, append to state', () => {
      const initialState = deepFreeze([
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2, 3],
        },
      ]);

      const action = deepFreeze({
        type: EVENT_NEW_MESSAGE,
        message: {
          id: 4,
          type: 'stream',
          stream_id: 2,
          subject: 'another topic',
        },
      });

      const expectedState = [
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2, 3],
        },
        {
          stream_id: 2,
          topic: 'another topic',
          unread_message_ids: [4],
        },
      ];

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('MARK_MESSAGES_READ', () => {
    test('when ids are not contained already, do not change the state', () => {
      const initialState = deepFreeze([]);

      const action = deepFreeze({
        type: MARK_MESSAGES_READ,
        messageIds: [1, 2, 3],
      });

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toBe(initialState);
    });

    test('if message ids exist in state, remove them', () => {
      const initialState = deepFreeze([
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [1, 2, 3, 4, 5],
        },
        {
          stream_id: 2,
          topic: 'another topic',
          unread_message_ids: [6, 7],
        },
      ]);

      const action = deepFreeze({
        type: MARK_MESSAGES_READ,
        messageIds: [1, 2, 3, 6, 7],
      });

      const expectedState = [
        {
          stream_id: 1,
          topic: 'some topic',
          unread_message_ids: [4, 5],
        },
      ];

      const actualState = unreadStreamsReducers(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  // describe('EVENT_UPDATE_MESSAGE_FLAGS', () => {
  //   test('when operation is "add" and flag is "read" adds message id to state', () => {
  //     const initialState = deepFreeze([]);
  //
  //     const action = {
  //       type: EVENT_UPDATE_MESSAGE_FLAGS,
  //       messages: [1, 2, 3],
  //       flag: 'read',
  //       operation: 'add',
  //     };
  //
  //     const expectedState = [
  //       {
  //         sender_id: 1,
  //         unread_message_ids: [1, 2, 3, 4, 5],
  //       },
  //     ];
  //
  //     const actualState = unreadStreamsReducers(initialState, action);
  //
  //     expect(actualState).toEqual(expectedState);
  //   });
  //
  //   test('if flag already exists do not mutate state', () => {
  //     const initialState = deepFreeze([1]);
  //
  //     const action = deepFreeze({
  //       type: EVENT_UPDATE_MESSAGE_FLAGS,
  //       messages: [1],
  //       flag: 'read',
  //       operation: 'add',
  //     });
  //
  //     const actualState = unreadStreamsReducers(initialState, action);
  //
  //     expect(actualState).toBe(initialState);
  //   });
  //
  //   test('if other flags exist, adds new one to the list', () => {
  //     const initialState = deepFreeze([]);
  //
  //     const action = deepFreeze({
  //       type: EVENT_UPDATE_MESSAGE_FLAGS,
  //       messages: [1],
  //       flag: 'read',
  //       operation: 'add',
  //     });
  //
  //     const expectedState = [1];
  //
  //     const actualState = unreadStreamsReducers(initialState, action);
  //
  //     expect(actualState).toEqual(expectedState);
  //   });
  //
  //   test('adds flags for multiple messages', () => {
  //     const initialState = deepFreeze([]);
  //
  //     const action = deepFreeze({
  //       type: EVENT_UPDATE_MESSAGE_FLAGS,
  //       messages: [1],
  //       flag: 'starred',
  //       operation: 'add',
  //     });
  //
  //     const actualState = unreadStreamsReducers(initialState, action);
  //
  //     expect(actualState).toBe(initialState);
  //   });
  //
  //   test('when operation is "remove" removes a flag from message', () => {
  //     const initialState = deepFreeze([1]);
  //
  //     const action = deepFreeze({
  //       type: EVENT_UPDATE_MESSAGE_FLAGS,
  //       messages: [1],
  //       flag: 'read',
  //       operation: 'remove',
  //     });
  //
  //     const expectedState = [];
  //
  //     const actualState = unreadStreamsReducers(initialState, action);
  //
  //     expect(actualState).toEqual(expectedState);
  //   });
  //
  //   test('if flag does not exist, do nothing', () => {
  //     const initialState = deepFreeze([]);
  //
  //     const action = deepFreeze({
  //       type: EVENT_UPDATE_MESSAGE_FLAGS,
  //       messages: [1],
  //       flag: 'read',
  //       operation: 'remove',
  //     });
  //
  //     const actualState = unreadStreamsReducers(initialState, action);
  //
  //     expect(actualState).toBe(initialState);
  //   });
  //
  //   test('removes flags from multiple messages', () => {
  //     const initialState = deepFreeze([1, 2, 3, 4, 5]);
  //
  //     const action = deepFreeze({
  //       type: EVENT_UPDATE_MESSAGE_FLAGS,
  //       messages: [1, 2, 3, 6, 7],
  //       flag: 'read',
  //       operation: 'remove',
  //     });
  //
  //     const expectedState = [4, 5];
  //
  //     const actualState = unreadStreamsReducers(initialState, action);
  //
  //     expect(actualState).toEqual(expectedState);
  //   });
  // });
});
