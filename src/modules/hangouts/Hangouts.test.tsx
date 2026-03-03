import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { config } from '../../config';
import { Hangouts } from './index';
import { useHangoutsStore } from './store';

const API_URL = config.apiUrl;
const hangoutsUrl = `${API_URL}/hangouts`;

const server = setupServer();

function resetStore() {
  useHangoutsStore.setState({
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

describe('Hangouts screen', () => {
  it('shows loading spinner while fetching', async () => {
    server.use(
      http.get(hangoutsUrl, () => {
        return new Promise((resolve) =>
          setTimeout(() => resolve(HttpResponse.json([])), 500),
        );
      }),
    );

    render(<Hangouts />);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('shows virtualized rows when API returns hangouts', async () => {
    const items = [
      {
        id: '1',
        name: 'Brunch',
        description: 'Weekend brunch',
        date: '2026-03-01',
        user_id: 'u1',
      },
      {
        id: '2',
        name: 'Movie night',
        description: null,
        date: '2026-03-02',
        user_id: 'u1',
      },
    ];
    server.use(http.get(hangoutsUrl, () => HttpResponse.json(items)));

    render(<Hangouts />);

    await waitFor(() => {
      expect(screen.getByText(/Hangouts\s+\(2\)/)).toBeInTheDocument();
    });
    expect(screen.queryByText('No hangouts found.')).not.toBeInTheDocument();
  });

  it('shows error and Retry button on API failure', async () => {
    server.use(
      http.get(hangoutsUrl, () =>
        HttpResponse.json({ detail: 'Server error' }, { status: 500 }),
      ),
    );

    render(<Hangouts />);

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
        ({ request }) => new URL(request.url).pathname === '/hangouts',
        () => {
          callCount += 1;
          if (callCount === 1) {
            return HttpResponse.json({ detail: 'Error' }, { status: 500 });
          }
          return HttpResponse.json([
            {
              id: '1',
              name: 'Coffee',
              description: null,
              date: '2026-03-01',
              user_id: 'u1',
            },
          ]);
        },
      ),
    );

    render(<Hangouts />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(screen.getByText(/Hangouts\s+\(1\)/)).toBeInTheDocument();
    });
    expect(callCount).toBe(2);
  });

  it('shows empty state when API returns empty array', async () => {
    server.use(http.get(hangoutsUrl, () => HttpResponse.json([])));

    render(<Hangouts />);

    await waitFor(() => {
      expect(screen.getByText('No hangouts found.')).toBeInTheDocument();
    });
  });
});
