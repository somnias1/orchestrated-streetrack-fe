import { afterEach, describe, expect, it } from 'vitest';
import { callbackApi, setTokenGetter } from './index';

describe('callbackApi', () => {
  afterEach(() => {
    setTokenGetter(null);
  });

  it('attaches Bearer token when token getter returns a token', async () => {
    const token = 'fake-jwt-token';
    setTokenGetter(() => Promise.resolve(token));

    let capturedAuth: string | undefined;
    const response = await callbackApi.get('/categories/', {
      adapter: (config) => {
        capturedAuth = config.headers?.Authorization as string | undefined;
        return Promise.resolve({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      },
    });

    expect(capturedAuth).toBe(`Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('does not attach Authorization header when token getter is not set', async () => {
    let capturedAuth: string | undefined;
    await callbackApi.get('/categories/', {
      adapter: (config) => {
        capturedAuth = config.headers?.Authorization as string | undefined;
        return Promise.resolve({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      },
    });

    expect(capturedAuth).toBeUndefined();
  });

  it('does not attach Authorization header when token getter returns undefined', async () => {
    setTokenGetter(() => Promise.resolve(undefined));

    let capturedAuth: string | undefined;
    await callbackApi.get('/categories/', {
      adapter: (config) => {
        capturedAuth = config.headers?.Authorization as string | undefined;
        return Promise.resolve({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      },
    });

    expect(capturedAuth).toBeUndefined();
  });
});
