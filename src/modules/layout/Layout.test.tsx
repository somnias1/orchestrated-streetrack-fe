import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

  it('shows Home, Categories, Subcategories, Transactions, and Hangouts links with routes from routes.ts', () => {
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
    const transactionsLink = screen.getByRole('link', {
      name: /^transactions$/i,
    });
    const hangoutsLink = screen.getByRole('link', {
      name: /^hangouts$/i,
    });

    expect(homeLink).toBeInTheDocument();
    expect(categoriesLink).toBeInTheDocument();
    expect(subcategoriesLink).toBeInTheDocument();
    expect(transactionsLink).toBeInTheDocument();
    expect(hangoutsLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', routes.home);
    expect(categoriesLink).toHaveAttribute('href', routes.categories);
    expect(subcategoriesLink).toHaveAttribute('href', routes.subcategories);
    expect(transactionsLink).toHaveAttribute('href', routes.transactions);
    expect(hangoutsLink).toHaveAttribute('href', routes.hangouts);
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
