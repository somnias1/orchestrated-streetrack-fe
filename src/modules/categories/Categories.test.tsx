import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { config } from '../../config';
import { categoriesPaths } from '../../services/categories/constants';
import { categoriesMock, categoryMock } from '../../services/categories/mocks';
import { Auth0MockProvider } from '../../utils/test/auth0MockContext';
import ProviderWrapper from '../../utils/test/provider';
import { Categories } from './index';

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
const categoriesUrl = `${API_URL}/${categoriesPaths.list}`;

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
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

    render(
      <ProviderWrapper>
        <Categories />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('shows virtualized rows when API returns categories', async () => {
    const items = categoriesMock(2);
    server.use(http.get(categoriesUrl, () => HttpResponse.json(items)));

    render(
      <ProviderWrapper>
        <Categories />
      </ProviderWrapper>,
    );

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

    const noRetryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={noRetryClient}>
        <Auth0MockProvider>
          <Categories />
        </Auth0MockProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });
  });

  it('Retry button triggers refetch', async () => {
    let callCount = 0;
    server.use(
      http.get(categoriesUrl, () => {
        callCount += 1;
        if (callCount === 1) {
          return HttpResponse.json({ detail: 'Error' }, { status: 500 });
        }
        return HttpResponse.json([categoryMock()]);
      }),
    );

    const noRetryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={noRetryClient}>
        <Auth0MockProvider>
          <Categories />
        </Auth0MockProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('retry-button'));

    await waitFor(() => {
      expect(screen.getByText(/Categories\s+\(1\)/)).toBeInTheDocument();
    });
    expect(callCount).toBe(2);
  });

  it('shows empty state when API returns empty array', async () => {
    server.use(http.get(categoriesUrl, () => HttpResponse.json([])));

    render(
      <ProviderWrapper>
        <Categories />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
    });
  });

  it('create flow: open dialog, fill form, submit, list includes new category', async () => {
    let listCalls = 0;
    const created = categoryMock();
    server.use(
      http.get(categoriesUrl, () => {
        listCalls += 1;
        return HttpResponse.json(listCalls === 1 ? [] : [created]);
      }),
      http.post(categoriesUrl, async ({ request }) => {
        const body = (await request.json()) as { name: string };
        if (body.name !== created.name) {
          return HttpResponse.json({ detail: 'Bad' }, { status: 422 });
        }
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    render(
      <ProviderWrapper>
        <Categories />
      </ProviderWrapper>,
    );

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

    await userEvent.type(screen.getByLabelText(/category name/i), created.name);
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Categories\s+\(1\)/)).toBeInTheDocument();
    });
    expect(screen.getByText(created.name)).toBeInTheDocument();
  });

  it('edit flow: click Edit, change name, submit, list updated', async () => {
    const items = categoriesMock(1);
    const updated = categoryMock();
    let listData = [...items];
    server.use(
      http.get(categoriesUrl, () => HttpResponse.json(listData)),
      http.patch(
        `${API_URL}/categories/${items[0].id}/`,
        async ({ request }) => {
          const body = (await request.json()) as { name?: string };
          const updated = categoryMock({ name: body.name ?? items[0].name });
          listData = [updated];
          return HttpResponse.json(updated);
        },
      ),
    );

    render(
      <ProviderWrapper>
        <Categories />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(items[0].name)).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit-button');
    await userEvent.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: /edit category/i }),
      ).toBeInTheDocument();
    });

    const nameField = screen.getByLabelText(/category name/i);
    await userEvent.clear(nameField);
    await userEvent.type(nameField, updated.name);
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText(updated.name)).toBeInTheDocument();
    });
  });

  it('delete flow: click Delete, confirm, list no longer contains category', async () => {
    const items = categoriesMock(1);
    let getCount = 0;
    server.use(
      http.get(categoriesUrl, () => {
        getCount += 1;
        return HttpResponse.json(getCount === 1 ? items : []);
      }),
      http.delete(`${API_URL}/categories/${items[0].id}/`, () =>
        HttpResponse.json(null, { status: 204 }),
      ),
    );

    render(
      <ProviderWrapper>
        <Categories />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-button');
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('delete-category-dialog-content'),
      ).toHaveTextContent(`Delete category «${items[0].name}»?`);
    });

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
    });
    expect(screen.queryByText('ToDelete')).not.toBeInTheDocument();
  });
});
