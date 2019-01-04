/* @flow */
import type { ApiResponse, Auth } from '../apiTypes';
import { apiPatch } from '../apiFetch';

type UpdateMessageParams = {
  message_id?: number,
  topic_name?: string,
  propagate_mode?: 'change_one' | 'change_later' | 'change_all',
  content?: string,
};

/** See https://zulipchat.com/api/update-message */
export default async (auth: Auth, id: number, params: UpdateMessageParams): Promise<ApiResponse> =>
  apiPatch(auth, `messages/${id}`, params);
