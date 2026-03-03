import axios from 'axios';
import { config } from '../../config';

/**
 * Single Axios instance for all API calls. Attach Bearer token via setToken.
 * No raw Axios calls from screens or stores (TECHSPEC §3.3).
 */
export const callbackApi = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

let tokenGetter: (() => Promise<string | undefined>) | null = null;

export function setTokenGetter(
  getter: () => Promise<string | undefined>,
): void {
  tokenGetter = getter;
}

callbackApi.interceptors.request.use(async (req) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});
