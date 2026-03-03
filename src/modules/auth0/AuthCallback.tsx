import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

/**
 * Auth0 callback route. Renders while the SDK processes the redirect; then navigates to home.
 */
export function AuthCallback() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(routes.home, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>Completing login…</div>
  );
}
