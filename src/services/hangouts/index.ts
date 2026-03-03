import { callbackApi } from '../../utils/callbackApi';
import { hangoutsPaths } from './constants';
import type { GetHangoutsResponse, HangoutRead } from './types';

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 50;

/**
 * Fetch hangouts list from the backend. Uses callbackApi (Bearer token attached by interceptor).
 * TECHSPEC §4.3: skip and limit optional; defaults 0, 50.
 */
export async function fetchHangouts(options?: {
  skip?: number;
  limit?: number;
}): Promise<HangoutRead[]> {
  const skip = options?.skip ?? DEFAULT_SKIP;
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const { data } = await callbackApi.get<GetHangoutsResponse>(
    hangoutsPaths.list,
    { params: { skip, limit } },
  );
  return data;
}
