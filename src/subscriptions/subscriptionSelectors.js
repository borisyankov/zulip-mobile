/* flow */
import { createSelector } from 'reselect';

import { NULL_STREAM } from '../nullObjects';
import { isStreamOrTopicNarrow } from '../utils/narrow';
import { getSubscriptions, getStreams } from '../directSelectors';
import { getActiveNarrow, getCurrentRouteParams } from '../baseSelectors';

export const getStreamsById = createSelector(getStreams, streams =>
  streams.reduce((streamsById, stream) => {
    streamsById[stream.stream_id] = stream;
    return streamsById;
  }, {}),
);

export const getSubscriptionsById = createSelector(getSubscriptions, subscriptions =>
  subscriptions.reduce((subsById, subscription) => {
    subsById[subscription.stream_id] = subscription;
    return subsById;
  }, {}),
);

export const getIsActiveStreamSubscribed = createSelector(
  getActiveNarrow,
  getSubscriptions,
  (activeNarrow, subscriptions) => {
    if (!isStreamOrTopicNarrow(activeNarrow)) {
      return true;
    }

    return subscriptions.find(sub => activeNarrow[0].operand === sub.name) !== undefined;
  },
);

export const getSubscribedStreams = createSelector(
  getStreams,
  getSubscriptions,
  (allStreams, allSubscriptions) =>
    allSubscriptions.map(subscription => ({
      ...subscription,
      ...allStreams.find(stream => stream.stream_id === subscription.stream_id),
    })),
);

export const getStreamEditInitialValues = createSelector(
  [getStreams, getCurrentRouteParams],
  (streams, params) => {
    if (!params || !params.streamId) {
      return NULL_STREAM;
    }

    return streams.find(x => x.stream_id === params.streamId) || NULL_STREAM;
  },
);
