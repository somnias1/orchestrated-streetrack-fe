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
import { Transactions } from './index';

// Virtualized table rows render in jsdom (virtualizer otherwise sees 0 height)
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
const transactionsUrl = `${API_URL}/transactions`;
const subcategoriesUrl = `${API_URL}/subcategories`;
const hangoutsUrl = `${API_URL}/hangouts`;

const defaultHandlers = [
  http.get(subcategoriesUrl, () => HttpResponse.json([])),
  http.get(hangoutsUrl, () => HttpResponse.json([])),
];

const server = setupServer(...defaultHandlers);

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

describe('Transactions screen', () => {
  it('shows loading spinner while fetching', async () => {
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => {
        return new Promise((resolve) =>
          setTimeout(() => resolve(HttpResponse.json([])), 500),
        );
      }),
    );

    renderWithQueryClient(<Transactions />);

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
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => HttpResponse.json(items)),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText(/Transactions\s+\(2\)/)).toBeInTheDocument();
    });
    expect(
      screen.queryByText('No transactions found.'),
    ).not.toBeInTheDocument();
  });

  it('shows error and Retry button on API failure', async () => {
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () =>
        HttpResponse.json({ detail: 'Server error' }, { status: 500 }),
      ),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });
  });

  it('Retry button triggers refetch', async () => {
    let callCount = 0;
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => {
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
      }),
    );

    renderWithQueryClient(<Transactions />);

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
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => HttpResponse.json([])),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('No transactions found.')).toBeInTheDocument();
    });
  });

  it('has Create transaction button', async () => {
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => HttpResponse.json([])),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create transaction/i }),
      ).toBeInTheDocument();
    });
  });

  it('create flow: open dialog, submit creates and refetches list', async () => {
    const subcategories = [
      {
        id: 'sub-1',
        category_id: 'cat-1',
        name: 'Food',
        description: null,
        belongs_to_income: false,
        user_id: 'u1',
      },
    ];
    const created = {
      id: 'tx-new',
      subcategory_id: 'sub-1',
      value: 500,
      description: 'Lunch',
      date: '2026-03-01',
      hangout_id: null,
      user_id: 'u1',
    };
    const listAfterCreate = [created];

    server.use(
      http.get(subcategoriesUrl, () => HttpResponse.json(subcategories)),
      http.get(hangoutsUrl, () => HttpResponse.json([])),
      http.get(transactionsUrl, () => HttpResponse.json(listAfterCreate)),
      http.post(transactionsUrl, async ({ request }) => {
        const body = await request.json();
        expect(body).toMatchObject({
          subcategory_id: 'sub-1',
          value: 500,
          description: 'Lunch',
          date: '2026-03-01',
        });
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create transaction/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /create transaction/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /create transaction/i }),
      ).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: /create transaction/i });
    await userEvent.click(within(dialog).getByLabelText(/subcategory/i));
    const subcategoryOption = await screen.findByRole('option', {
      name: /Food/,
    });
    await userEvent.click(subcategoryOption);
    await userEvent.clear(
      within(dialog).getByRole('spinbutton', { name: /value/i }),
    );
    await userEvent.type(
      within(dialog).getByRole('spinbutton', { name: /value/i }),
      '500',
    );
    await userEvent.type(
      within(dialog).getByLabelText(/description/i),
      'Lunch',
    );
    await userEvent.type(within(dialog).getByLabelText(/date/i), '2026-03-01');
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Transactions\s+\(1\)/)).toBeInTheDocument();
    });
  });

  it('edit flow: edit button opens dialog with prefilled data', async () => {
    const items = [
      {
        id: 'tx-1',
        subcategory_id: 'sub-a',
        value: 1000,
        description: 'Coffee',
        date: '2026-03-01',
        hangout_id: null,
        user_id: 'u1',
      },
    ];
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => HttpResponse.json(items)),
      http.patch(`${API_URL}/transactions/tx-1`, async ({ request }) => {
        const body = await request.json();
        expect(body).toMatchObject({ description: 'Updated coffee' });
        return HttpResponse.json({
          ...items[0],
          description: 'Updated coffee',
        });
      }),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText(/Transactions\s+\(1\)/)).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', {
      name: /edit transaction coffee/i,
    });
    await userEvent.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /edit transaction/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/description/i)).toHaveValue('Coffee');
  });

  it('delete flow: delete button opens confirm dialog, confirm deletes', async () => {
    const items = [
      {
        id: 'tx-1',
        subcategory_id: 'sub-a',
        value: 1000,
        description: 'Coffee',
        date: '2026-03-01',
        hangout_id: null,
        user_id: 'u1',
      },
    ];
    let getCallCount = 0;
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => {
        getCallCount += 1;
        return HttpResponse.json(getCallCount === 1 ? items : []);
      }),
      http.delete(`${API_URL}/transactions/tx-1`, () =>
        HttpResponse.json(null, { status: 204 }),
      ),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText(/Transactions\s+\(1\)/)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', {
      name: /delete transaction coffee/i,
    });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /delete transaction/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/delete this transaction\?/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('No transactions found.')).toBeInTheDocument();
    });
  });
});
