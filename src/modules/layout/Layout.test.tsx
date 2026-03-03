import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { routes } from '../../routes';
import { Layout } from './index';

const mockUseAuth0 = vi.fn();
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockUseAuth0(),
}));

describe('Layout', () => {
  beforeEach(() => {
    mockUseAuth0.mockReturnValue({
      logout: vi.fn(),
    });
  });

  it('shows Home, Categories, and Subcategories links with routes from routes.ts', () => {
    render(
      <MemoryRouter>
        <Layout>
          <span>Page content</span>
        </Layout>
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link', { name: /^home$/i });
    const categoriesLink = screen.getByRole('link', { name: /^categories$/i });
    const subcategoriesLink = screen.getByRole('link', {
      name: /^subcategories$/i,
    });

    expect(homeLink).toBeInTheDocument();
    expect(categoriesLink).toBeInTheDocument();
    expect(subcategoriesLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', routes.home);
    expect(categoriesLink).toHaveAttribute('href', routes.categories);
    expect(subcategoriesLink).toHaveAttribute('href', routes.subcategories);
  });

  it('renders children in the main content area', () => {
    render(
      <MemoryRouter>
        <Layout>
          <span>Page content</span>
        </Layout>
      </MemoryRouter>,
    );

    expect(screen.getByText('Page content')).toBeInTheDocument();
  });
});
