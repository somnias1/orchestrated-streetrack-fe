import { useAuth0 } from '@auth0/auth0-react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { routes } from '../../routes';

type Props = Readonly<{
  children: ReactNode;
}>;

/**
 * Renders children when authenticated; otherwise redirects to login.
 */
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading…</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={routes.auth.login} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}
