import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { config } from '../../config';
import { Subcategories } from './index';
import { useSubcategoriesStore } from './store';

const API_URL = config.apiUrl;
const subcategoriesUrl = `${API_URL}/subcategories`;

const server = setupServer();

function resetStore() {
  useSubcategoriesStore.setState({
    items: [],
    loading: false,
    error: null,
  });
}

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetStore();
});
afterAll(() => server.close());

describe('Subcategories screen', () => {
  it('shows loading spinner while fetching', async () => {
    server.use(
      http.get(subcategoriesUrl, () => {
        return new Promise((resolve) =>
          setTimeout(() => resolve(HttpResponse.json([])), 500),
        );
      }),
    );

    render(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('shows virtualized rows when API returns subcategories', async () => {
    const items = [
      {
        id: '1',
        category_id: 'cat-a',
        name: 'Groceries',
        description: 'Food shopping',
        belongs_to_income: false,
        user_id: 'u1',
      },
      {
        id: '2',
        category_id: 'cat-b',
        name: 'Salary',
        description: null,
        belongs_to_income: true,
        user_id: 'u1',
      },
    ];
    server.use(http.get(subcategoriesUrl, () => HttpResponse.json(items)));

    render(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByText(/Subcategories\s+\(2\)/)).toBeInTheDocument();
    });
    expect(
      screen.queryByText('No subcategories found.'),
    ).not.toBeInTheDocument();
  });

  it('shows error and Retry button on API failure', async () => {
    server.use(
      http.get(subcategoriesUrl, () =>
        HttpResponse.json({ detail: 'Server error' }, { status: 500 }),
      ),
    );

    render(<Subcategories />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });
  });

  it('Retry button triggers refetch', async () => {
    let callCount = 0;
    server.use(
      http.get(subcategoriesUrl, () => {
        callCount += 1;
        if (callCount === 1) {
          return HttpResponse.json({ detail: 'Error' }, { status: 500 });
        }
        return HttpResponse.json([
          {
            id: '1',
            category_id: 'cat-1',
            name: 'Groceries',
            description: null,
            belongs_to_income: false,
            user_id: 'u1',
          },
        ]);
      }),
    );

    render(<Subcategories />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText(/Subcategories\s+\(1\)/)).toBeInTheDocument();
    });
    expect(callCount).toBe(2);
  });

  it('shows empty state when API returns empty array', async () => {
    server.use(http.get(subcategoriesUrl, () => HttpResponse.json([])));

    render(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByText('No subcategories found.')).toBeInTheDocument();
    });
  });
});
