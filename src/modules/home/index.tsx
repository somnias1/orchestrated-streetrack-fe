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
import { groupBy, sortBy } from 'underscore';
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
  const dueLabel = `Day ${item.due_day}`;
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

  const {
    data: balanceQueryData,
    isError: isBalanceQueryError,
    error: balanceQueryError,
    isLoading: balanceQueryLoading,
    refetch: balanceQueryRefetch,
  } = useDashboardBalanceQuery();
  const {
    data: monthBalanceQueryData,
    isError: isMonthBalanceQueryError,
    error: monthBalanceQueryError,
    isLoading: monthBalanceQueryLoading,
    refetch: monthBalanceQueryRefetch,
  } = useDashboardMonthBalanceQuery(monthParams);
  const {
    data: dueExpensesQueryData,
    isError: isDueExpensesQueryError,
    error: dueExpensesQueryError,
    isLoading: dueExpensesQueryLoading,
    refetch: dueExpensesQueryRefetch,
  } = useDashboardDuePeriodicExpensesQuery(monthParams);

  const balanceError =
    isBalanceQueryError && balanceQueryError instanceof Error
      ? balanceQueryError.message
      : balanceQueryError
        ? 'Failed to load balance'
        : null;
  const monthBalanceError =
    isMonthBalanceQueryError && monthBalanceQueryError instanceof Error
      ? monthBalanceQueryError.message
      : monthBalanceQueryError
        ? 'Failed to load month balance'
        : null;
  const dueExpensesError =
    isDueExpensesQueryError && dueExpensesQueryError instanceof Error
      ? dueExpensesQueryError.message
      : dueExpensesQueryError
        ? 'Failed to load due periodic expenses'
        : null;

  const dueExpensesGrouped = useMemo(() => {
    if (dueExpensesQueryData == null || dueExpensesQueryData.length === 0) {
      return [];
    }
    const byDayKey = groupBy(dueExpensesQueryData, 'due_day');
    const sections = Object.entries(byDayKey).map(([key, items]) => {
      const dueDay = Number(key);
      const unpaid = sortBy(
        items.filter((i) => !i.paid),
        'subcategory_name',
      );
      const paid = sortBy(
        items.filter((i) => i.paid),
        'subcategory_name',
      );
      return { dueDay, unpaid, paid };
    });
    sections.sort((a, b) => a.dueDay - b.dueDay);
    return sections;
  }, [dueExpensesQueryData]);

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
          loading={balanceQueryLoading}
          error={balanceError}
          onRetry={() => balanceQueryRefetch()}
        >
          <Typography variant="h5" sx={{ color: themeTokens.textPrimary }}>
            {balanceQueryData != null
              ? formatBalance(balanceQueryData.balance)
              : '—'}
          </Typography>
        </DashboardSection>

        <DashboardSection
          title="Month balance"
          loading={monthBalanceQueryLoading}
          error={monthBalanceError}
          onRetry={() => monthBalanceQueryRefetch()}
        >
          <Typography variant="h5" sx={{ color: themeTokens.textPrimary }}>
            {monthBalanceQueryData != null
              ? formatBalance(monthBalanceQueryData.balance)
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
          loading={dueExpensesQueryLoading}
          error={dueExpensesError}
          onRetry={() => dueExpensesQueryRefetch()}
        >
          {dueExpensesQueryData != null && dueExpensesQueryData.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxHeight: '39vh',
                overflowY: 'auto',
                paddingRight: 1,
              }}
            >
              {dueExpensesGrouped.map((section) => (
                <Box key={section.dueDay}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: themeTokens.textPrimary, mb: 1 }}
                  >
                    Day {section.dueDay}
                  </Typography>
                  {section.unpaid.length > 0 ? (
                    <Box>
                      {section.paid.length > 0 ? (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: themeTokens.textSecondary,
                            mb: 0.5,
                          }}
                        >
                          Due
                        </Typography>
                      ) : null}
                      {section.unpaid.map((item) => (
                        <DueExpenseItem key={item.subcategory_id} item={item} />
                      ))}
                    </Box>
                  ) : null}
                  {section.paid.length > 0 ? (
                    <Box sx={{ mt: section.unpaid.length > 0 ? 1 : 0 }}>
                      {section.unpaid.length > 0 ? (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: themeTokens.textSecondary,
                            mb: 0.5,
                          }}
                        >
                          Paid
                        </Typography>
                      ) : null}
                      {section.paid.map((item) => (
                        <DueExpenseItem key={item.subcategory_id} item={item} />
                      ))}
                    </Box>
                  ) : null}
                </Box>
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
