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
