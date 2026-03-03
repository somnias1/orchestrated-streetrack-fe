import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { config } from '../../config';
import { Categories } from './index';
import { useCategoriesStore } from './store';

const API_URL = config.apiUrl;
const categoriesUrl = `${API_URL}/categories`;

const server = setupServer();

function resetStore() {
  useCategoriesStore.setState({
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

describe('Categories screen', () => {
  it('shows loading spinner while fetching', async () => {
    server.use(
      http.get(categoriesUrl, () => {
        return new Promise((resolve) =>
          setTimeout(() => resolve(HttpResponse.json([])), 500),
        );
      }),
    );

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('shows virtualized rows when API returns categories', async () => {
    const items = [
      {
        id: '1',
        name: 'Food',
        description: 'Groceries',
        is_income: false,
        user_id: 'u1',
      },
      {
        id: '2',
        name: 'Salary',
        description: null,
        is_income: true,
        user_id: 'u1',
      },
    ];
    server.use(http.get(categoriesUrl, () => HttpResponse.json(items)));

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText(/Categories\s+\(2\)/)).toBeInTheDocument();
    });
    expect(screen.queryByText('No categories found.')).not.toBeInTheDocument();
  });

  it('shows error and Retry button on API failure', async () => {
    server.use(
      http.get(categoriesUrl, () =>
        HttpResponse.json({ detail: 'Server error' }, { status: 500 }),
      ),
    );

    render(<Categories />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('Retry button triggers refetch', async () => {
    let callCount = 0;
    server.use(
      http.get(categoriesUrl, () => {
        callCount += 1;
        if (callCount === 1) {
          return HttpResponse.json({ detail: 'Error' }, { status: 500 });
        }
        return HttpResponse.json([
          {
            id: '1',
            name: 'Food',
            description: null,
            is_income: false,
            user_id: 'u1',
          },
        ]);
      }),
    );

    render(<Categories />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText(/Categories\s+\(1\)/)).toBeInTheDocument();
    });
    expect(callCount).toBe(2);
  });

  it('shows empty state when API returns empty array', async () => {
    server.use(http.get(categoriesUrl, () => HttpResponse.json([])));

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
    });
  });
});
