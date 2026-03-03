import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { config } from '../../config';
import { Transactions } from './index';
import { useTransactionsStore } from './store';

const API_URL = config.apiUrl;
const transactionsUrl = `${API_URL}/transactions`;

const server = setupServer();

function resetStore() {
  useTransactionsStore.setState({
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

describe('Transactions screen', () => {
  it('shows loading spinner while fetching', async () => {
    server.use(
      http.get(transactionsUrl, () => {
        return new Promise((resolve) =>
          setTimeout(() => resolve(HttpResponse.json([])), 500),
        );
      }),
    );

    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('shows virtualized rows when API returns transactions', async () => {
    const items = [
      {
        id: '1',
        subcategory_id: 'sub-a',
        value: 1000,
        description: 'Coffee',
        date: '2026-03-01',
        hangout_id: null,
        user_id: 'u1',
      },
      {
        id: '2',
        subcategory_id: 'sub-b',
        value: -500,
        description: 'Lunch',
        date: '2026-03-02',
        hangout_id: 'hang-1',
        user_id: 'u1',
      },
    ];
    server.use(http.get(transactionsUrl, () => HttpResponse.json(items)));

    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText(/Transactions\s+\(2\)/)).toBeInTheDocument();
    });
    expect(
      screen.queryByText('No transactions found.'),
    ).not.toBeInTheDocument();
  });

  it('shows error and Retry button on API failure', async () => {
    server.use(
      http.get(transactionsUrl, () =>
        HttpResponse.json({ detail: 'Server error' }, { status: 500 }),
      ),
    );

    render(<Transactions />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });
  });

  it('Retry button triggers refetch', async () => {
    let callCount = 0;
    server.use(
      http.get(
        ({ request }) => new URL(request.url).pathname === '/transactions',
        () => {
          callCount += 1;
          if (callCount === 1) {
            return HttpResponse.json({ detail: 'Error' }, { status: 500 });
          }
          return HttpResponse.json([
            {
              id: '1',
              subcategory_id: 'sub-1',
              value: 100,
              description: 'Snack',
              date: '2026-03-01',
              hangout_id: null,
              user_id: 'u1',
            },
          ]);
        },
      ),
    );

    render(<Transactions />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText(/Transactions\s+\(1\)/)).toBeInTheDocument();
    });
    expect(callCount).toBe(2);
  });

  it('shows empty state when API returns empty array', async () => {
    server.use(http.get(transactionsUrl, () => HttpResponse.json([])));

    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('No transactions found.')).toBeInTheDocument();
    });
  });
});
