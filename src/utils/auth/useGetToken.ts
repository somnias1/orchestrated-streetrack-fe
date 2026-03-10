import { type GetTokenSilentlyOptions, useAuth0 } from '@auth0/auth0-react';
import { config } from '../../config';
import { routes } from '../../routes';

/**
 * Returns a function that resolves the current access token for API calls.
 * Use with callbackApi so every request includes the Bearer token.
 */
export function useGetToken() {
  const { getAccessTokenSilently, logout } = useAuth0();
  const { audience } = config.auth0;
  try {
    return async () => {
      const token = await getAccessTokenSilently({
        audience,
      } as GetTokenSilentlyOptions);
      return token;
    };
  } catch (error) {
    console.error(error);
    logout({
      logoutParams: {
        returnTo: window.location.origin + routes.auth.login,
      },
    });
    throw error;
  }
}
