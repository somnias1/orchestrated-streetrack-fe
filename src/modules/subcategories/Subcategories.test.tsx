import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import type React from 'react';
import { config } from '../../config';
import { Subcategories } from './index';

// So virtualized table rows render in jsdom (virtualizer otherwise sees 0 height)
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
const subcategoriesUrl = `${API_URL}/subcategories`;
const categoriesUrl = `${API_URL}/categories`;

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

describe('Subcategories screen', () => {
  it('shows loading spinner while fetching', async () => {
    server.use(
      http.get(subcategoriesUrl, () => {
        return new Promise((resolve) =>
          setTimeout(() => resolve(HttpResponse.json([])), 500),
        );
      }),
      http.get(categoriesUrl, () => HttpResponse.json([])),
    );

    renderWithQueryClient(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('shows virtualized rows when API returns subcategories', async () => {
    const items = [
      {
        id: '1',
        category_id: 'cat-a',
        category_name: 'Food',
        name: 'Groceries',
        description: 'Food shopping',
        belongs_to_income: false,
        is_periodic: false,
        due_day: null,
        user_id: 'u1',
      },
      {
        id: '2',
        category_id: 'cat-b',
        category_name: 'Income',
        name: 'Salary',
        description: null,
        belongs_to_income: true,
        is_periodic: false,
        due_day: null,
        user_id: 'u1',
      },
    ];
    server.use(
      http.get(subcategoriesUrl, () => HttpResponse.json(items)),
      http.get(categoriesUrl, () => HttpResponse.json([])),
    );

    renderWithQueryClient(<Subcategories />);

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
      http.get(categoriesUrl, () => HttpResponse.json([])),
    );

    renderWithQueryClient(<Subcategories />);

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
            category_name: 'Food',
            name: 'Groceries',
            description: null,
            belongs_to_income: false,
            is_periodic: false,
            due_day: null,
            user_id: 'u1',
          },
        ]);
      }),
      http.get(categoriesUrl, () => HttpResponse.json([])),
    );

    renderWithQueryClient(<Subcategories />);

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
    server.use(
      http.get(subcategoriesUrl, () => HttpResponse.json([])),
      http.get(categoriesUrl, () => HttpResponse.json([])),
    );

    renderWithQueryClient(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByText('No subcategories found.')).toBeInTheDocument();
    });
  });

  it('create flow: open dialog, fill form, submit, list includes new subcategory', async () => {
    const categories = [
      {
        id: 'cat-1',
        name: 'Food',
        description: null,
        is_income: false,
        user_id: 'u1',
      },
    ];
    let listCalls = 0;
    server.use(
      http.get(categoriesUrl, () => HttpResponse.json(categories)),
      http.get(subcategoriesUrl, () => {
        listCalls += 1;
        return HttpResponse.json(
          listCalls === 1
            ? []
            : [
                {
                  id: 'new-1',
                  category_id: 'cat-1',
                  category_name: 'Food',
                  name: 'New Sub',
                  description: null,
                  belongs_to_income: false,
                  is_periodic: false,
                  due_day: null,
                  user_id: 'u1',
                },
              ],
        );
      }),
      http.post(subcategoriesUrl, async ({ request }) => {
        const body = (await request.json()) as { name: string };
        if (body.name !== 'New Sub') {
          return HttpResponse.json({ detail: 'Bad' }, { status: 422 });
        }
        return HttpResponse.json(
          {
            id: 'new-1',
            category_id: 'cat-1',
            category_name: 'Food',
            name: 'New Sub',
            description: null,
            belongs_to_income: false,
            is_periodic: false,
            due_day: null,
            user_id: 'u1',
          },
          { status: 201 },
        );
      }),
    );

    renderWithQueryClient(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByText('No subcategories found.')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /create subcategory/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /create subcategory/i }),
      ).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: /create subcategory/i });
    await userEvent.click(within(dialog).getByLabelText(/^category$/i));
    const categoryOption = await screen.findByRole('option', {
      name: /Food/,
    });
    await userEvent.click(categoryOption);
    await userEvent.type(
      within(dialog).getByLabelText(/subcategory name/i),
      'New Sub',
    );
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Subcategories\s+\(1\)/)).toBeInTheDocument();
    });
    expect(screen.getByText('New Sub')).toBeInTheDocument();
  });

  it('edit flow: click Edit, change name, submit, list updated', async () => {
    const categories = [
      {
        id: 'cat-1',
        name: 'Food',
        description: null,
        is_income: false,
        user_id: 'u1',
      },
    ];
    const items = [
      {
        id: '1',
        category_id: 'cat-1',
        category_name: 'Food',
        name: 'Groceries',
        description: null,
        belongs_to_income: false,
        is_periodic: false,
        due_day: null,
        user_id: 'u1',
      },
    ];
    let listData = [...items];
    server.use(
      http.get(categoriesUrl, () => HttpResponse.json(categories)),
      http.get(subcategoriesUrl, () => HttpResponse.json(listData)),
      http.patch(`${API_URL}/subcategories/1`, async ({ request }) => {
        const body = (await request.json()) as { name?: string };
        const updated = {
          id: '1',
          category_id: 'cat-1',
          category_name: 'Food',
          name: body.name ?? 'Groceries',
          description: null,
          belongs_to_income: false,
          is_periodic: false,
          due_day: null,
          user_id: 'u1',
        };
        listData = [updated];
        return HttpResponse.json(updated);
      }),
    );

    renderWithQueryClient(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText(/edit groceries/i);
    await userEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /edit subcategory/i }),
      ).toBeInTheDocument();
    });

    const nameField = screen.getByLabelText(/subcategory name/i);
    await userEvent.clear(nameField);
    await userEvent.type(nameField, 'Groceries Updated');
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText('Groceries Updated')).toBeInTheDocument();
    });
  });

  it('delete flow: click Delete, confirm, list no longer contains subcategory', async () => {
    const categories = [
      {
        id: 'cat-1',
        name: 'Food',
        description: null,
        is_income: false,
        user_id: 'u1',
      },
    ];
    const items = [
      {
        id: '1',
        category_id: 'cat-1',
        category_name: 'Food',
        name: 'ToDelete',
        description: null,
        belongs_to_income: false,
        is_periodic: false,
        due_day: null,
        user_id: 'u1',
      },
    ];
    let getCount = 0;
    server.use(
      http.get(categoriesUrl, () => HttpResponse.json(categories)),
      http.get(subcategoriesUrl, () => {
        getCount += 1;
        return HttpResponse.json(getCount === 1 ? items : []);
      }),
      http.delete(`${API_URL}/subcategories/1`, () =>
        HttpResponse.json(null, { status: 204 }),
      ),
    );

    renderWithQueryClient(<Subcategories />);

    await waitFor(() => {
      expect(screen.getByText('ToDelete')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText(/delete todelete/i);
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText(/delete subcategory «todelete»\?/i),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.getByText('No subcategories found.')).toBeInTheDocument();
    });
    expect(screen.queryByText('ToDelete')).not.toBeInTheDocument();
  });
});
