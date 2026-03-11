import axios from 'axios';
import callbackApi from './callback';

vi.mock('axios', () => ({
  default: vi.fn(),
}));

describe('callbackApi', () => {
  beforeEach(() => {
    vi.mocked(axios).mockReset();
  });

  it('attaches Bearer token when getToken returns a token', async () => {
    const token = 'fake-jwt-token';
    const getToken = vi.fn().mockResolvedValue(token);
    vi.mocked(axios).mockResolvedValue({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as never,
    });

    await callbackApi(getToken, '/categories/', {});

    expect(axios).toHaveBeenCalledTimes(1);
    const callConfig = vi.mocked(axios).mock.calls[0]?.[0];
    expect(callConfig?.headers?.Authorization).toBe(`Bearer ${token}`);
  });

  it('throws when getToken returns empty string', async () => {
    const getToken = vi.fn().mockResolvedValue('');
    await expect(callbackApi(getToken, '/categories/', {})).rejects.toThrow(
      'Token not found',
    );
    expect(axios).not.toHaveBeenCalled();
  });

  it('throws when getToken returns undefined', async () => {
    const getToken = vi.fn().mockResolvedValue(undefined);
    await expect(callbackApi(getToken, '/categories/', {})).rejects.toThrow(
      'Token not found',
    );
    expect(axios).not.toHaveBeenCalled();
  });
});
