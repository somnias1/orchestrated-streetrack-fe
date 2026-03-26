import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import type React from 'react';
import { config } from '../../config';
import { toPaginatedRead } from '../../services/pagination';
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

/** Transaction date in current year-month so default filter includes it */
function currentMonthDate(day = 1): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const subcategoryDetailRead = (id: string, name: string) => ({
  id,
  category_id: 'cat-1',
  category_name: 'Food',
  name,
  description: null,
  belongs_to_income: false,
  is_periodic: false,
  due_day: null,
  user_id: 'u1',
});

const defaultHandlers = [
  http.get(subcategoriesUrl, () => HttpResponse.json(toPaginatedRead([]))),
  http.get(hangoutsUrl, () => HttpResponse.json(toPaginatedRead([]))),
  http.get(`${API_URL}/subcategories/:id/`, ({ params }) => {
    const id = params.id as string;
    if (id === 'sub-1') {
      return HttpResponse.json(subcategoryDetailRead('sub-1', 'Food'));
    }
    if (id === 'sub-a') {
      return HttpResponse.json(subcategoryDetailRead('sub-a', 'Groceries'));
    }
    return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
  }),
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
          setTimeout(
            () => resolve(HttpResponse.json(toPaginatedRead([]))),
            500,
          ),
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
        subcategory_name: 'Groceries',
        value: 1000,
        description: 'Coffee',
        date: currentMonthDate(1),
        hangout_id: null,
        hangout_name: null,
        user_id: 'u1',
      },
      {
        id: '2',
        subcategory_id: 'sub-b',
        subcategory_name: 'Dining',
        value: -500,
        description: 'Lunch',
        date: currentMonthDate(2),
        hangout_id: 'hang-1',
        hangout_name: 'Team Lunch',
        user_id: 'u1',
      },
    ];
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () =>
        HttpResponse.json(toPaginatedRead(items)),
      ),
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
        return HttpResponse.json(
          toPaginatedRead([
            {
              id: '1',
              subcategory_id: 'sub-1',
              subcategory_name: 'Groceries',
              value: 100,
              description: 'Snack',
              date: currentMonthDate(1),
              hangout_id: null,
              hangout_name: null,
              user_id: 'u1',
            },
          ]),
        );
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
      http.get(transactionsUrl, () => HttpResponse.json(toPaginatedRead([]))),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(screen.getByText('No transactions found.')).toBeInTheDocument();
    });
  });

  it('has Add button with Transaction and Bulk menu', async () => {
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => HttpResponse.json(toPaginatedRead([]))),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: /transaction/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /bulk/i }),
      ).toBeInTheDocument();
    });
  });

  it('create flow: open dialog, submit creates and refetches list', async () => {
    const subcategories = [
      {
        id: 'sub-1',
        category_id: 'cat-1',
        category_name: 'Food',
        name: 'Food',
        description: null,
        belongs_to_income: false,
        user_id: 'u1',
      },
    ];
    const created = {
      id: 'tx-new',
      subcategory_id: 'sub-1',
      subcategory_name: 'Food',
      value: 500,
      description: 'Lunch',
      date: currentMonthDate(1),
      hangout_id: null,
      hangout_name: null,
      user_id: 'u1',
    };
    const listAfterCreate = [created];

    server.use(
      http.get(subcategoriesUrl, () =>
        HttpResponse.json(toPaginatedRead(subcategories)),
      ),
      http.get(hangoutsUrl, () => HttpResponse.json(toPaginatedRead([]))),
      http.get(transactionsUrl, () =>
        HttpResponse.json(toPaginatedRead(listAfterCreate)),
      ),
      http.post(transactionsUrl, async ({ request }) => {
        const body = await request.json();
        expect(body).toMatchObject({
          subcategory_id: 'sub-1',
          value: 500,
          description: 'Lunch',
          date: currentMonthDate(1),
        });
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    renderWithQueryClient(<Transactions />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: /transaction/i }),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByRole('menuitem', { name: /transaction/i }),
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
    await userEvent.type(
      within(dialog).getByLabelText(/date/i),
      currentMonthDate(1),
    );
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
        subcategory_name: 'Groceries',
        value: 1000,
        description: 'Coffee',
        date: currentMonthDate(1),
        hangout_id: null,
        hangout_name: null,
        user_id: 'u1',
      },
    ];
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () =>
        HttpResponse.json(toPaginatedRead(items)),
      ),
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
        subcategory_name: 'Groceries',
        value: 1000,
        description: 'Coffee',
        date: currentMonthDate(1),
        hangout_id: null,
        hangout_name: null,
        user_id: 'u1',
      },
    ];
    let getCallCount = 0;
    server.use(
      ...defaultHandlers,
      http.get(transactionsUrl, () => {
        getCallCount += 1;
        return HttpResponse.json(
          getCallCount === 1 ? toPaginatedRead(items) : toPaginatedRead([]),
        );
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
