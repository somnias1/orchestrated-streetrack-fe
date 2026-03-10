import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('@auth0/auth0-react', async () => {
  const React = await import('react');
  const { Auth0MockContext } = await import('./utils/test/auth0MockContext');
  return {
    useAuth0: () => React.useContext(Auth0MockContext),
  };
});

afterEach(() => {
  cleanup();
});
