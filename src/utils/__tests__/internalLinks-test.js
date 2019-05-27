/* eslint-disable spellcheck/spell-checker */
import {
  isInternalLink,
  isMessageLink,
  getLinkType,
  getNarrowFromLink,
  getMessageIdFromLink,
} from '../internalLinks';

import { streamNarrow, topicNarrow, groupNarrow, specialNarrow } from '../narrow';

describe('isInternalLink', () => {
  test('when link is external, return false', () => {
    expect(isInternalLink('https://example.com', 'https://another.com')).toBe(false);
  });

  test('when link is internal, but not in app, return false', () => {
    expect(isInternalLink('https://example.com/user_uploads', 'https://example.com')).toBe(false);
  });

  test('when link is internal and in app, return true', () => {
    expect(isInternalLink('https://example.com/#narrow/stream/jest', 'https://example.com')).toBe(
      true,
    );
  });

  test('when link is relative and in app, return true', () => {
    expect(isInternalLink('#narrow/stream/jest/topic/topic1', 'https://example.com')).toBe(true);
    expect(isInternalLink('/#narrow/stream/jest', 'https://example.com')).toBe(true);
  });

  test('links including IDs are also recognized', () => {
    expect(isInternalLink('#narrow/stream/123-jest/topic/topic1', 'https://example.com')).toBe(
      true,
    );
    expect(isInternalLink('/#narrow/stream/123-jest', 'https://example.com')).toBe(true);
    expect(isInternalLink('/#narrow/pm-with/123-mark', 'https://example.com')).toBe(true);
  });
});

describe('isMessageLink', () => {
  test('only in-app link containing "near/<message-id>" is a message link', () => {
    expect(isMessageLink('https://example.com/#narrow/stream/jest', 'https://example.com')).toBe(
      false,
    );
    expect(isMessageLink('https://example.com/#narrow/#near/1', 'https://example.com')).toBe(true);
  });
});

describe('getLinkType', () => {
  test('links to a different domain are of "external" type', () => {
    expect(getLinkType('https://google.com/some-path', 'https://example.com')).toBe('external');
  });

  test('only in-app link containing "stream" is a stream link', () => {
    expect(
      getLinkType('https://example.com/#narrow/pm-with/1,2-group', 'https://example.com'),
    ).toBe('pm');
    expect(getLinkType('https://example.com/#narrow/stream/jest', 'https://example.com')).toBe(
      'stream',
    );
    expect(getLinkType('https://example.com/#narrow/stream/stream/', 'https://example.com')).toBe(
      'stream',
    );
  });

  test('when a url is not a topic narrow return false', () => {
    expect(
      getLinkType('https://example.com/#narrow/pm-with/1,2-group', 'https://example.com'),
    ).toBe('pm');
    expect(getLinkType('https://example.com/#narrow/stream/jest', 'https://example.com')).toBe(
      'stream',
    );
    expect(
      getLinkType(
        'https://example.com/#narrow/stream/stream/topic/topic/near/',
        'https://example.com',
      ),
    ).toBe('home');
    expect(getLinkType('https://example.com/#narrow/stream/topic/', 'https://example.com')).toBe(
      'stream',
    );
  });

  test('when a url is a topic narrow return true', () => {
    expect(
      getLinkType('https://example.com/#narrow/stream/jest/topic/test', 'https://example.com'),
    ).toBe('topic');
    expect(
      getLinkType(
        'https://example.com/#narrow/stream/mobile/subject/topic/near/378333',
        'https://example.com',
      ),
    ).toBe('topic');
    expect(
      getLinkType('https://example.com/#narrow/stream/mobile/topic/topic/', 'https://example.com'),
    ).toBe('topic');
    expect(
      getLinkType(
        'https://example.com/#narrow/stream/stream/topic/topic/near/1',
        'https://example.com',
      ),
    ).toBe('topic');
    expect(
      getLinkType(
        'https://example.com/#narrow/stream/stream/subject/topic/near/1',
        'https://example.com',
      ),
    ).toBe('topic');

    expect(getLinkType('/#narrow/stream/stream/subject/topic', 'https://example.com')).toBe(
      'topic',
    );
  });

  test('only in-app link containing "pm-with" is a group link', () => {
    expect(
      getLinkType('https://example.com/#narrow/stream/jest/topic/test', 'https://example.com'),
    ).toBe('topic');
    expect(
      getLinkType('https://example.com/#narrow/pm-with/1,2-group', 'https://example.com'),
    ).toBe('pm');
    expect(
      getLinkType('https://example.com/#narrow/pm-with/1,2-group/near/1', 'https://example.com'),
    ).toBe('pm');
    expect(
      getLinkType(
        'https://example.com/#narrow/pm-with/a.40b.2Ecom.c.d.2Ecom/near/3',
        'https://example.com',
      ),
    ).toBe('pm');
  });

  test('only in-app link containing "is" is a special link', () => {
    expect(
      getLinkType('https://example.com/#narrow/stream/jest/topic/test', 'https://example.com'),
    ).toBe('topic');
    expect(getLinkType('https://example.com/#narrow/is/private', 'https://example.com')).toBe(
      'special',
    );
    expect(getLinkType('https://example.com/#narrow/is/starred', 'https://example.com')).toBe(
      'special',
    );
    expect(getLinkType('https://example.com/#narrow/is/mentioned', 'https://example.com')).toBe(
      'special',
    );
    expect(getLinkType('https://example.com/#narrow/is/men', 'https://example.com')).toBe('home');
    expect(getLinkType('https://example.com/#narrow/is/men/stream', 'https://example.com')).toBe(
      'home',
    );
    expect(getLinkType('https://example.com/#narrow/are/men/stream', 'https://example.com')).toBe(
      'home',
    );
  });
});

describe('getNarrowFromLink', () => {
  const usersById = new Map([
    [1, { email: 'abc@example.com', user_id: 1 }],
    [2, { email: 'xyz@example.com', user_id: 2 }],
    [3, { email: 'def@example.com', user_id: 3 }],
  ]);

  test('when link is not in-app link, return null', () => {
    const url = 'https://example.com/user_uploads';
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(null);
  });

  test('when link is stream link, return matching streamNarrow', () => {
    const url = 'https://example.com/#narrow/stream/Stream';
    const expected = streamNarrow('Stream');
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });

  test('when stream name contains space decode this correctly', () => {
    const url = 'https://example.com/#narrow/stream/Two.20words';
    const expected = streamNarrow('Two words');
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });

  test('when link is stream link, without realm info, return matching streamNarrow', () => {
    const url = '/#narrow/stream/Stream';
    const expected = streamNarrow('Stream');
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });

  test('matches a link without the leading slash', () => {
    const url = '#narrow/stream/Stream';
    const expected = streamNarrow('Stream');
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });

  test('when link is a topic link and encoded, decode stream and topic names and return matching streamNarrow and topicNarrow', () => {
    const url = 'https://example.com/#narrow/stream/Stream/topic/(no.20topic)';
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    const expected = topicNarrow('Stream', '(no topic)');
    expect(result).toEqual(expected);
  });

  test('when link is pointing to a topic without realm info, return matching topicNarrow', () => {
    const url = '/#narrow/stream/Stream/topic/topic';
    const expected = topicNarrow('Stream', 'topic');
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });

  test('when link is a group link, return matching groupNarrow', () => {
    const url = 'https://example.com/#narrow/pm-with/1,2,3-group';
    const expected = groupNarrow(['abc@example.com', 'xyz@example.com', 'def@example.com']);
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });

  test('if any of the user ids are not found return null', () => {
    const url = 'https://example.com/#narrow/pm-with/1,2,10-group';
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(null);
  });

  test('when link is a special link, return matching specialNarrow', () => {
    const url = 'https://example.com/#narrow/is/starred';
    const expected = specialNarrow('starred');
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });

  test('when link is a message link, return matching narrow', () => {
    const url = 'https://example.com/#narrow/pm-with/1,3-group/near/2';
    const expected = groupNarrow(['abc@example.com', 'def@example.com']);
    const result = getNarrowFromLink(url, 'https://example.com', usersById);
    expect(result).toEqual(expected);
  });
});

describe('getMessageIdFromLink', () => {
  test('not message link', () => {
    expect(
      getMessageIdFromLink('https://example.com/#narrow/is/private', 'https://example.com'),
    ).toBe(0);
  });

  test('when link is a group link, return anchor message id', () => {
    expect(
      getMessageIdFromLink(
        'https://example.com/#narrow/pm-with/1,3-group/near/1/',
        'https://example.com',
      ),
    ).toBe(1);
  });

  test('when link is a topic link, return anchor message id', () => {
    expect(
      getMessageIdFromLink(
        'https://example.com/#narrow/stream/jest/topic/test/near/1',
        'https://example.com',
      ),
    ).toBe(1);
  });
});
