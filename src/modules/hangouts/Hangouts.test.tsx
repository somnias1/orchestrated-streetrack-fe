import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import type React from 'react';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { config } from '../../config';
import { Hangouts } from './index';

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (opts: { count: number }) => ({
    getVirtualItems: () =>
      Array.from({ length: opts.count }, (_, i) => ({
        index: i,
        start: i * 48,
        size: 48,
        end: (i + 1) * 48,
      })),
    getTotalSize: () => opts.count * 48,
  }),
}));

const API_URL = config.apiUrl;
const hangoutsUrl = `${API_URL}/hangouts`;

const server = setupServer();

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
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

    renderWithQueryClient(<Hangouts />);

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

    renderWithQueryClient(<Hangouts />);

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

    renderWithQueryClient(<Hangouts />);

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
        ({ request }) =>
          new URL(request.url).pathname === '/hangouts/' ||
          new URL(request.url).pathname === '/hangouts',
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

    renderWithQueryClient(<Hangouts />);

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

    renderWithQueryClient(<Hangouts />);

    await waitFor(() => {
      expect(screen.getByText('No hangouts found.')).toBeInTheDocument();
    });
  });

  it('has Create hangout button', async () => {
    server.use(http.get(hangoutsUrl, () => HttpResponse.json([])));

    renderWithQueryClient(<Hangouts />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create hangout/i }),
      ).toBeInTheDocument();
    });
  });

  it('create flow: open dialog, submit creates and refetches list', async () => {
    const created = {
      id: 'h-new',
      name: 'Brunch',
      description: 'Weekend brunch',
      date: '2026-03-01',
      user_id: 'u1',
    };
    const listAfterCreate = [created];

    server.use(
      http.get(hangoutsUrl, () => HttpResponse.json(listAfterCreate)),
      http.post(hangoutsUrl, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        expect(body).toMatchObject({
          name: 'Brunch',
          date: '2026-03-01',
          description: 'Weekend brunch',
        });
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithQueryClient(<Hangouts />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create hangout/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /create hangout/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /create hangout/i }),
      ).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: /create hangout/i });
    await userEvent.type(
      within(dialog).getByLabelText(/hangout name/i),
      'Brunch',
    );
    await userEvent.type(within(dialog).getByLabelText(/date/i), '2026-03-01');
    await userEvent.type(
      within(dialog).getByLabelText(/description/i),
      'Weekend brunch',
    );
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Hangouts\s+\(1\)/)).toBeInTheDocument();
    });
  });

  it('edit flow: edit button opens dialog with prefilled data', async () => {
    const items = [
      {
        id: 'h-1',
        name: 'Brunch',
        description: 'Weekend brunch',
        date: '2026-03-01',
        user_id: 'u1',
      },
    ];
    server.use(
      http.get(hangoutsUrl, () => HttpResponse.json(items)),
      http.patch(`${API_URL}/hangouts/h-1`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        expect(body).toMatchObject({ name: 'Updated brunch' });
        return HttpResponse.json({
          ...items[0],
          name: 'Updated brunch',
        });
      }),
    );

    renderWithQueryClient(<Hangouts />);

    await waitFor(() => {
      expect(screen.getByText(/Hangouts\s+\(1\)/)).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', {
      name: /edit brunch/i,
    });
    await userEvent.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /edit hangout/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/hangout name/i)).toHaveValue('Brunch');
  });

  it('delete flow: delete button opens confirm dialog, confirm deletes', async () => {
    const items = [
      {
        id: 'h-1',
        name: 'Brunch',
        description: null,
        date: '2026-03-01',
        user_id: 'u1',
      },
    ];
    let getCallCount = 0;
    server.use(
      http.get(hangoutsUrl, () => {
        getCallCount += 1;
        return HttpResponse.json(getCallCount === 1 ? items : []);
      }),
      http.delete(`${API_URL}/hangouts/h-1`, () =>
        HttpResponse.json(null, { status: 204 }),
      ),
    );

    renderWithQueryClient(<Hangouts />);

    await waitFor(() => {
      expect(screen.getByText(/Hangouts\s+\(1\)/)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', {
      name: /delete brunch/i,
    });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /delete hangout/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/delete this hangout\?/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('No hangouts found.')).toBeInTheDocument();
    });
  });
});
