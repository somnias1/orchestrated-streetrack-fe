import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
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
import { Categories } from './index';
import { useCategoriesStore } from './store';

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

  it('create flow: open dialog, fill form, submit, list includes new category', async () => {
    let listCalls = 0;
    server.use(
      http.get(categoriesUrl, () => {
        listCalls += 1;
        return HttpResponse.json(
          listCalls === 1
            ? []
            : [
                {
                  id: 'new-1',
                  name: 'New Cat',
                  description: null,
                  is_income: false,
                  user_id: 'u1',
                },
              ],
        );
      }),
      http.post(categoriesUrl, async ({ request }) => {
        const body = (await request.json()) as { name: string };
        if (body.name !== 'New Cat') {
          return HttpResponse.json({ detail: 'Bad' }, { status: 422 });
        }
        return HttpResponse.json(
          {
            id: 'new-1',
            name: 'New Cat',
            description: null,
            is_income: false,
            user_id: 'u1',
          },
          { status: 201 },
        );
      }),
    );

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('button', { name: /create category/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /create category/i }),
      ).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/category name/i), 'New Cat');
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Categories\s+\(1\)/)).toBeInTheDocument();
    });
    expect(screen.getByText('New Cat')).toBeInTheDocument();
  });

  it('edit flow: click Edit, change name, submit, list updated', async () => {
    const items = [
      {
        id: '1',
        name: 'Food',
        description: null,
        is_income: false,
        user_id: 'u1',
      },
    ];
    let listData = [...items];
    server.use(
      http.get(categoriesUrl, () => HttpResponse.json(listData)),
      http.patch(`${API_URL}/categories/1`, async ({ request }) => {
        const body = (await request.json()) as { name?: string };
        const updated = {
          id: '1',
          name: body.name ?? 'Food',
          description: null,
          is_income: false,
          user_id: 'u1',
        };
        listData = [updated];
        return HttpResponse.json(updated);
      }),
    );

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText('Food')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText(/edit food/i);
    await userEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /edit category/i }),
      ).toBeInTheDocument();
    });

    const nameField = screen.getByLabelText(/category name/i);
    await userEvent.clear(nameField);
    await userEvent.type(nameField, 'Food Updated');
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText('Food Updated')).toBeInTheDocument();
    });
  });

  it('delete flow: click Delete, confirm, list no longer contains category', async () => {
    const items = [
      {
        id: '1',
        name: 'ToDelete',
        description: null,
        is_income: false,
        user_id: 'u1',
      },
    ];
    let getCount = 0;
    server.use(
      http.get(categoriesUrl, () => {
        getCount += 1;
        return HttpResponse.json(getCount === 1 ? items : []);
      }),
      http.delete(`${API_URL}/categories/1`, () =>
        HttpResponse.json(null, { status: 204 }),
      ),
    );

    render(<Categories />);

    await waitFor(() => {
      expect(screen.getByText('ToDelete')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText(/delete todelete/i);
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText(/delete category «todelete»\?/i),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
    });
    expect(screen.queryByText('ToDelete')).not.toBeInTheDocument();
  });
});
