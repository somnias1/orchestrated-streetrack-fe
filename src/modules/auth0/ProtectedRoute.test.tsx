import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { routes } from '../../routes';
import { ProtectedRoute } from './ProtectedRoute';

const mockUseAuth0 = vi.fn();
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockUseAuth0(),
}));

function renderWithRouter(ui: React.ReactElement, initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path={routes.auth.login} element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to login when not authenticated', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <span>Protected content</span>
      </ProtectedRoute>,
    );

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('shows loading when isLoading is true', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    renderWithRouter(
      <ProtectedRoute>
        <span>Protected content</span>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <span>Protected content</span>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });
});
