/* @flow strict-local */
import type { ApiResponse, Auth } from '../apiTypes';
import { apiDelete } from '../apiFetch';

/**
 * See https://zulipchat.com/api/delete-message
 * Note: The requesting user must be an administrator.
 */
export default async (auth: Auth, id: number): Promise<ApiResponse> =>
  apiDelete(auth, `messages/${id}`);
