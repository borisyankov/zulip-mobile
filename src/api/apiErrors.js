/* @flow strict-local */
import type { ApiResponseError } from './transportTypes';

export class EventQueueError extends Error {
  data: ApiResponseError;
  httpStatus: number;

  constructor(httpStatus: number, data: ApiResponseError) {
    super('Some message here');
    this.data = data;
    this.httpStatus = httpStatus;
  }
}

// if (e.message === 'API') {

/**
 * The event queue is too old or has been garbage collected.
 * https://zulipchat.com/api/get-events-from-queue#bad_event_queue_id-errors
 */
export const isErrorBadEventQueueId = (e: EventQueueError): boolean =>
  e.data !== undefined && e.data.code !== undefined && e.data.code === 'BAD_EVENT_QUEUE_ID';
