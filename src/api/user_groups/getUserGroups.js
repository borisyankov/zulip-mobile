/* @flow */
import type { Auth } from '../../types';
import { apiGet } from '../apiFetch';

export default async (auth: Auth): Promise<any[]> =>
  apiGet(auth, 'realm/user_group', res => res.user_groups);
