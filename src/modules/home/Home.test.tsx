import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { config } from '../../config';
import { dashboardPaths } from '../../services/dashboard/constants';
import ProviderWrapper from '../../utils/test/provider';
import { Home } from './index';

const API_URL = config.apiUrl as string;
const balanceUrl = `${API_URL}/${dashboardPaths.balance}`;
const monthBalanceUrl = `${API_URL}/${dashboardPaths.monthBalance}`;
const dueExpensesUrl = `${API_URL}/${dashboardPaths.duePeriodicExpenses}`;

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function successHandlers(
  balance = 1500,
  monthBalance = 300,
  dueExpenses: object[] = [],
) {
  return [
    http.get(balanceUrl, () => HttpResponse.json({ balance })),
    http.get(monthBalanceUrl, () =>
      HttpResponse.json({ balance: monthBalance, year: 2026, month: 4 }),
    ),
    http.get(dueExpensesUrl, () => HttpResponse.json(dueExpenses)),
  ];
}

function renderHome() {
  return render(
    <ProviderWrapper queryClientConfig={{ defaultOptions: { queries: { retry: false } } }}>
      <Home />
    </ProviderWrapper>,
  );
}

describe('Home dashboard', () => {
  it('renders the dashboard heading', async () => {
    server.use(...successHandlers());
    renderHome();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays cumulative balance after load', async () => {
    server.use(...successHandlers(500));
    renderHome();
    await waitFor(() =>
      expect(screen.getByText('500')).toBeInTheDocument(),
    );
  });

  it('displays month balance after load', async () => {
    server.use(...successHandlers(0, 750));
    renderHome();
    await waitFor(() =>
      expect(screen.getByText('750')).toBeInTheDocument(),
    );
  });

  it('shows "No due periodic expenses" when list is empty', async () => {
    server.use(...successHandlers(0, 0, []));
    renderHome();
    await waitFor(() =>
      expect(
        screen.getByText(/no due periodic expenses/i),
      ).toBeInTheDocument(),
    );
  });

  it('renders due expense items grouped by day', async () => {
    const dueExpenses = [
      {
        subcategory_id: 'sub-1',
        subcategory_name: 'Gym',
        category_id: 'cat-1',
        category_name: 'Health',
        due_day: 5,
        paid: false,
      },
      {
        subcategory_id: 'sub-2',
        subcategory_name: 'Netflix',
        category_id: 'cat-2',
        category_name: 'Entertainment',
        due_day: 10,
        paid: true,
      },
    ];
    server.use(...successHandlers(0, 0, dueExpenses));
    renderHome();

    await waitFor(() => expect(screen.getByText('Gym')).toBeInTheDocument());
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Day 5')).toBeInTheDocument();
    expect(screen.getByText('Day 10')).toBeInTheDocument();
    expect(screen.getByText('Due')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('shows error message and retry button when balance query fails', async () => {
    let calls = 0;
    server.use(
      http.get(balanceUrl, () => {
        calls += 1;
        return HttpResponse.json({ detail: 'Server error' }, { status: 500 });
      }),
      http.get(monthBalanceUrl, () =>
        HttpResponse.json({ balance: 0, year: 2026, month: 4 }),
      ),
      http.get(dueExpensesUrl, () => HttpResponse.json([])),
    );

    renderHome();

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /retry/i }).length).toBeGreaterThan(0),
    );

    const retryBtn = screen.getAllByRole('button', { name: /retry/i })[0];
    await userEvent.click(retryBtn);
    await waitFor(() => expect(calls).toBeGreaterThan(1));
  });

  it('renders section card titles', async () => {
    server.use(...successHandlers());
    renderHome();
    expect(screen.getByText(/cumulative balance/i)).toBeInTheDocument();
    expect(screen.getByText(/month balance/i)).toBeInTheDocument();
    expect(screen.getByText(/due periodic expenses/i)).toBeInTheDocument();
  });
});
