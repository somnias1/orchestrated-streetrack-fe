import { useAuth0 } from '@auth0/auth0-react';

/**
 * Returns a function that resolves the current access token for API calls.
 * Use with callbackApi so every request includes the Bearer token.
 */
export function useGetToken(): () => Promise<string | undefined> {
  const { getAccessTokenSilently } = useAuth0();
  return getAccessTokenSilently;
}
