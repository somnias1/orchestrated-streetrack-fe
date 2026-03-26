import AddRounded from '@mui/icons-material/AddRounded';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import FilterAltOff from '@mui/icons-material/FilterAltOff';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  TablePagination,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { config } from '../../config';
import { dashboardQueryKey } from '../../services/dashboard/constants';
import { useHangoutsQuery } from '../../services/hangouts';
import { useSubcategoriesQuery } from '../../services/subcategories';
import {
  downloadCsvBlob,
  transactionManagerPaths,
  useImportPreviewMutation,
} from '../../services/transactionManager';
import {
  useBulkCreateTransactionsMutation,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
  useUpdateTransactionMutation,
} from '../../services/transactions';
import { transactionsQueryKey } from '../../services/transactions/constants';
import type {
  TransactionBulkCreate,
  TransactionRead,
  TransactionsListParams,
} from '../../services/transactions/types';
import { DEFAULT_LIST_LIMIT, PICKER_LIST_PARAMS } from '../../services/types';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../theme/tailwind';
import useCallbackApi from '../../utils/callbackApi';
import { useHangoutsStore } from '../hangouts/store';
import { useSubcategoriesStore } from '../subcategories/store';
import { BulkTransactionsDialog } from './bulkTransactionsDialog';
import {
  DAY_OPTIONS,
  getDefaultMonth,
  getDefaultYear,
  MONTHS,
  YEAR_OPTIONS,
} from './constants';
import { DeleteTransactionDialog } from './deleteTransactionDialog';
import { ImportTransactionsDialog } from './importTransactionsDialog';
import { useTransactionsStore } from './store';
import { TransactionFormDialog } from './transactionFormDialog';
import { TransactionsTable } from './transactionsTable';

export function Transactions() {
  const queryClient = useQueryClient();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [year, setYear] = useState(getDefaultYear);
  const [month, setMonth] = useState(getDefaultMonth);
  const [day, setDay] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [hangoutId, setHangoutId] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIST_LIMIT);

  const listParams = useMemo<TransactionsListParams>(() => {
    const params: TransactionsListParams = {
      skip: page * rowsPerPage,
      limit: rowsPerPage,
    };
    if (year !== '') params.year = Number(year);
    if (month !== '') params.month = Number(month);
    if (day !== '') params.day = Number(day);
    if (subcategoryId) params.subcategory_id = subcategoryId;
    if (hangoutId) params.hangout_id = hangoutId;
    return params;
  }, [year, month, day, subcategoryId, hangoutId, page, rowsPerPage]);

  const clearFilters = useCallback(() => {
    setYear('');
    setMonth('');
    setDay('');
    setSubcategoryId('');
    setHangoutId('');
    setPage(0);
  }, []);

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactionsQuery(listParams);
  const items = listData?.items ?? [];
  const total = listData?.total ?? 0;

  const { data: subcategoriesData } = useSubcategoriesQuery(PICKER_LIST_PARAMS);
  const { data: hangoutsData } = useHangoutsQuery(PICKER_LIST_PARAMS);
  const subcategories = subcategoriesData?.items ?? [];
  const hangouts = hangoutsData?.items ?? [];
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
    queryClient.invalidateQueries({ queryKey: [dashboardQueryKey] });
  }, [queryClient]);

  const createMutation = useCreateTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      setShowSnackBar(true);
      setSnackBarMessage('Transaction created');
    },
  });
  const updateMutation = useUpdateTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      setShowSnackBar(true);
      setSnackBarMessage('Transaction updated');
    },
  });
  const deleteMutation = useDeleteTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      setShowSnackBar(true);
      setSnackBarMessage('Transaction deleted');
    },
  });
  const bulkCreateMutation = useBulkCreateTransactionsMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      setShowSnackBar(true);
      setSnackBarMessage('Transactions bulk created');
    },
  });

  const { callbackApi } = useCallbackApi();
  const importPreviewMutation = useImportPreviewMutation();
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
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSubmitError, setBulkSubmitError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importPreviewError, setImportPreviewError] = useState<string | null>(
    null,
  );
  const [importSubmitError, setImportSubmitError] = useState<string | null>(
    null,
  );
  const [exporting, setExporting] = useState(false);

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

  const openBulk = useCallback(() => {
    setAddMenuAnchor(null);
    setBulkSubmitError(null);
    setBulkOpen(true);
  }, []);

  const openImport = useCallback(() => {
    setAddMenuAnchor(null);
    setImportPreviewError(null);
    setImportSubmitError(null);
    setImportOpen(true);
  }, []);

  const handleCloseSnackBar = useCallback(() => {
    setShowSnackBar(false);
  }, []);

  const handleImportPreview = useCallback(
    async (
      rows: import('../../services/transactionManager/types').TransactionImportRow[],
    ) => {
      setImportPreviewError(null);
      try {
        return await importPreviewMutation.mutateAsync({ rows });
      } catch (err) {
        setImportPreviewError(
          err instanceof Error ? err.message : 'Preview failed',
        );
        throw err;
      }
    },
    [importPreviewMutation],
  );

  const handleImportSubmit = useCallback(
    async (body: TransactionBulkCreate) => {
      setImportSubmitError(null);
      try {
        await bulkCreateMutation.mutateAsync(body);
        setImportOpen(false);
      } catch (err) {
        setImportSubmitError(
          err instanceof Error ? err.message : 'Import create failed',
        );
        throw err;
      }
    },
    [bulkCreateMutation],
  );

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const exportParams = {
        ...(listParams.year !== undefined && { year: listParams.year }),
        ...(listParams.month !== undefined && { month: listParams.month }),
        ...(listParams.day !== undefined && { day: listParams.day }),
        ...(listParams.subcategory_id && {
          subcategory_id: listParams.subcategory_id,
        }),
        ...(listParams.hangout_id && {
          hangout_id: listParams.hangout_id,
        }),
      };
      await downloadCsvBlob(() =>
        callbackApi<Blob>(transactionManagerPaths.export, {
          params: exportParams,
          baseURL: config.apiUrl,
          responseType: 'blob',
        }),
      );
    } finally {
      setExporting(false);
    }
  }, [callbackApi, listParams]);

  const handleBulkSubmit = useCallback(
    async (body: TransactionBulkCreate) => {
      setBulkSubmitError(null);
      try {
        await bulkCreateMutation.mutateAsync(body);
        setBulkOpen(false);
      } catch (err) {
        setBulkSubmitError(
          err instanceof Error ? err.message : 'Bulk create failed',
        );
        throw err;
      }
    },
    [bulkCreateMutation],
  );

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
          {total > 0 ? ` (${total})` : ''}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          endIcon={<ArrowDropDownRounded />}
          onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={Boolean(addMenuAnchor)}
          sx={{ backgroundColor: themeTokens.primary }}
          data-testid="transactions-add-button"
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
          <MenuItem onClick={openBulk}>Bulk</MenuItem>
          <MenuItem onClick={openImport}>Import</MenuItem>
        </Menu>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlined />}
          onClick={handleExport}
          disabled={exporting}
          sx={{
            borderColor: themeTokens.border,
            color: themeTokens.textPrimary,
          }}
          data-testid="transactions-export-csv-button"
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 90, ...selectFormControlSx }}>
          <InputLabel id="transactions-year-label">Year</InputLabel>
          <Select
            labelId="transactions-year-label"
            id="transactions-year"
            value={year}
            label="Year"
            onChange={(e) => {
              setPage(0);
              setYear(e.target.value);
            }}
            sx={selectThemedSx}
            MenuProps={{ PaperProps: { sx: selectMenuPaperSx } }}
          >
            <MenuItem value="">All</MenuItem>
            {YEAR_OPTIONS.map((y) => (
              <MenuItem key={y} value={String(y)}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: 100, ...selectFormControlSx }}
        >
          <InputLabel id="transactions-month-label">Month</InputLabel>
          <Select
            labelId="transactions-month-label"
            id="transactions-month"
            value={month}
            label="Month"
            onChange={(e) => {
              setPage(0);
              setMonth(e.target.value);
            }}
            sx={selectThemedSx}
            MenuProps={{ PaperProps: { sx: selectMenuPaperSx } }}
          >
            <MenuItem value="">All</MenuItem>
            {MONTHS.map((m) => (
              <MenuItem key={m} value={String(m)}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 80, ...selectFormControlSx }}>
          <InputLabel id="transactions-day-label">Day</InputLabel>
          <Select
            labelId="transactions-day-label"
            id="transactions-day"
            value={day}
            label="Day"
            onChange={(e) => {
              setPage(0);
              setDay(e.target.value);
            }}
            sx={selectThemedSx}
            MenuProps={{
              PaperProps: { sx: { ...selectMenuPaperSx, maxHeight: 350 } },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {DAY_OPTIONS.map((d) => (
              <MenuItem key={d} value={String(d)}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: themeTokens.border }}
        />
        <FormControl
          size="small"
          sx={{ minWidth: 180, ...selectFormControlSx }}
        >
          <InputLabel id="transactions-subcategory-label">
            Subcategory
          </InputLabel>
          <Select
            labelId="transactions-subcategory-label"
            id="transactions-subcategory-filter"
            value={subcategoryId}
            label="Subcategory"
            onChange={(e) => {
              setPage(0);
              setSubcategoryId(e.target.value);
            }}
            sx={selectThemedSx}
            MenuProps={{
              PaperProps: { sx: { ...selectMenuPaperSx, maxHeight: 350 } },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {subcategories.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: 160, ...selectFormControlSx }}
        >
          <InputLabel id="transactions-hangout-label">Hangout</InputLabel>
          <Select
            labelId="transactions-hangout-label"
            id="transactions-hangout-filter"
            value={hangoutId}
            label="Hangout"
            onChange={(e) => {
              setPage(0);
              setHangoutId(e.target.value);
            }}
            sx={selectThemedSx}
            MenuProps={{
              PaperProps: { sx: { ...selectMenuPaperSx, maxHeight: 350 } },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {hangouts.map((h) => (
              <MenuItem key={h.id} value={h.id}>
                {h.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: themeTokens.border }}
        />
        <IconButton
          onClick={clearFilters}
          sx={{
            alignSelf: 'flex-start',
            color: themeTokens.textSecondary,
            '&.Mui-disabled': { color: themeTokens.disabled },
          }}
          disabled={!year && !month && !day && !subcategoryId && !hangoutId}
        >
          <FilterAltOff />
        </IconButton>
      </Box>
      <TransactionsTable
        items={items}
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number.parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          color: themeTokens.textSecondary,
          borderTop: `1px solid ${themeTokens.border}`,
        }}
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
      <BulkTransactionsDialog
        open={bulkOpen}
        onClose={() => {
          setBulkOpen(false);
          setBulkSubmitError(null);
        }}
        onSubmit={handleBulkSubmit}
        submitError={bulkSubmitError}
        submitting={bulkCreateMutation.isPending}
        subcategoryOptions={subcategoryOptions}
        hangoutOptions={hangoutOptions}
      />
      <ImportTransactionsDialog
        open={importOpen}
        onClose={() => {
          setImportOpen(false);
          setImportPreviewError(null);
          setImportSubmitError(null);
        }}
        onPreview={handleImportPreview}
        onSubmit={handleImportSubmit}
        previewError={importPreviewError}
        submitError={importSubmitError}
        previewing={importPreviewMutation.isPending}
        submitting={bulkCreateMutation.isPending}
      />
      <Snackbar
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
        autoHideDuration={1500}
        data-testid="transactions-snackbar"
      />
    </Box>
  );
}
