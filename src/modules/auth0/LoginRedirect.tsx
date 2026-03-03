import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

/**
 * Redirects to Auth0 login. Use as the component for routes.auth.login.
 */
export function LoginRedirect() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      Redirecting to login…
    </div>
  );
}
