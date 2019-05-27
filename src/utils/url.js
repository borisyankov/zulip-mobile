/* @flow strict-local */
import base64 from 'base-64';
import urlRegex from 'url-regex';

import type { Auth } from '../types';

/**
 * An object `encodeParamsForUrl` can flatten.
 *
 * In principle the values should be strings; but we include some other
 * primitive types for which `toString` is just as good as `JSON.stringify`.
 */
export type UrlParams = $ReadOnly<{ [string]: string | boolean | number }>;

export const getPathsFromUrl = (url: string = '', realm: string) => {
  const paths = url
    .split(realm)
    .pop()
    .split('#narrow/')
    .pop()
    .split('/');

  if (paths.length > 0 && paths[paths.length - 1] === '') {
    // url ends with /
    paths.splice(-1, 1);
  }
  return paths;
};

export const getAuthHeader = (email: string, apiKey: string): ?string =>
  apiKey ? `Basic ${base64.encode(`${email}:${apiKey}`)}` : undefined;

/** Encode parameters as if for the URL query-part submitting an HTML form. */
export const encodeParamsForUrl = (params: UrlParams): string =>
  Object.keys(params)
    // An `undefined` can sneak in because `JSON.stringify(undefined)` is
    // `undefined`, but its signature lies that it returns just `string`.
    .filter((key: string) => params[key] !== undefined)
    .map(
      (key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString())}`,
    )
    .join('&');

export const getFullUrl = (url: string = '', realm: string): string =>
  !url.startsWith('http') ? `${realm}${url.startsWith('/') ? '' : '/'}${url}` : url;

export const isUrlOnRealm = (url: string = '', realm: string): boolean =>
  url.startsWith('/') || url.startsWith(realm) || !/^(http|www.)/i.test(url);

export const isEmojiUrl = (url: string, realm: string): boolean =>
  isUrlOnRealm(url, realm) && url.includes('/static/generated/emoji/images/emoji/unicode/');

export const getEmojiUrl = (unicode: string): string =>
  `/static/generated/emoji/images/emoji/unicode/${unicode}.png`;

const getResourceWithAuth = (uri: string, auth: Auth) => ({
  uri: getFullUrl(uri, auth.realm),
  headers: {
    Authorization: getAuthHeader(auth.email, auth.apiKey),
  },
});

const getResourceNoAuth = (uri: string) => ({
  uri,
});

export const getResource = (
  uri: string,
  auth: Auth,
): {| uri: string, headers?: { [string]: ?string } |} =>
  isUrlOnRealm(uri, auth.realm) ? getResourceWithAuth(uri, auth) : getResourceNoAuth(uri);

export const hasProtocol = (url: string = '') => url.search(/\b(http|https):\/\//) !== -1;

export const fixRealmUrl = (url: string = '') =>
  url.length > 0 ? (!hasProtocol(url) ? 'https://' : '') + url.trim().replace(/\s+|\/$/g, '') : '';

export const getFileExtension = (filename: string): string => filename.split('.').pop();

export const isUrlAnImage = (url: string): boolean =>
  ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(getFileExtension(url).toLowerCase());

const mimes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  mov: 'video/quicktime',
};

export const getMimeTypeFromFileExtension = (extension: string): string =>
  mimes[extension.toLowerCase()] || 'application/octet-stream';

export const autocompleteUrl = (value: string = '', protocol: string, append: string): string =>
  value.length > 0
    ? `${hasProtocol(value) ? '' : protocol}${value || 'your-org'}${
        value.indexOf('.') === -1 ? append : ''
      }`
    : '';

export const isValidUrl = (url: string): boolean => urlRegex({ exact: true }).test(url);
