import { callbackApi } from '../../utils/callbackApi';
import { hangoutsPaths } from './constants';
import type {
  GetHangoutsResponse,
  HangoutCreate,
  HangoutRead,
  HangoutUpdate,
} from './types';

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

/**
 * Create a hangout. POST /hangouts/; returns created HangoutRead (201).
 */
export async function createHangout(body: HangoutCreate): Promise<HangoutRead> {
  const { data } = await callbackApi.post<HangoutRead>(
    hangoutsPaths.list,
    body,
  );
  return data;
}

/**
 * Get a single hangout by id. GET /hangouts/{id}.
 */
export async function getHangout(id: string): Promise<HangoutRead> {
  const { data } = await callbackApi.get<HangoutRead>(hangoutsPaths.get(id));
  return data;
}

/**
 * Update a hangout. PATCH /hangouts/{id}; returns updated HangoutRead (200).
 */
export async function updateHangout(
  id: string,
  body: HangoutUpdate,
): Promise<HangoutRead> {
  const { data } = await callbackApi.patch<HangoutRead>(
    hangoutsPaths.update(id),
    body,
  );
  return data;
}

/**
 * Delete a hangout. DELETE /hangouts/{id}; 204 no content.
 */
export async function deleteHangout(id: string): Promise<void> {
  await callbackApi.delete(hangoutsPaths.delete(id));
}
