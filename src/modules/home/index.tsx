/**
 * Home screen — Dashboard: cumulative balance, month balance, due periodic expenses (TECHSPEC §3.4).
 */
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import {
  type DashboardMonthParams,
  useDashboardBalanceQuery,
  useDashboardDuePeriodicExpensesQuery,
  useDashboardMonthBalanceQuery,
} from '../../services/dashboard';
import type { DashboardDuePeriodicExpenseRead } from '../../services/dashboard/types';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../theme/tailwind';
import {
  DASHBOARD_YEAR_OPTIONS,
  DEFAULT_DASHBOARD_MONTH,
  DEFAULT_DASHBOARD_YEAR,
  MONTHS,
} from './constants';

function formatBalance(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function DashboardSection({
  title,
  loading,
  error,
  onRetry,
  children,
}: Readonly<{
  title: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}>) {
  if (loading) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          border: `1px solid ${themeTokens.border}`,
          backgroundColor: themeTokens.surface,
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={32} sx={{ color: themeTokens.primary }} />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          border: `1px solid ${themeTokens.border}`,
          backgroundColor: themeTokens.surface,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: themeTokens.textPrimary, mb: 1 }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: themeTokens.error, mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={onRetry}
          size="small"
          sx={{ backgroundColor: themeTokens.primary }}
        >
          Retry
        </Button>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        border: `1px solid ${themeTokens.border}`,
        backgroundColor: themeTokens.surface,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: themeTokens.textSecondary, mb: 1 }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function DueExpenseItem({ item }: { item: DashboardDuePeriodicExpenseRead }) {
  const dueLabel = item.due_day != null ? `Day ${item.due_day}` : '—';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        borderBottom: `1px solid ${themeTokens.border}`,
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ color: themeTokens.textPrimary }}>
          {item.subcategory_name}
        </Typography>
        <Typography variant="caption" sx={{ color: themeTokens.textSecondary }}>
          {item.category_name} · {dueLabel}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: item.paid ? themeTokens.success : themeTokens.textSecondary,
        }}
      >
        {item.paid ? 'Paid' : 'Due'}
      </Typography>
    </Box>
  );
}

export function Home() {
  const [year, setYear] = useState(DEFAULT_DASHBOARD_YEAR);
  const [month, setMonth] = useState(DEFAULT_DASHBOARD_MONTH);

  const monthParams = useMemo<DashboardMonthParams>(
    () => ({ year, month }),
    [year, month],
  );

  const balanceQuery = useDashboardBalanceQuery();
  const monthBalanceQuery = useDashboardMonthBalanceQuery(monthParams);
  const dueExpensesQuery = useDashboardDuePeriodicExpensesQuery(monthParams);

  const balanceError =
    balanceQuery.isError && balanceQuery.error instanceof Error
      ? balanceQuery.error.message
      : balanceQuery.isError
        ? 'Failed to load balance'
        : null;
  const monthBalanceError =
    monthBalanceQuery.isError && monthBalanceQuery.error instanceof Error
      ? monthBalanceQuery.error.message
      : monthBalanceQuery.isError
        ? 'Failed to load month balance'
        : null;
  const dueExpensesError =
    dueExpensesQuery.isError && dueExpensesQuery.error instanceof Error
      ? dueExpensesQuery.error.message
      : dueExpensesQuery.isError
        ? 'Failed to load due periodic expenses'
        : null;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ color: themeTokens.textPrimary, mb: 2 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl
          size="small"
          sx={{ minWidth: 100, ...selectFormControlSx }}
        >
          <InputLabel id="dashboard-year-label">Year</InputLabel>
          <Select
            labelId="dashboard-year-label"
            id="dashboard-year"
            value={year}
            label="Year"
            onChange={(e) => setYear(Number(e.target.value))}
            sx={selectThemedSx}
            MenuProps={{ PaperProps: { sx: selectMenuPaperSx } }}
          >
            {DASHBOARD_YEAR_OPTIONS.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: 120, ...selectFormControlSx }}
        >
          <InputLabel id="dashboard-month-label">Month</InputLabel>
          <Select
            labelId="dashboard-month-label"
            id="dashboard-month"
            value={month}
            label="Month"
            onChange={(e) => setMonth(Number(e.target.value))}
            sx={selectThemedSx}
            MenuProps={{ PaperProps: { sx: selectMenuPaperSx } }}
          >
            {MONTHS.map((m) => (
              <MenuItem key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString(undefined, {
                  month: 'long',
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DashboardSection
          title="Cumulative balance"
          loading={balanceQuery.isLoading}
          error={balanceError}
          onRetry={() => balanceQuery.refetch()}
        >
          <Typography variant="h5" sx={{ color: themeTokens.textPrimary }}>
            {balanceQuery.data != null
              ? formatBalance(balanceQuery.data.balance)
              : '—'}
          </Typography>
        </DashboardSection>

        <DashboardSection
          title="Month balance"
          loading={monthBalanceQuery.isLoading}
          error={monthBalanceError}
          onRetry={() => monthBalanceQuery.refetch()}
        >
          <Typography variant="h5" sx={{ color: themeTokens.textPrimary }}>
            {monthBalanceQuery.data != null
              ? formatBalance(monthBalanceQuery.data.balance)
              : '—'}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: themeTokens.textSecondary }}
          >
            {year} · Month {month}
          </Typography>
        </DashboardSection>

        <DashboardSection
          title="Due periodic expenses"
          loading={dueExpensesQuery.isLoading}
          error={dueExpensesError}
          onRetry={() => dueExpensesQuery.refetch()}
        >
          {dueExpensesQuery.data != null && dueExpensesQuery.data.length > 0 ? (
            <Box>
              {dueExpensesQuery.data.map((item) => (
                <DueExpenseItem key={item.subcategory_id} item={item} />
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: themeTokens.textSecondary }}
            >
              No due periodic expenses for this month.
            </Typography>
          )}
        </DashboardSection>
      </Box>
    </Box>
  );
}
