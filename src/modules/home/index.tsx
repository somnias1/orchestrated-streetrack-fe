import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { groupBy, sortBy } from 'underscore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type DashboardMonthParams,
  useDashboardBalanceQuery,
  useDashboardDuePeriodicExpensesQuery,
  useDashboardMonthBalanceQuery,
} from '../../services/dashboard';
import type { DashboardDuePeriodicExpenseRead } from '../../services/dashboard/types';
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

function SectionCard({
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
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            <Button size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function DueExpenseItem({
  item,
}: Readonly<{ item: DashboardDuePeriodicExpenseRead }>) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div>
        <p className="text-sm text-foreground">{item.subcategory_name}</p>
        <p className="text-xs text-muted-foreground">
          {item.category_name} &middot; Day {item.due_day}
        </p>
      </div>
      <Badge variant={item.paid ? 'paid' : 'due'}>
        {item.paid ? 'Paid' : 'Due'}
      </Badge>
    </div>
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
    data: balanceData,
    isError: isBalanceError,
    error: balanceError,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useDashboardBalanceQuery();

  const {
    data: monthBalanceData,
    isError: isMonthBalanceError,
    error: monthBalanceError,
    isLoading: monthBalanceLoading,
    refetch: refetchMonthBalance,
  } = useDashboardMonthBalanceQuery(monthParams);

  const {
    data: dueExpensesData,
    isError: isDueExpensesError,
    error: dueExpensesError,
    isLoading: dueExpensesLoading,
    refetch: refetchDueExpenses,
  } = useDashboardDuePeriodicExpensesQuery(monthParams);

  const balanceErrorMsg = isBalanceError
    ? balanceError instanceof Error
      ? balanceError.message
      : 'Failed to load balance'
    : null;
  const monthBalanceErrorMsg = isMonthBalanceError
    ? monthBalanceError instanceof Error
      ? monthBalanceError.message
      : 'Failed to load month balance'
    : null;
  const dueExpensesErrorMsg = isDueExpensesError
    ? dueExpensesError instanceof Error
      ? dueExpensesError.message
      : 'Failed to load due expenses'
    : null;

  const dueExpensesGrouped = useMemo(() => {
    if (!dueExpensesData?.length) return [];
    const byDay = groupBy(dueExpensesData, 'due_day');
    return Object.entries(byDay)
      .map(([key, items]) => ({
        dueDay: Number(key),
        unpaid: sortBy(
          items.filter((i) => !i.paid),
          'subcategory_name',
        ),
        paid: sortBy(
          items.filter((i) => i.paid),
          'subcategory_name',
        ),
      }))
      .sort((a, b) => a.dueDay - b.dueDay);
  }, [dueExpensesData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DASHBOARD_YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {new Date(2000, m - 1, 1).toLocaleString(undefined, {
                    month: 'long',
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SectionCard
          title="Cumulative balance"
          loading={balanceLoading}
          error={balanceErrorMsg}
          onRetry={() => refetchBalance()}
        >
          <p className="text-3xl font-bold text-foreground">
            {balanceData != null
              ? formatBalance(balanceData.balance)
              : '&#8212;'}
          </p>
        </SectionCard>

        <SectionCard
          title="Month balance"
          loading={monthBalanceLoading}
          error={monthBalanceErrorMsg}
          onRetry={() => refetchMonthBalance()}
        >
          <p className="text-3xl font-bold text-foreground">
            {monthBalanceData != null
              ? formatBalance(monthBalanceData.balance)
              : '&#8212;'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(2000, month - 1, 1).toLocaleString(undefined, {
              month: 'long',
            })}{' '}
            {year}
          </p>
        </SectionCard>
      </div>

      <SectionCard
        title="Due periodic expenses"
        loading={dueExpensesLoading}
        error={dueExpensesErrorMsg}
        onRetry={() => refetchDueExpenses()}
      >
        {dueExpensesGrouped.length > 0 ? (
          <div className="max-h-[40vh] overflow-y-auto space-y-4 pr-1">
            {dueExpensesGrouped.map((section) => (
              <div key={section.dueDay}>
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                  Day {section.dueDay}
                </p>
                {section.unpaid.map((item) => (
                  <DueExpenseItem key={item.subcategory_id} item={item} />
                ))}
                {section.paid.map((item) => (
                  <DueExpenseItem key={item.subcategory_id} item={item} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No due periodic expenses for this month.
          </p>
        )}
      </SectionCard>
    </div>
  );
}
