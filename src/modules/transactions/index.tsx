import AddRounded from '@mui/icons-material/AddRounded';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHangoutsQuery } from '../../services/hangouts';
import { useSubcategoriesQuery } from '../../services/subcategories';
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
  useUpdateTransactionMutation,
} from '../../services/transactions';
import { transactionsQueryKey } from '../../services/transactions/constants';
import type {
  TransactionRead,
  TransactionsListParams,
} from '../../services/transactions/types';
import { themeTokens } from '../../theme/tailwind';
import { useHangoutsStore } from '../hangouts/store';
import { useSubcategoriesStore } from '../subcategories/store';
import { defaultTransactionsListParams } from './constants';
import { DeleteTransactionDialog } from './deleteTransactionDialog';
import { useTransactionsStore } from './store';
import { TransactionFormDialog } from './transactionFormDialog';
import { TransactionsTable } from './transactionsTable';

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
  CURRENT_YEAR - 2,
  CURRENT_YEAR - 1,
  CURRENT_YEAR,
  CURRENT_YEAR + 1,
];
const DAY_OPTIONS = [...Array(31)].map((_, i) => i + 1);

export function Transactions() {
  const queryClient = useQueryClient();

  const [year, setYear] = useState(
    () => defaultTransactionsListParams.year ?? CURRENT_YEAR,
  );
  const [month, setMonth] = useState(
    () => defaultTransactionsListParams.month ?? new Date().getMonth() + 1,
  );
  const [day, setDay] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [hangoutId, setHangoutId] = useState('');
  const listParams = useMemo<TransactionsListParams>(() => {
    const params: TransactionsListParams = {
      skip: 0,
      limit: defaultTransactionsListParams.limit ?? 50,
      year,
      month,
    };
    if (day !== '') params.day = Number(day);
    if (subcategoryId) params.subcategory_id = subcategoryId;
    if (hangoutId) params.hangout_id = hangoutId;
    return params;
  }, [year, month, day, subcategoryId, hangoutId]);

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactionsQuery(listParams);
  const { data: subcategories = [] } = useSubcategoriesQuery();
  const { data: hangouts = [] } = useHangoutsQuery();
  const setTransactionsFromQuery = useTransactionsStore((s) => s.setFromQuery);
  const setSubcategoriesFromQuery = useSubcategoriesStore(
    (s) => s.setFromQuery,
  );
  const setHangoutsFromQuery = useHangoutsStore((s) => s.setFromQuery);

  useEffect(() => {
    const err =
      isError && error instanceof Error
        ? error.message
        : isError
          ? 'Failed to load transactions'
          : null;
    setTransactionsFromQuery(items, isLoading, err);
  }, [items, isLoading, isError, error, setTransactionsFromQuery]);

  useEffect(() => {
    setSubcategoriesFromQuery(subcategories, false, null);
  }, [subcategories, setSubcategoriesFromQuery]);

  useEffect(() => {
    setHangoutsFromQuery(hangouts, false, null);
  }, [hangouts, setHangoutsFromQuery]);

  const handleInvalidateTransactions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [transactionsQueryKey] });
  }, [queryClient]);

  const createMutation = useCreateTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
    },
  });
  const updateMutation = useUpdateTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
    },
  });
  const deleteMutation = useDeleteTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
    },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [formInitial, setFormInitial] = useState<{
    subcategory_id: string;
    value: number;
    description: string;
    date: string;
    hangout_id: string | null;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionRead | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : isError
        ? 'Failed to load transactions'
        : null;

  const openCreate = useCallback(() => {
    setAddMenuAnchor(null);
    setEditingTransactionId(null);
    setFormInitial(null);
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openBulkStub = useCallback(() => {
    setAddMenuAnchor(null);
    // Phase 22: Bulk transactions dialog; stub for Phase 18
  }, []);

  const openEdit = useCallback((transaction: TransactionRead) => {
    setEditingTransactionId(transaction.id);
    setFormInitial({
      subcategory_id: transaction.subcategory_id,
      value: transaction.value,
      description: transaction.description,
      date: transaction.date.slice(0, 10),
      hangout_id: transaction.hangout_id,
    });
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((transaction: TransactionRead) => {
    setTransactionToDelete(transaction);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: {
      subcategory_id: string;
      value: number;
      description: string;
      date: string;
      hangout_id: string | null;
    }) => {
      setSubmitError(null);
      try {
        if (editingTransactionId === null) {
          await createMutation.mutateAsync(data);
        } else {
          await updateMutation.mutateAsync({
            id: editingTransactionId,
            body: data,
          });
        }
        setFormOpen(false);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
        throw err;
      }
    },
    [editingTransactionId, createMutation, updateMutation],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
      setDeleteOpen(false);
      setTransactionToDelete(null);
    },
    [deleteMutation],
  );

  const subcategoryOptions = subcategories.map((s) => ({
    id: s.id,
    name: s.name,
    belongs_to_income: s.belongs_to_income,
  }));
  const hangoutOptions = hangouts.map((h) => ({ id: h.id, name: h.name }));

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: themeTokens.textPrimary }}>
          Transactions
          {items.length > 0 ? ` (${items.length})` : ''}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          endIcon={<ArrowDropDownRounded />}
          onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={Boolean(addMenuAnchor)}
          sx={{ backgroundColor: themeTokens.primary }}
        >
          Add
        </Button>
        <Menu
          anchorEl={addMenuAnchor}
          open={Boolean(addMenuAnchor)}
          onClose={() => setAddMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={openCreate}>Transaction</MenuItem>
          <MenuItem onClick={openBulkStub}>Bulk</MenuItem>
        </Menu>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 90 }}>
          <InputLabel id="transactions-year-label">Year</InputLabel>
          <Select
            labelId="transactions-year-label"
            id="transactions-year"
            value={year}
            label="Year"
            onChange={(e) => setYear(Number(e.target.value))}
            sx={{ backgroundColor: themeTokens.surface }}
          >
            {YEAR_OPTIONS.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel id="transactions-month-label">Month</InputLabel>
          <Select
            labelId="transactions-month-label"
            id="transactions-month"
            value={month}
            label="Month"
            onChange={(e) => setMonth(Number(e.target.value))}
            sx={{ backgroundColor: themeTokens.surface }}
          >
            {MONTHS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel id="transactions-day-label">Day</InputLabel>
          <Select
            labelId="transactions-day-label"
            id="transactions-day"
            value={day}
            label="Day"
            onChange={(e) => setDay(e.target.value)}
            sx={{ backgroundColor: themeTokens.surface }}
          >
            <MenuItem value="">All</MenuItem>
            {DAY_OPTIONS.map((d) => (
              <MenuItem key={d} value={String(d)}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="transactions-subcategory-label">
            Subcategory
          </InputLabel>
          <Select
            labelId="transactions-subcategory-label"
            id="transactions-subcategory-filter"
            value={subcategoryId}
            label="Subcategory"
            onChange={(e) => setSubcategoryId(e.target.value)}
            sx={{ backgroundColor: themeTokens.surface }}
          >
            <MenuItem value="">All</MenuItem>
            {subcategories.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="transactions-hangout-label">Hangout</InputLabel>
          <Select
            labelId="transactions-hangout-label"
            id="transactions-hangout-filter"
            value={hangoutId}
            label="Hangout"
            onChange={(e) => setHangoutId(e.target.value)}
            sx={{ backgroundColor: themeTokens.surface }}
          >
            <MenuItem value="">All</MenuItem>
            {hangouts.map((h) => (
              <MenuItem key={h.id} value={h.id}>
                {h.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TransactionsTable
        items={items}
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <TransactionFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialValues={formInitial}
        onSubmit={handleFormSubmit}
        submitError={submitError}
        subcategoryOptions={subcategoryOptions}
        hangoutOptions={hangoutOptions}
      />
      <DeleteTransactionDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setTransactionToDelete(null);
        }}
        transaction={transactionToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
