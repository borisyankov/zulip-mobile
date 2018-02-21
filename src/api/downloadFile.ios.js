/* @flow */
import { CameraRoll } from 'react-native';

import type { Auth } from '../types';
import { getFullUrl } from '../utils/url';

export default (url: string, auth: Auth) =>
  CameraRoll.saveToCameraRoll(getFullUrl(url, auth.realm));
