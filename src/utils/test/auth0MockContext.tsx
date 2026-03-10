import type { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import { createContext, type ReactNode, useMemo } from 'react';
import { vi } from 'vitest';

/**
 * Mock shape for Auth0's useAuth0() return value.
 * Used by tests that need a logged-in user (e.g. useCallbackApi, useGetToken, ProtectedRoute).
 */
export interface MockAuth0Value {
  user: { sub: string; name?: string; email?: string } | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  getAccessTokenSilently: (
    options?: GetTokenSilentlyOptions,
  ) => Promise<string>;
  logout: (options?: { logoutParams?: { returnTo?: string } }) => void;
  loginWithRedirect: () => Promise<void>;
}

const defaultMockAuth0Value: MockAuth0Value = {
  user: { sub: 'test-user-id', name: 'Test User', email: 'test@example.com' },
  isAuthenticated: true,
  isLoading: false,
  getAccessTokenSilently: vi.fn().mockResolvedValue('test-access-token'),
  logout: vi.fn(),
  loginWithRedirect: vi.fn().mockResolvedValue(undefined),
};

export const Auth0MockContext = createContext<MockAuth0Value>(
  defaultMockAuth0Value,
);

export function Auth0MockProvider({
  children,
  value,
}: {
  children: ReactNode;
  value?: Partial<MockAuth0Value>;
}) {
  const merged = useMemo<MockAuth0Value>(
    () => ({
      ...defaultMockAuth0Value,
      ...value,
    }),
    [value],
  );
  return (
    <Auth0MockContext.Provider value={merged}>
      {children}
    </Auth0MockContext.Provider>
  );
}

export { defaultMockAuth0Value };
