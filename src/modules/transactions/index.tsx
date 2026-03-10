import AddRounded from '@mui/icons-material/AddRounded';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
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

export function Transactions() {
  const queryClient = useQueryClient();

  const [listParams, _setListParams] = useState<TransactionsListParams>(
    defaultTransactionsListParams,
  );
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
