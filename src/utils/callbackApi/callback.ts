import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { pick } from 'underscore';
import type { AxiosRequestConfigCustom } from './types';

async function callbackApi<T>(
  getToken: () => Promise<string>,
  url: string,
  customConfig: AxiosRequestConfigCustom = {},
): Promise<T> {
  const params: AxiosRequestConfigCustom = {
    ...customConfig,
    headers: customConfig.headers ?? {},
    method: customConfig.method ?? 'GET',
  };
  const token = await getToken();
  if (!token) {
    throw new Error('Token not found');
  }
  const fullUrl = params.baseURL
    ? `${params.baseURL.replace(/\/$/, '')}/${url?.toString().replace(/^\//, '')}`
    : url;
  const options: AxiosRequestConfig = {
    ...params,
    headers: pick(
      {
        ...params.headers,
        Authorization: `Bearer ${token}`,
        'x-session-id': params.sessionId ?? '',
      },
      (value) => value !== undefined,
    ),
    url: fullUrl,
  };
  return new Promise<T>((resolve, reject) => {
    axios(options)
      .then((success) => {
        resolve(success.data as T);
      })
      .catch((error: Error | AxiosError<T>) => {
        if (axios.isAxiosError(error)) {
          reject(error.response);
        } else {
          reject(error);
        }
      });
  });
}

export default callbackApi;
