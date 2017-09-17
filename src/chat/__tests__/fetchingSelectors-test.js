import deepFreeze from 'deep-freeze';

import { getFetchingForActiveNarrow, getIsFetching } from '../fetchingSelectors';
import { homeNarrow, homeNarrowStr } from '../../utils/narrow';

describe('getFetchingForActiveNarrow', () => {
  test('if no narrow information exists in state, return a null fetching object', () => {
    const state = deepFreeze({
      chat: {
        narrow: homeNarrow,
      },
      fetching: {},
    });
    const expectedResult = { older: false, newer: false };

    const actualResult = getFetchingForActiveNarrow(state);

    expect(actualResult).toEqual(expectedResult);
  });

  test('if an entry matching current narrow exists, it is returned', () => {
    const state = deepFreeze({
      chat: {
        narrow: homeNarrow,
      },
      fetching: {
        [homeNarrowStr]: { older: true, newer: true },
      },
    });
    const expectedResult = { older: true, newer: true };

    const actualResult = getFetchingForActiveNarrow(state);

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('getIsFetching', () => {
  test('when no initial fetching required and fetching is empty returns false', () => {
    const state = deepFreeze({
      app: {},
      chat: {
        narrow: homeNarrow,
      },
      fetching: {},
    });

    const result = getIsFetching(state);

    expect(result).toEqual(false);
  });

  test('when initial fetching required regardless of fetching state returns true', () => {
    const state = deepFreeze({
      app: {
        needsInitialFetch: true,
      },
      chat: {
        narrow: homeNarrow,
      },
      fetching: {},
    });

    const result = getIsFetching(state);

    expect(result).toEqual(true);
  });

  test('if fetching older for current narrow returns true', () => {
    const state = deepFreeze({
      app: {},
      chat: {
        narrow: homeNarrow,
      },
      fetching: {
        [homeNarrowStr]: { older: true, newer: false },
      },
    });

    const result = getIsFetching(state);

    expect(result).toEqual(true);
  });

  test('if fetching newer for current narrow returns true', () => {
    const state = deepFreeze({
      app: {},
      chat: {
        narrow: homeNarrow,
      },
      fetching: {
        [homeNarrowStr]: { older: false, newer: true },
      },
    });

    const result = getIsFetching(state);

    expect(result).toEqual(true);
  });
});
