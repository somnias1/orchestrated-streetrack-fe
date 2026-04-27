import type { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { config } from '../../config';
import { toPaginatedRead } from '../../services/pagination';
import { Subcategories } from './index';
import { subcategoriesPaths } from '../../services/subcategories/constants';
import { categoriesPaths } from '../../services/categories/constants';
import ProviderWrapper from '../../utils/test/provider';
import {
  subcategoryMock,
  subcategoriesMock,
} from '../../services/subcategories/mocks';
import { categoriesMock } from '../../services/categories/mocks';

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

const queryClientConfig: ConstructorParameters<typeof QueryClient>[0] = {
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
};

const API_URL = config.apiUrl;
const subcategoriesUrl = `${API_URL}/${subcategoriesPaths.list}`;
const categoriesUrl = `${API_URL}/${categoriesPaths.list}`;

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Subcategories screen', () => {
  it('shows loading spinner while fetching', async () => {
    server.use(
      http.get(subcategoriesUrl, () => {
        return new Promise((resolve) =>
          setTimeout(
            () => resolve(HttpResponse.json(toPaginatedRead([]))),
            500,
          ),
        );
      }),
      http.get(categoriesUrl, () => HttpResponse.json(toPaginatedRead([]))),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('shows virtualized rows when API returns subcategories', async () => {
    const items = subcategoriesMock(2);
    server.use(
      http.get(subcategoriesUrl, () =>
        HttpResponse.json(toPaginatedRead(items)),
      ),
      http.get(categoriesUrl, () => HttpResponse.json(toPaginatedRead([]))),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

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
      http.get(categoriesUrl, () => HttpResponse.json(toPaginatedRead([]))),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

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
        return HttpResponse.json(toPaginatedRead(subcategoriesMock(1)));
      }),
      http.get(categoriesUrl, () => HttpResponse.json(toPaginatedRead([]))),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

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
      http.get(subcategoriesUrl, () => HttpResponse.json(toPaginatedRead([]))),
      http.get(categoriesUrl, () => HttpResponse.json(toPaginatedRead([]))),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('No subcategories found.')).toBeInTheDocument();
    });
  });

  it('create flow: open dialog, fill form, submit, list includes new subcategory', async () => {
    const categories = categoriesMock(1);
    const created = subcategoryMock({
      name: 'New Sub',
      category_id: categories[0].id,
      category_name: categories[0].name,
    });
    let listCalls = 0;
    server.use(
      http.get(categoriesUrl, () =>
        HttpResponse.json(toPaginatedRead(categories)),
      ),
      http.get(subcategoriesUrl, () => {
        listCalls += 1;
        return HttpResponse.json(
          listCalls === 1 ? toPaginatedRead([]) : toPaginatedRead([created]),
        );
      }),
      http.post(subcategoriesUrl, async ({ request }) => {
        const body = (await request.json()) as { name: string };
        expect(body.name).toBe(created.name);
        return HttpResponse.json(created, { status: 201 });
      }),
      http.get(`${API_URL}/${categoriesPaths.get(categories[0].id)}`, () =>
        HttpResponse.json(categories[0]),
      ),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

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

    // Open category combobox and select category
    await userEvent.click(within(dialog).getByTestId('subcategory-form-category'));
    await userEvent.type(
      screen.getByPlaceholderText('Search category…'),
      categories[0].name,
    );
    const categoryOption = await screen.findByRole('option', {
      name: new RegExp(categories[0].name, 'i'),
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
    const categories = categoriesMock(1);
    const items = [
      subcategoryMock({
        name: 'Groceries',
        category_id: categories[0].id,
        category_name: categories[0].name,
      }),
    ];
    const updated = { ...items[0], name: 'Groceries Updated' };
    let listData = [...items];
    server.use(
      http.get(categoriesUrl, () =>
        HttpResponse.json(toPaginatedRead(categories)),
      ),
      http.get(subcategoriesUrl, () =>
        HttpResponse.json(toPaginatedRead(listData)),
      ),
      http.patch(
        `${API_URL}/${subcategoriesPaths.update(items[0].id)}`,
        async ({ request }) => {
          const body = (await request.json()) as { name?: string };
          expect(body.name).toBe('Groceries Updated');
          listData = [updated];
          return HttpResponse.json(updated);
        },
      ),
      http.get(`${API_URL}/${categoriesPaths.get(categories[0].id)}`, () =>
        HttpResponse.json(categories[0]),
      ),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

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
    const categories = categoriesMock(1);
    const items = [
      subcategoryMock({
        name: 'ToDelete',
        category_id: categories[0].id,
        category_name: categories[0].name,
      }),
    ];
    let getCount = 0;
    server.use(
      http.get(categoriesUrl, () =>
        HttpResponse.json(toPaginatedRead(categories)),
      ),
      http.get(subcategoriesUrl, () => {
        getCount += 1;
        return HttpResponse.json(
          getCount === 1 ? toPaginatedRead(items) : toPaginatedRead([]),
        );
      }),
      http.delete(`${API_URL}/${subcategoriesPaths.delete(items[0].id)}`, () =>
        HttpResponse.json(null, { status: 204 }),
      ),
    );

    render(
      <ProviderWrapper queryClientConfig={queryClientConfig}>
        <Subcategories />
      </ProviderWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('ToDelete')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText(
      new RegExp(`delete ${items[0].name}`, 'i'),
    );
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`Delete subcategory «${items[0].name}»?`, 'i'),
        ),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.getByText('No subcategories found.')).toBeInTheDocument();
    });
    expect(screen.queryByText('ToDelete')).not.toBeInTheDocument();
  });
});
